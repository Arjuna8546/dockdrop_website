import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './lib/gsap.js';
import './styles/index.css';
import './styles/collage.css';
import './styles/sections.css';
import { LanguageProvider } from './lib/useLanguage.jsx';
import App from './App.jsx';
import { initAnalytics } from './lib/analytics.js';

initAnalytics();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
);
