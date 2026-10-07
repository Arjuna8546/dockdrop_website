import { useLanguage } from '../../lib/useLanguage.jsx';
import { STAGES } from '../../content/stages.js';

/**
 * 9 progress dots (6.4) with a divider after `t`. Inactive 6px at 35%; active 6×22 turmeric pill;
 * visited Part A dots tinted chilli. Each is a focusable button; on hover or keyboard focus the
 * stage name appears beside it.
 */
export function ProgressDots({ index, visited, dark, onSelect }) {
  const { lang, t } = useLanguage();
  const base = dark ? 'var(--paper)' : 'var(--ledger)';

  return (
    <nav
      aria-label={t('aria.dots')}
      className="fixed right-[max(4px,env(safe-area-inset-right))] top-1/2 z-40 -translate-y-1/2 desktop:right-[max(14px,env(safe-area-inset-right))]"
    >
      <ol className="m-0 flex list-none flex-col items-center p-0">
        {STAGES.map((s, i) => {
          const isActive = i === index;
          const tinted = !isActive && s.part === 'A' && visited.has(i);
          return (
            <li key={s.id} className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-label={`${t('aria.goTo')} ${t(`stage.${s.id}.name`)}`}
                aria-current={isActive ? 'step' : undefined}
                className="group relative flex h-[30px] w-[36px] items-center justify-center rounded-full desktop:h-[26px] desktop:w-[44px]"
              >
                {/* Stage name on hover / keyboard focus (pointer devices only; touch has no hover) */}
                <span
                  aria-hidden="true"
                  lang={lang}
                  className="pointer-events-none absolute right-full top-1/2 mr-1 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-full px-3 py-1 text-[13px] font-semibold opacity-0 shadow-ui transition-all duration-200 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 [@media(hover:hover)]:group-hover:translate-x-0 [@media(hover:hover)]:group-hover:opacity-100"
                  style={{ background: dark ? 'var(--paper)' : 'var(--ledger)', color: dark ? 'var(--ledger)' : 'var(--paper)' }}
                >
                  {t(`stage.${s.id}.name`)}
                </span>
                <span
                  aria-hidden="true"
                  className="block w-[6px] rounded-full transition-all duration-300 [@media(hover:hover)]:group-hover:scale-125"
                  style={{
                    height: isActive ? 22 : 6,
                    background: isActive ? 'var(--turmeric)' : tinted ? 'var(--chilli)' : base,
                    opacity: isActive ? 1 : tinted ? 0.85 : 0.35,
                  }}
                />
              </button>
              {s.id === 't' && <span aria-hidden="true" className="my-1 block h-px w-3" style={{ background: base, opacity: 0.35 }} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
