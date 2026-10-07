// WhatsApp links (§13). The number comes only from VITE_WHATSAPP_NUMBER, never hard-coded.

const NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/[^\d]/g, '');

/** @param {string} message already in the active language */
export function waLink(message) {
  return `https://wa.me/${NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Free trial entry point. Until self-signup exists it opens WhatsApp;
 * a form can replace this later without touching the buttons.
 * @param {string} message the `wa.trial` copy in the active language
 */
export function startTrial(message) {
  window.open(waLink(message), '_blank', 'noopener');
}
