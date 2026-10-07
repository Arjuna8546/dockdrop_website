/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ledger: 'var(--ledger)',
        turmeric: 'var(--turmeric)',
        chilli: 'var(--chilli)',
        paper: 'var(--paper)',
        'ink-2': 'var(--ink-2)',
        mute: 'var(--mute)',
        whatsapp: 'var(--whatsapp)',
      },
      fontFamily: {
        sora: ['Sora', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
        ml: ['"Noto Sans Malayalam"', 'system-ui', 'sans-serif'],
        kalam: ['Kalam', 'cursive'],
      },
      borderRadius: {
        card: '20px',
        btn: '14px',
      },
      boxShadow: {
        ui: '0 12px 32px rgba(21,22,14,0.18)',
      },
      screens: {
        tablet: '768px',
        desktop: '1024px',
      },
    },
  },
  plugins: [],
};
