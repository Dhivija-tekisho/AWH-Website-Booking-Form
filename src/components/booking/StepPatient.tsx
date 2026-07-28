import { PATIENT_OPTIONS, type PatientType } from '@/booking';
import { useLang } from '@/i18n';
import { SelectMark } from './shared';

interface Props {
  selected: PatientType | null;
  onSelect: (type: PatientType) => void;
}

export function StepPatient({ selected, onSelect }: Props) {
  const { t } = useLang();

  return (
    <div className="h-full">
      <h2 className="text-[clamp(1.25rem,2.8vw,1.7rem)] font-semibold text-ink">
        {t('patient.title')}
      </h2>
      <p className="mt-1 text-[0.9rem] text-ink-soft">{t('patient.subtitle')}</p>
      <div className="mt-4 space-y-2.5">
        {PATIENT_OPTIONS.map((opt) => {
          const active = selected === opt.id;
          const { Icon } = opt;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              aria-pressed={active}
              className={[
                'flex w-full items-center gap-3 rounded-lg border-2 p-3 text-left transition-all',
                active
                  ? 'border-emerald bg-mist/60 shadow-sm'
                  : 'border-line bg-white hover:border-jade/50',
              ].join(' ')}
            >
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gradient-to-br from-mist to-mist-2 text-emerald">
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <span className="flex-1">
                <h4 className="text-[0.98rem] font-semibold text-ink">
                  {t(`patient.${opt.id}.name`)}
                </h4>
                <p className="mt-0.5 text-[0.82rem] text-ink-soft">
                  {t(`patient.${opt.id}.desc`)}
                </p>
              </span>
              <SelectMark active={active} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
