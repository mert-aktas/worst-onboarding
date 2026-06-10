/**
 * Worst Onboarding Ever — GA4 instrumentation
 * Sends gameplay events to the UserGuiding GA4 property (G-EP331KDLPN).
 * gtag is loaded from the <head>; everything here no-ops if it is blocked
 * by an ad blocker or fails to load.
 */

// Variant derived from the URL path: /worst-onboarding/<variant>/ → 'tr',
// 'pt-br', 'pt-br-parcerias', 'pt-br-yasmin'. Root reports 'en'.
const WOE_VARIANT = (location.pathname.match(/worst-onboarding\/([a-z-]+)\//) || [])[1] || 'en';

function track(name, params = {}) {
  if (typeof gtag !== 'function') return;
  gtag('event', name, Object.assign({ variant: WOE_VARIANT }, params));
}

// Outbound CTA clicks (title footer + end screen link to userguiding.com)
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href*="userguiding.com"]');
  if (link) track('cta_click', { link_url: link.href });
});
