import { useMemo } from 'react';
import { Clock } from 'lucide-react';
import { nextDays, slotsForDate, dateKey, isSunday } from '@/booking';
import { useLang } from '@/i18n';
import { StepHeader } from './shared';

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
    <div className="flex min-h-full flex-col">
      <StepHeader title={t('datetime.title')} subtitle={t('datetime.subtitle')} />

      <div className="my-auto">
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {days.map((d) => {
            const selected = dateKey(d) === dateKey(activeDate);
            return (
              <button
                key={dateKey(d)}
                type="button"
                onClick={() => onDateChange(d)}
                aria-pressed={selected}
                className={[
                  'flex min-w-0 flex-col items-center rounded-lg border-2 px-1 py-2 transition-all',
                  selected
                    ? 'border-emerald bg-emerald text-ivory'
                    : 'border-line bg-white text-ink hover:border-jade/50',
                  isSunday(d) && !selected ? 'opacity-70' : '',
                ].join(' ')}
              >
                <span className="w-full text-[0.62rem] font-semibold uppercase leading-tight opacity-80 [overflow-wrap:anywhere]">
                  {t(`dow.${d.getDay()}`)}
                </span>
                <span className="text-[1.05rem] font-bold leading-tight">{d.getDate()}</span>
                <span className="w-full text-[0.62rem] leading-tight opacity-80 [overflow-wrap:anywhere]">
                  {t(`mon.${d.getMonth()}`)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center gap-2 text-[0.82rem] font-semibold leading-snug text-emerald sm:mt-4">
          <Clock className="h-4 w-4 flex-none" />
          <span className="min-w-0 [overflow-wrap:anywhere]">
            {sunday ? t('datetime.sunday') : t('datetime.times')}
          </span>
        </div>

        <div className="mt-2 grid grid-cols-3 gap-2 min-[420px]:grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
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
                  'min-h-[40px] rounded-lg border-2 px-1 py-2 text-[0.8rem] font-semibold leading-snug transition-all',
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
    </div>
  );
}
