// Analytics slots (15.3). Nothing loads unless its env var is set; the marketing team adds the IDs
// later in Vercel. track() is a safe no-op until then.
//   VITE_GA_ID           Google Analytics 4 (G-XXXX)
//   VITE_GTM_ID          Google Tag Manager (GTM-XXXX)
//   VITE_META_PIXEL_ID   Meta Pixel

const GA = import.meta.env.VITE_GA_ID;
const GTM = import.meta.env.VITE_GTM_ID;
const PIXEL = import.meta.env.VITE_META_PIXEL_ID;

let started = false;

function addScript(src) {
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

/** Load whichever analytics are configured. Call once on startup. */
export function initAnalytics() {
  if (started || typeof window === 'undefined') return;
  started = true;
  window.dataLayer = window.dataLayer || [];
  if (GTM) {
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    addScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM)}`);
  }
  if (GA) {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA);
    addScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA)}`);
  }
  if (PIXEL) {
    const fbq = function fbq() {
      fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
    };
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = '2.0';
    window.fbq = window.fbq || fbq;
    addScript('https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', PIXEL);
    window.fbq('track', 'PageView');
  }
}

/**
 * Track a named event (15.3): story_stage_view, story_complete, skip_story, whatsapp_click,
 * trial_click, language_switch.
 * @param {string} name
 * @param {Record<string, string|number>} [params]
 */
export function track(name, params = {}) {
  try {
    if (window.gtag && GA) window.gtag('event', name, params);
    if (GTM) window.dataLayer?.push({ event: name, ...params });
    if (window.fbq && PIXEL) window.fbq('trackCustom', name, params);
  } catch {
    /* analytics must never break the page */
  }
}
