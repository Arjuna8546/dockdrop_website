import { useEffect } from 'react';
import { COPY, FAQ_KEYS } from '../content/copy.js';

/**
 * JSON-LD (15.3): SoftwareApplication (₹349 / month, Android + Web) and FAQPage, in the active
 * language. Rendered as one <script type="application/ld+json"> in <head>, replaced on change.
 * @param {'ml'|'en'} lang
 */
export function useStructuredData(lang) {
  useEffect(() => {
    const data = [
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'DockDrop',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Android, Web',
        inLanguage: ['ml', 'en'],
        description: COPY['meta.description'][lang],
        url: lang === 'en' ? 'https://www.dockdrop.in/?lang=en' : 'https://www.dockdrop.in/',
        offers: {
          '@type': 'Offer',
          price: '349',
          priceCurrency: 'INR',
          priceSpecification: { '@type': 'UnitPriceSpecification', price: '349', priceCurrency: 'INR', unitText: 'MONTH' },
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        inLanguage: lang,
        mainEntity: FAQ_KEYS.map((k) => ({
          '@type': 'Question',
          name: COPY[`${k}.q`][lang],
          acceptedAnswer: { '@type': 'Answer', text: COPY[`${k}.a`][lang] },
        })),
      },
    ];
    let el = document.getElementById('ld-json');
    if (!el) {
      el = document.createElement('script');
      el.id = 'ld-json';
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
  }, [lang]);
}
