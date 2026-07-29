import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type LocaleMessages = Record<string, unknown>;

export interface LocaleInfo {
  /** File-derived code, e.g. "en", "te" */
  code: string;
  /** Short toggle label from locale meta.label */
  label: string;
  /** Full name from locale meta.nativeName */
  nativeName: string;
  messages: LocaleMessages;
}

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

const STORAGE_KEY = 'booking-lang';
const DEFAULT_LOCALE = 'en';

/** Auto-discover every `src/locales/*.json` — add a file to add a language. */
const localeModules = import.meta.glob('../locales/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, LocaleMessages>;

function codeFromPath(path: string): string {
  const match = path.match(/\/([^/]+)\.json$/);
  return match?.[1] ?? path;
}

function readString(messages: LocaleMessages, key: string): string | undefined {
  const parts = key.split('.');
  let cur: unknown = messages;
  for (const part of parts) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return typeof cur === 'string' ? cur : undefined;
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  let out = template;
  for (const [k, v] of Object.entries(vars)) {
    out = out.split(`{${k}}`).join(String(v));
  }
  return out;
}

/** All available locales, derived from JSON files on disk. */
export const LOCALES: LocaleInfo[] = Object.entries(localeModules)
  .map(([path, messages]) => {
    const code = codeFromPath(path);
    return {
      code,
      label: readString(messages, 'meta.label') ?? code.toUpperCase(),
      nativeName: readString(messages, 'meta.nativeName') ?? code,
      messages,
    };
  })
  .sort((a, b) => a.code.localeCompare(b.code));

const catalogs = Object.fromEntries(LOCALES.map((l) => [l.code, l.messages])) as Record<
  string,
  LocaleMessages
>;

const localeCodes = new Set(LOCALES.map((l) => l.code));

function resolveDefaultLocale(): string {
  if (localeCodes.has(DEFAULT_LOCALE)) return DEFAULT_LOCALE;
  return LOCALES[0]?.code ?? DEFAULT_LOCALE;
}

let activeLocale = resolveDefaultLocale();

export function getActiveLocale(): string {
  return activeLocale;
}

/** Non-React translator (WhatsApp message, formatters). Uses the active locale. */
export function translate(key: string, vars?: Record<string, string | number>): string {
  const fallback = catalogs[resolveDefaultLocale()];
  const current = catalogs[activeLocale] ?? fallback;
  const raw =
    (current && readString(current, key)) ??
    (fallback && readString(fallback, key)) ??
    key;
  return interpolate(raw, vars);
}

function readStoredLocale(): string {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && localeCodes.has(raw)) return raw;
  } catch {
    /* ignore */
  }
  return resolveDefaultLocale();
}

interface LangContextValue {
  lang: string;
  locales: LocaleInfo[];
  setLang: (lang: string) => void;
  t: TranslateFn;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState(readStoredLocale);

  const setLang = useCallback((next: string) => {
    if (!localeCodes.has(next)) return;
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    activeLocale = lang;
    document.documentElement.lang = lang;
  }, [lang]);

  // Keep module-level translator in sync on first render too
  activeLocale = lang;

  const t = useCallback<TranslateFn>(
    (key, vars) => {
      const fallback = catalogs[resolveDefaultLocale()];
      const current = catalogs[lang] ?? fallback;
      const raw =
        (current && readString(current, key)) ??
        (fallback && readString(fallback, key)) ??
        key;
      return interpolate(raw, vars);
    },
    [lang],
  );

  const value = useMemo(
    () => ({ lang, locales: LOCALES, setLang, t }),
    [lang, setLang, t],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}

/** Renders one button per discovered locale JSON — no language ids hardcoded. */
export function LanguageToggle() {
  const { lang, locales, setLang, t } = useLang();

  if (locales.length < 2) return null;

  return (
    <div
      className="inline-flex items-center rounded-full border border-line bg-white/80 p-1 text-[0.78rem] font-bold shadow-sm"
      role="group"
      aria-label={t('lang.switch')}
    >
      {locales.map((locale) => {
        const active = lang === locale.code;
        return (
          <button
            key={locale.code}
            type="button"
            onClick={() => setLang(locale.code)}
            aria-pressed={active}
            title={locale.nativeName}
            className={[
              'rounded-full px-3 py-1 transition-colors',
              active ? 'bg-emerald text-ivory' : 'text-ink-soft hover:text-ink',
            ].join(' ')}
          >
            {locale.label}
          </button>
        );
      })}
    </div>
  );
}

/** Wizard step ids — labels come from locale `step.<id>`. */
export const STEP_IDS = [
  'patient',
  'profile',
  'department',
  'specialist',
  'datetime',
  'confirm',
] as const;
