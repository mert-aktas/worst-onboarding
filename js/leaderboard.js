/**
 * Worst Onboarding Ever — global leaderboard client
 * Talks to the woe-leaderboard Worker (D1). Shared by all variants; language
 * picked off WOE_VARIANT (from analytics.js). Degrades silently if the API
 * is unreachable (ad blockers, file:// testing): the section just stays empty.
 *
 * Boards: "blind" = first run on this device (patience score),
 *         "speedrun" = replays (pure time). Decided at game start by whether
 *         a personal best already exists in localStorage.
 */

const LB = (() => {
  const API = 'https://woe-leaderboard.ynot-partners.workers.dev';

  // Dormant in prod (end screen got crowded — Mert, 2026-06-11). Enable for
  // testing/events with ?leaderboard=1 or localStorage.setItem('woe-lb','1').
  const ENABLED = new URLSearchParams(location.search).has('leaderboard')
    || localStorage.getItem('woe-lb') === '1';

  const LANG = (typeof WOE_VARIANT !== 'undefined' && WOE_VARIANT.startsWith('tr')) ? 'tr'
    : (typeof WOE_VARIANT !== 'undefined' && WOE_VARIANT.startsWith('pt-br')) ? 'pt'
    : 'en';

  const STR = {
    en: { title: 'Leaderboard', blind: 'First Victims', speedrun: 'Speedrunners',
          join: 'Join the leaderboard', hint: '3 letters. Empty = ANO.',
          done: "You're on the board.", time: 'Time', rage: 'Rage', patience: 'Patience',
          empty: 'No survivors yet.' },
    tr: { title: 'Skor Tablosu', blind: 'İlk Kurbanlar', speedrun: 'Hız Koşusu',
          join: 'Skor tablosuna katıl', hint: '3 harf. Boş bırakırsan ANO.',
          done: 'Tablodasın.', time: 'Süre', rage: 'Öfke', patience: 'Sabır',
          empty: 'Henüz hayatta kalan yok.' },
    pt: { title: 'Placar', blind: 'Primeiras Vítimas', speedrun: 'Speedrun',
          join: 'Entrar no placar', hint: '3 letras. Vazio = ANO.',
          done: 'Você está no placar.', time: 'Tempo', rage: 'Raiva', patience: 'Paciência',
          empty: 'Nenhum sobrevivente ainda.' },
  }[LANG];

  let runToken = null;
  let runMode = 'speedrun';
  let lastStats = null;
  let submitted = false;

  function fmtTime(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, '0')}`;
  }

  async function api(path, opts) {
    const res = await fetch(API + path, opts);
    if (!res.ok) throw Object.assign(new Error('api'), { status: res.status });
    return res.json();
  }

  async function startRun() {
    runMode = localStorage.getItem('woe-best') ? 'speedrun' : 'blind';
    runToken = null;
    submitted = false;
    if (!ENABLED) return; // no token -> onGameEnd renders nothing
    try {
      runToken = await api('/api/run', { method: 'POST' });
    } catch (e) { /* offline / blocked: leaderboard quietly unavailable */ }
  }

  async function fetchTop(mode, limit = 10) {
    return api(`/api/top?mode=${mode}&limit=${limit}`);
  }

  function rowsHtml(entries, highlight) {
    if (!entries.length) return `<p class="lb-empty">${STR.empty}</p>`;
    return `<table class="lb-table"><thead><tr>
        <th>#</th><th></th><th>${STR.time}</th><th>${STR.rage}</th><th>${STR.patience}</th>
      </tr></thead><tbody>` + entries.map((e, i) => {
        const hl = highlight && e.initials === highlight.initials &&
                   Math.abs(e.total_seconds - highlight.total_seconds) < 0.01;
        return `<tr${hl ? ' class="lb-you"' : ''}>
          <td>${i + 1}</td>
          <td class="lb-name">${e.initials}<span class="lb-variant">${e.variant}</span></td>
          <td>${fmtTime(e.total_seconds)}</td>
          <td>${e.rage_clicks}</td>
          <td>${e.patience_score}</td>
        </tr>`;
      }).join('') + '</tbody></table>';
  }

  async function renderBoard(mode, highlight) {
    const board = document.getElementById('lb-board');
    if (!board) return;
    try {
      const data = await fetchTop(mode);
      board.innerHTML = rowsHtml(data.entries, highlight);
    } catch (e) {
      board.innerHTML = `<p class="lb-empty">${STR.empty}</p>`;
    }
    document.querySelectorAll('.lb-tab').forEach(t =>
      t.classList.toggle('lb-tab-active', t.dataset.mode === mode));
  }

  async function submit() {
    if (!runToken || !lastStats || submitted) return;
    const input = document.getElementById('lb-initials');
    const initials = (input.value || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
    const btn = document.getElementById('lb-join');
    btn.disabled = true;
    try {
      const res = await api('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...runToken,
          initials: initials || 'ANO',
          variant: (typeof WOE_VARIANT !== 'undefined') ? WOE_VARIANT : 'en',
          mode: runMode,
          total_seconds: lastStats.seconds,
          rage_clicks: lastStats.rage,
          patience_score: lastStats.patience,
        }),
      });
      submitted = true;
      document.getElementById('lb-entry').innerHTML = `<p class="lb-done">${STR.done}</p>`;
      if (typeof track === 'function') track('leaderboard_submit', { mode: runMode });
      renderBoard(runMode, { initials: res.initials, total_seconds: lastStats.seconds });
    } catch (e) {
      btn.disabled = false;
    }
  }

  function onGameEnd(stats) {
    lastStats = stats;
    const section = document.getElementById('leaderboard-section');
    if (!section) return;
    if (!runToken) { section.innerHTML = ''; return; } // API unreachable: stay invisible
    section.innerHTML = `
      <h2 class="lb-title">${STR.title}</h2>
      <div id="lb-entry" class="lb-entry">
        <input id="lb-initials" maxlength="3" placeholder="AAA" autocomplete="off"
               spellcheck="false" aria-label="initials">
        <button id="lb-join">${STR.join}</button>
        <p class="lb-hint">${STR.hint}</p>
      </div>
      <div class="lb-tabs">
        <button class="lb-tab" data-mode="blind">${STR.blind}</button>
        <button class="lb-tab" data-mode="speedrun">${STR.speedrun}</button>
      </div>
      <div id="lb-board"></div>`;
    document.getElementById('lb-join').addEventListener('click', submit);
    document.getElementById('lb-initials').addEventListener('input', (e) => {
      e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
    });
    section.querySelectorAll('.lb-tab').forEach(t =>
      t.addEventListener('click', () => renderBoard(t.dataset.mode)));
    renderBoard(runMode);
  }

  return { startRun, onGameEnd, fetchTop, fmtTime, STR, LANG };
})();

// const doesn't attach to window; the game.js hooks check window.LB
window.LB = LB;
