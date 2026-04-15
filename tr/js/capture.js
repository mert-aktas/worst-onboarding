/**
 * Dünyanın En Kötü Onboarding (TR): Lead capture
 * UTM capture, HubSpot Forms API submission, calendar redirect.
 */

const Capture = {
  // ── Config ─────────────────────────────────────────────
  PORTAL_ID: '8289649',
  FORM_GUID: '2a9e7a38-f4cf-49e5-84bf-34a7ac546624',
  CALENDAR_URL: 'https://meetings.hubspot.com/laskan/userguiding-meeting-with-levent-askan',
  REDIRECT_DELAY_SECONDS: 3,

  // ── State ──────────────────────────────────────────────
  ctx: null,

  // ── Init ───────────────────────────────────────────────
  init() {
    this.captureContext();
    this.bindForm();
  },

  bindForm() {
    const form = document.getElementById('capture-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  },

  async handleSubmit() {
    const emailInput = document.getElementById('capture-email');
    const submitBtn = document.getElementById('capture-submit');
    const errorEl = document.getElementById('capture-error');
    const email = emailInput.value.trim();

    if (!email || !emailInput.checkValidity()) {
      emailInput.reportValidity();
      return;
    }

    errorEl.hidden = true;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Gönderiliyor…';

    try {
      await this.submitToHubspot(email);
      this.showSuccessAndRedirect(email);
    } catch (err) {
      console.error('HubSpot submit failed:', err);
      errorEl.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Levent\'le Tanış';
    }
  },

  async submitToHubspot(email) {
    const payload = {
      fields: [
        { objectTypeId: '0-1', name: 'email', value: email }
      ],
      context: {
        pageUri: window.location.href,
        pageName: 'Worst Onboarding Ever TR'
      }
    };

    const url = `https://api.hsforms.com/submissions/v3/integration/submit/${this.PORTAL_ID}/${this.FORM_GUID}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HubSpot ${res.status}: ${text}`);
    }
    return res.json();
  },

  // ── Success state + redirect ───────────────────────────
  showSuccessAndRedirect(email) {
    const formWrap = document.getElementById('capture-form-wrap');
    const successWrap = document.getElementById('capture-success-wrap');
    const countdownEl = document.getElementById('capture-countdown');
    const fallbackLink = document.getElementById('capture-fallback-link');

    const ctx = this.getContext();
    const params = new URLSearchParams();
    params.set('email', email);
    if (ctx.utm_source)   params.set('utm_source', ctx.utm_source);
    if (ctx.utm_medium)   params.set('utm_medium', ctx.utm_medium);
    if (ctx.utm_campaign) params.set('utm_campaign', ctx.utm_campaign);
    if (ctx.utm_content)  params.set('utm_content', ctx.utm_content);
    if (ctx.utm_term)     params.set('utm_term', ctx.utm_term);
    const calendarUrl = `${this.CALENDAR_URL}?${params.toString()}`;
    fallbackLink.href = calendarUrl;

    formWrap.hidden = true;
    successWrap.hidden = false;

    let remaining = this.REDIRECT_DELAY_SECONDS;
    countdownEl.textContent = remaining;

    const tick = () => {
      remaining -= 1;
      if (remaining <= 0) {
        window.location.href = calendarUrl;
        return;
      }
      countdownEl.textContent = remaining;
      setTimeout(tick, 1000);
    };
    setTimeout(tick, 1000);
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
