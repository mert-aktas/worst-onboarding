/**
 * Worst Onboarding Ever — analytics instrumentation
 * Fans gameplay events to GA4 (gtag, loaded from <head>) and LinkedIn (Insight Tag).
 * Every path fails safe: if a provider is blocked or errors, the others still run
 * and gameplay is never affected.
 */

// Variant derived from the URL path: /worst-onboarding/<variant>/ → 'tr',
// 'pt-br', 'pt-br-parcerias', 'pt-br-yasmin'. Root reports 'en'.
const WOE_VARIANT = (location.pathname.match(/worst-onboarding\/([a-z-]+)\//) || [])[1] || 'en';

// ── LinkedIn Insight Tag ──────────────────────────────────────────────────────
// Master switch. Defaults on, matching the GA4 posture. Flip to false to gate the
// LinkedIn tag and all its calls behind consent — nothing else changes.
const WOE_LI_ENABLED = true;
const LI_PARTNER_ID = '2295498';

// Funnel step → LinkedIn conversion ID (created in Campaign Manager 2026-06-29).
const LI_CONVERSIONS = {
  game_start: 29129145,
  reached_l2: 29129153,
  reached_l3: 29129161,
  reached_l4: 29129169,
  reached_l5: 29129177,
  game_complete: 29129185,
  cta_click: 29129193
};

// Boot the Insight Tag once: LinkedIn's standard base snippet. The script's own
// initial load sends the page-view for the real (base) URL — that powers the
// "visited the game" audience and readies lintrk for conversions.
function liLoadTag() {
  if (!WOE_LI_ENABLED || window._woe_li_init) return;
  window._woe_li_init = true;
  window._linkedin_partner_id = LI_PARTNER_ID;
  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
  window._linkedin_data_partner_ids.push(LI_PARTNER_ID);
  if (typeof window.lintrk !== 'function') {
    window.lintrk = function (a, b) { window.lintrk.q.push([a, b]); };
    window.lintrk.q = [];
  }
  const first = document.getElementsByTagName('script')[0];
  const s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  s.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
  first.parentNode.insertBefore(s, first);
}

// Register a page-view for the CURRENT (virtual) URL. The Insight Tag only auto-sends
// a page-view on a real page load and has no SPA / virtual-pageview API, and a script
// re-insert does not re-send one (verified against the live beacon). This direct
// collect beacon mirrors the tag's own page-view request so each ?s= stage URL reaches
// LinkedIn for URL-based audiences. Fire-and-forget; carries the LinkedIn cookie.
function liPageView() {
  try {
    new Image().src = 'https://px.ads.linkedin.com/collect?v=2&fmt=js&pid=' +
      LI_PARTNER_ID + '&time=' + Date.now() + '&url=' + encodeURIComponent(location.href);
  } catch (e) { /* ignore */ }
}

// Fire a LinkedIn conversion by funnel-step key.
function liTrack(key) {
  if (!WOE_LI_ENABLED) return;
  const id = LI_CONVERSIONS[key];
  if (id && typeof window.lintrk === 'function') {
    window.lintrk('track', { conversion_id: id });
  }
}

// Stamp the URL with ?s=<stage> (preserving existing params like utm_* / li_fat_id)
// then register a page-view for it. replaceState (not pushState) keeps the back
// button clean; a query param (not a path) keeps it refresh-safe on GitHub Pages.
function liStage(stage) {
  if (!WOE_LI_ENABLED) return;
  try {
    const url = new URL(location.href);
    url.searchParams.set('s', stage);
    history.replaceState(null, '', url);
  } catch (e) { /* ignore */ }
  liPageView();
}

// Map a gameplay event to its stage URL (stamped FIRST, so the conversion that
// follows also carries the stamped URL) + its LinkedIn conversion.
function liDispatch(name, params) {
  if (!WOE_LI_ENABLED) return;
  if (name === 'game_start') {
    liStage('start');
    liTrack('game_start');
  } else if (name === 'level_complete') {
    const lvl = params.level; // level just cleared, 1..5
    if (lvl >= 1 && lvl <= 4) { // reaching the NEXT level (L2..L5)
      liStage('l' + (lvl + 1));
      liTrack('reached_l' + (lvl + 1));
    }
    // lvl === 5 (final level cleared) → the finish is reported by game_complete
  } else if (name === 'game_complete') {
    liStage('done');
    liTrack('game_complete');
  } else if (name === 'cta_click') {
    liTrack('cta_click');
  }
}

// ── Unified event sink ────────────────────────────────────────────────────────
// game.js calls track(); we fan out to GA4 and LinkedIn. Each provider is wrapped
// so a failure in one (or an ad blocker) never breaks gameplay or the other path.
function track(name, params = {}) {
  try {
    if (typeof gtag === 'function') {
      gtag('event', name, Object.assign({ variant: WOE_VARIANT }, params));
    }
  } catch (e) { /* ignore */ }
  try {
    liDispatch(name, params);
  } catch (e) { /* ignore */ }
}

// Outbound CTA clicks to the marketing site (title footer + end-screen "Fix it" link).
// Excludes games.userguiding.com so cross-links to other games (e.g. the WOE 2 button)
// fire only their own event, not cta_click / its LinkedIn conversion.
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href*="userguiding.com"]:not([href*="games.userguiding.com"])');
  if (link) track('cta_click', { link_url: link.href });
});

// Boot the LinkedIn tag on load: captures the base "visited" URL and readies lintrk.
try { liLoadTag(); } catch (e) { /* ignore */ }
