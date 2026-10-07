import { Trust } from './Trust.jsx';
import { Pricing } from './Pricing.jsx';
import { Faq } from './Faq.jsx';
import { FinalCta } from './FinalCta.jsx';
import { Footer } from './Footer.jsx';

/** Post-story sections (13): calm, normal scrolling, Motion whileInView reveals only. */
export function PostStory() {
  return (
    <>
      <main>
        <Trust />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
