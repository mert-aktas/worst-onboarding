/**
 * O Pior Onboarding (PT-BR Parcerias): Captura de leads
 * UTM capture, HubSpot Forms API submission, calendar redirect.
 */

const Capture = {
  // ── Config ─────────────────────────────────────────────
  PORTAL_ID: '8289649',
  FORM_GUID: '23ff4b6d-a7c9-4742-818b-01b509670b27',
  CALENDAR_URL: 'https://start.userguiding.com/meetings/bmilet',
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
    submitBtn.textContent = 'Enviando…';

    try {
      await this.submitToHubspot(email);
      // Success state wiring is added in Task 9.
      console.log('Submitted successfully (success UI added in Task 9).');
    } catch (err) {
      console.error('HubSpot submit failed:', err);
      errorEl.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Falar com a Bárbara';
    }
  },

  async submitToHubspot(email) {
    const payload = {
      fields: [
        { objectTypeId: '0-1', name: 'email', value: email }
      ],
      context: {
        pageUri: window.location.href,
        pageName: 'Worst Onboarding Ever PT-BR Parcerias'
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
