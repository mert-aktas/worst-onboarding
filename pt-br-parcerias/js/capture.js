/**
 * O Pior Onboarding (PT-BR Parcerias): Captura de leads
 * UTM capture, HubSpot Forms API submission, calendar redirect.
 */

const Capture = {
  // ── Config ─────────────────────────────────────────────
  PORTAL_ID: '<PORTAL_ID>',
  FORM_GUID: '<FORM_GUID>',
  SUBSCRIPTION_TYPE_ID: '<SUBSCRIPTION_TYPE_ID>',
  CALENDAR_URL: 'https://start.userguiding.com/meetings/bmilet',
  REDIRECT_DELAY_SECONDS: 3,

  // ── State ──────────────────────────────────────────────
  ctx: null,

  // ── Init ───────────────────────────────────────────────
  init() {
    this.captureContext();
    // Form submit wiring is added in Task 8.
  },

  // ── UTM Capture ────────────────────────────────────────
  captureContext() {
    const params = new URLSearchParams(window.location.search);
    this.ctx = {
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_content: params.get('utm_content') || '',
      utm_term: params.get('utm_term') || '',
      referrer_url: document.referrer || '',
      landing_ts: new Date().toISOString()
    };
    try {
      sessionStorage.setItem('wo_capture_ctx', JSON.stringify(this.ctx));
    } catch (e) {
      // sessionStorage unavailable (private browsing on some platforms). Keep ctx in memory only.
      console.warn('sessionStorage unavailable, capture context held in memory only.');
    }
  },

  getContext() {
    if (this.ctx) return this.ctx;
    try {
      const stored = sessionStorage.getItem('wo_capture_ctx');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      utm_source: '', utm_medium: '', utm_campaign: '',
      utm_content: '', utm_term: '', referrer_url: '', landing_ts: ''
    };
  }
};

document.addEventListener('DOMContentLoaded', () => Capture.init());
