/**
 * WOE Leaderboard API — Cloudflare Worker + D1
 * Runs on the dedicated UG games account; called from games.userguiding.com.
 *
 * Endpoints:
 *   POST /api/run            -> issue a signed run token at game_start
 *   POST /api/score          -> submit a finished run (validated, rate-limited)
 *   GET  /api/top?mode=&limit= -> leaderboard (blind: patience desc / speedrun: time asc)
 *   GET  /api/health         -> ok
 */

const ALLOWED_ORIGIN = 'https://games.userguiding.com';
const VARIANTS = ['en', 'tr', 'pt-br', 'pt-br-parcerias', 'pt-br-yasmin', 'party'];
const MODES = ['blind', 'speedrun'];

const MIN_GAME_SECONDS = 10;   // a perfect scripted run clocks ~14s of game time
const MIN_WALL_SECONDS = 15;   // wall clock between token and submit; forced transitions alone are ~10s, elite human replays land near 20s
const TOKEN_MAX_AGE = 3600;    // run tokens expire after an hour
const MAX_DAILY_PER_IP = 60;   // generous so a bar night on one venue IP fits

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...corsHeaders() },
  });
}

async function hmacHex(message, secret) {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}

async function sha256Hex(message) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message));
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
}

async function issueRunToken(env) {
  const runId = crypto.randomUUID();
  const ts = Math.floor(Date.now() / 1000);
  const sig = await hmacHex(`${runId}.${ts}`, env.WOE_HMAC_SECRET);
  return json({ run_id: runId, ts, sig });
}

async function submitScore(request, env) {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'bad json' }, 400); }

  const { run_id, ts, sig } = body;
  if (typeof run_id !== 'string' || !Number.isInteger(ts) || typeof sig !== 'string') {
    return json({ error: 'missing run token' }, 400);
  }
  const expected = await hmacHex(`${run_id}.${ts}`, env.WOE_HMAC_SECRET);
  if (sig !== expected) return json({ error: 'invalid token' }, 403);

  const now = Math.floor(Date.now() / 1000);
  const wall = now - ts;
  if (wall > TOKEN_MAX_AGE) return json({ error: 'token expired' }, 403);
  if (wall < MIN_WALL_SECONDS) return json({ error: 'too fast' }, 422);

  const totalSeconds = Number(body.total_seconds);
  const rageClicks = Number(body.rage_clicks);
  const patience = Number(body.patience_score);
  if (!Number.isFinite(totalSeconds) || totalSeconds < MIN_GAME_SECONDS || totalSeconds > 7200) {
    return json({ error: 'implausible time' }, 422);
  }
  if (totalSeconds > wall + 5) return json({ error: 'time exceeds wall clock' }, 422);
  if (!Number.isInteger(rageClicks) || rageClicks < 0 || rageClicks > 5000) {
    return json({ error: 'implausible rage' }, 422);
  }
  if (!Number.isInteger(patience) || patience < 0 || patience > 100) {
    return json({ error: 'implausible patience' }, 422);
  }

  const variant = VARIANTS.includes(body.variant) ? body.variant : null;
  const mode = MODES.includes(body.mode) ? body.mode : null;
  if (!variant || !mode) return json({ error: 'bad variant/mode' }, 400);

  let initials = String(body.initials || '').toUpperCase().trim();
  if (!/^[A-Z]{3}$/.test(initials)) initials = 'ANO';

  const ip = request.headers.get('CF-Connecting-IP') || '0.0.0.0';
  const ipHash = await sha256Hex(`${ip}|${env.WOE_HMAC_SECRET}`);

  const { results } = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM scores WHERE ip_hash = ?1 AND created_at > datetime('now', '-1 day')"
  ).bind(ipHash).all();
  if (results[0].n >= MAX_DAILY_PER_IP) return json({ error: 'daily limit' }, 429);

  try {
    await env.DB.prepare(
      'INSERT INTO scores (run_id, initials, variant, mode, total_seconds, rage_clicks, patience_score, ip_hash) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)'
    ).bind(run_id, initials, variant, mode, totalSeconds, rageClicks, patience, ipHash).run();
  } catch (e) {
    if (String(e).includes('UNIQUE')) return json({ error: 'already submitted' }, 409);
    throw e;
  }
  return json({ ok: true, initials, mode });
}

async function topScores(url, env) {
  const mode = url.searchParams.get('mode');
  if (!MODES.includes(mode)) return json({ error: 'bad mode' }, 400);
  const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '10', 10) || 10, 1), 50);
  const order = mode === 'speedrun'
    ? 'total_seconds ASC, rage_clicks ASC, created_at ASC'
    : 'patience_score DESC, total_seconds ASC, created_at ASC';
  const { results } = await env.DB.prepare(
    `SELECT initials, variant, mode, total_seconds, rage_clicks, patience_score, created_at
     FROM scores WHERE mode = ?1 ORDER BY ${order} LIMIT ?2`
  ).bind(mode, limit).all();
  return json({ mode, entries: results });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }
    if (url.pathname === '/api/health') return json({ ok: true });
    if (url.pathname === '/api/run' && request.method === 'POST') return issueRunToken(env);
    if (url.pathname === '/api/score' && request.method === 'POST') return submitScore(request, env);
    if (url.pathname === '/api/top' && request.method === 'GET') return topScores(url, env);

    return json({ error: 'not found' }, 404);
  },
};
