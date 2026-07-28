import { useMemo } from 'react';
import { Clock } from 'lucide-react';
import { nextDays, slotsForDate, dateKey, isSunday } from '@/booking';
import { useLang } from '@/i18n';

interface Props {
  date: Date | null;
  slot: string | null;
  onDateChange: (d: Date) => void;
  onSlotChange: (s: string) => void;
}

export function StepDateTime({ date, slot, onDateChange, onSlotChange }: Props) {
  const { t } = useLang();
  const days = useMemo(() => nextDays(7), []);
  const activeDate = date ?? days[0]!;
  const slots = useMemo(() => slotsForDate(activeDate), [activeDate]);
  const sunday = isSunday(activeDate);

  return (
    <div className="h-full">
      <h2 className="text-[clamp(1.25rem,2.8vw,1.7rem)] font-semibold text-ink">
        {t('datetime.title')}
      </h2>
      <p className="mt-1 text-[0.88rem] text-ink-soft">{t('datetime.subtitle')}</p>

      <div className="mt-3 grid grid-cols-7 gap-1.5">
        {days.map((d) => {
          const selected = dateKey(d) === dateKey(activeDate);
          return (
            <button
              key={dateKey(d)}
              type="button"
              onClick={() => onDateChange(d)}
              aria-pressed={selected}
              className={[
                'flex flex-col items-center rounded-lg border-2 px-1 py-1.5 transition-all',
                selected
                  ? 'border-emerald bg-emerald text-ivory'
                  : 'border-line bg-white text-ink hover:border-jade/50',
                isSunday(d) && !selected ? 'opacity-70' : '',
              ].join(' ')}
            >
              <span className="text-[0.62rem] font-semibold uppercase opacity-80">
                {t(`dow.${d.getDay()}`)}
              </span>
              <span className="text-[1.05rem] font-bold leading-tight">{d.getDate()}</span>
              <span className="text-[0.62rem] opacity-80">{t(`mon.${d.getMonth()}`)}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-2 text-[0.82rem] font-semibold text-emerald">
        <Clock className="h-4 w-4" />
        {sunday ? t('datetime.sunday') : t('datetime.times')}
      </div>

      <div className="mt-2 grid grid-cols-4 gap-1.5 sm:grid-cols-5">
        {slots.map((s) => {
          const selected = slot === s.time;
          return (
            <button
              key={s.time}
              type="button"
              disabled={s.taken}
              onClick={() => {
                if (!date) onDateChange(activeDate);
                onSlotChange(s.time);
              }}
              aria-pressed={selected}
              className={[
                'rounded-lg border-2 px-1 py-2 text-[0.8rem] font-semibold transition-all',
                s.taken
                  ? 'cursor-not-allowed border-line bg-mist/50 text-ink-faint line-through'
                  : selected
                    ? 'border-emerald bg-emerald text-ivory'
                    : 'border-line bg-white text-ink hover:border-jade/60',
              ].join(' ')}
            >
              {s.time}
            </button>
          );
        })}
      </div>
    </div>
  );
}
