import { Check } from 'lucide-react';
import { formatShortDate, type BookingState } from '@/booking';
import { Button } from '@/components/ui/Button';
import { useLang } from '@/i18n';

interface Props {
  state: BookingState;
  onRestart: () => void;
}

export function StepSuccess({ state, onRestart }: Props) {
  const { t } = useLang();
  const when =
    (state.date ? formatShortDate(state.date) : '') +
    (state.slot ? ` ${t('success.at')} ${state.slot}` : '');

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="m-auto w-full max-w-xl px-2 py-2 text-center">
        <div className="mx-auto flex h-14 w-14 flex-none items-center justify-center rounded-full bg-gradient-to-br from-jade-bright to-emerald text-ivory shadow-lg animate-popIn">
          <Check className="h-7 w-7" strokeWidth={2.6} />
        </div>
        <h2 className="mt-4 text-[clamp(1.5rem,3.5vw,2.2rem)] font-semibold text-ink">
          {t('success.title')}
        </h2>
        <p className="mx-auto mt-2 max-w-[32em] text-[0.92rem] leading-snug text-ink-soft">
          {t('success.body.before')} {state.name || t('success.body.friend')}
          {t('success.body.mid')} <strong className="text-emerald">{when}</strong>
          {t('success.body.after')}
        </p>

        <div className="mx-auto mt-4 inline-block rounded-pill border border-gold/40 bg-gold-soft/50 px-4 py-1.5 text-[0.9rem] font-bold leading-snug tracking-wide text-emerald [overflow-wrap:anywhere]">
          {t('success.reference')}: {state.reference}
        </div>

        <div className="mt-5">
          <Button variant="ghost" size="sm" onClick={onRestart}>
            {t('success.another')}
          </Button>
        </div>
      </div>
    </div>
  );
}
