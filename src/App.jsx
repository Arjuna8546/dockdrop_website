import { useEffect, useRef } from 'react';
import { MotionConfig } from 'motion/react';
import { STAGES } from './content/stages.js';
import { useStageNavigator } from './lib/useStageNavigator.js';
import { useReducedMotion } from './lib/useReducedMotion.js';
import { T, useLanguage } from './lib/useLanguage.jsx';
import { track } from './lib/analytics.js';
import { useStructuredData } from './lib/useStructuredData.js';
import { Header } from './components/layout/Header.jsx';
import { ProgressDots } from './components/layout/ProgressDots.jsx';
import { StoryTheatre } from './components/story/StoryTheatre.jsx';
import { PostStory } from './sections/PostStory.jsx';

const EXIT_TARGET = '#trust';

export default function App() {
  const reduced = useReducedMotion();
  const theatreRef = useRef(null);
  const scenesRef = useRef(/** @type {(import('./scenes/sceneContract.js').SceneHandle|null)[]} */ ([]));

  const nav = useStageNavigator({ theatreRef, scenesRef, count: STAGES.length, reduced, exitTarget: EXIT_TARGET });
  const stage = STAGES[nav.index];
  const headerDark = nav.storyActive && stage.dark;
  const { lang } = useLanguage();
  useStructuredData(lang);

  // Analytics (15.3): which stages people reach, and who finishes the story.
  useEffect(() => {
    track('story_stage_view', { stage: STAGES[nav.index].id });
    if (nav.index === STAGES.length - 1) track('story_complete');
  }, [nav.index]);

  const skipStory = () => {
    track('skip_story', { from: STAGES[nav.index].id });
    nav.leaveStory();
  };

  return (
    // Reduced motion: Motion reveals become short fades (3.4).
    <MotionConfig reducedMotion="user" transition={reduced ? { duration: 0.2 } : undefined}>
      <a
        href={EXIT_TARGET}
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          e.currentTarget.blur();
          skipStory();
          document.querySelector(EXIT_TARGET)?.focus({ preventScroll: true });
        }}
      >
        <T k="skipToContent" />
      </a>
      <div className="grain" aria-hidden="true" />
      <Header
        dark={headerDark}
        storyActive={nav.storyActive || reduced}
        solid={!nav.storyActive}
        onSkip={skipStory}
        onHome={() => {
          if (nav.storyActive) nav.goTo(0);
          else window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
        }}
      />
      <StoryTheatre ref={theatreRef} nav={nav} scenesRef={scenesRef} reduced={reduced} />
      {nav.storyActive && <ProgressDots index={nav.index} visited={nav.visited} dark={stage.dark} onSelect={nav.goTo} />}
      <PostStory />
    </MotionConfig>
  );
}
