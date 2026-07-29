import { Check, ArrowRight } from 'lucide-react';
import type { ReactNode, SVGProps } from 'react';
import { stepsForPatient, type PatientType } from '@/booking';
import { Button } from '@/components/ui/Button';
import { useLang } from '@/i18n';

/**
 * Shared selectable-card grid. Equal columns, fills the row, and reflows so
 * department / specialist screens share the same card size and gap.
 */
export const CARD_GRID =
  'grid gap-3 grid-cols-[repeat(auto-fit,minmax(14rem,1fr))]';

/** Title + description block — identical vertical rhythm on every step. */
export function StepHeader({
  title,
  subtitle,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <header className="mb-3 flex-none sm:mb-4">
      <h2 className="text-[clamp(1.25rem,2.8vw,1.7rem)] font-semibold text-ink">{title}</h2>
      {subtitle ? (
        <p className="mt-1 text-[0.88rem] leading-snug text-ink-soft">{subtitle}</p>
      ) : null}
    </header>
  );
}

export function SelectMark({ active }: { active: boolean }) {
  return (
    <span
      className={[
        'flex h-5 w-5 flex-none items-center justify-center rounded-full transition-colors',
        active ? 'bg-emerald text-ivory' : 'bg-mist text-transparent',
      ].join(' ')}
    >
      <Check className="h-3.5 w-3.5" strokeWidth={3} />
    </span>
  );
}

export function BookingProgress({
  step,
  patientType = null,
}: {
  step: number;
  patientType?: PatientType | null;
}) {
  const { t } = useLang();
  const steps = stepsForPatient(patientType);
  if (step > steps.length) return null;
  return (
    <ol className="mb-3 flex flex-none items-start justify-between gap-1 sm:mb-4">
      {steps.map((id, i) => {
        const n = i + 1;
        const done = n < step;
        const current = n === step;
        return (
          <li key={id} className="flex w-0 flex-1 flex-col items-center gap-1 text-center">
            <span
              className={[
                'flex h-7 w-7 flex-none items-center justify-center rounded-full text-[0.78rem] font-bold transition-colors',
                done
                  ? 'bg-emerald text-ivory'
                  : current
                    ? 'bg-gold text-emerald-deep ring-2 ring-gold-soft'
                    : 'bg-mist text-ink-faint',
              ].join(' ')}
            >
              {done ? <Check className="h-4 w-4" strokeWidth={2.6} /> : n}
            </span>
            <span
              className={`min-h-8 w-full text-[0.65rem] font-semibold leading-tight [overflow-wrap:anywhere] ${
                current ? 'text-emerald' : 'hidden text-ink-faint sm:block'
              }`}
            >
              {t(`step.${id}`)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}


interface NavProps {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  /** Review uses the gold confirm button; every other step uses emerald. */
  nextVariant?: 'emerald' | 'gold';
  /** Leading icon. When given it replaces the trailing arrow. */
  nextIcon?: ReactNode;
  error?: string | null;
}

/**
 * Single footer for every step so actions sit at the same height with the
 * same gaps and button sizes throughout.
 */
export function BookingNav({
  onBack,
  onNext,
  nextLabel,
  nextVariant = 'emerald',
  nextIcon,
  error,
}: NavProps) {
  const { t } = useLang();
  return (
    <div className="flex-none">
      {error && (
        <p className="mb-2 rounded-lg border border-rose/50 bg-rose-soft/50 px-3 py-2 text-[0.85rem] font-semibold leading-snug text-danger">
          {error}
        </p>
      )}
      <div className="flex items-center justify-between gap-3">
        {onBack ? (
          <Button variant="ghost" size="sm" className="min-w-0 shrink" onClick={onBack}>
            {t('nav.back')}
          </Button>
        ) : (
          <span />
        )}
        <Button variant={nextVariant} size="md" className="max-w-[70%] flex-none" onClick={onNext}>
          {nextIcon}
          {nextLabel ?? t('nav.continue')}
          {nextIcon ? null : <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12.05 2C6.5 2 2 6.5 2 12.05c0 1.77.46 3.5 1.35 5.02L2 22l5.05-1.32A10 10 0 0 0 12.05 22C17.6 22 22 17.5 22 11.95 22 6.4 17.6 2 12.05 2Zm0 18.3a8.3 8.3 0 0 1-4.23-1.16l-.3-.18-3 .79.8-2.92-.2-.31a8.26 8.26 0 0 1-1.27-4.41c0-4.58 3.73-8.3 8.31-8.3 4.58 0 8.3 3.72 8.3 8.3 0 4.58-3.72 8.3-8.31 8.3Zm5.45-5.9c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.62.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}
