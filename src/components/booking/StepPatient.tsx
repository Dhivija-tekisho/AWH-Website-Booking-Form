import { Check } from 'lucide-react';
import { PATIENT_OPTIONS, type PatientType } from '@/booking';
import { useLang } from '@/i18n';
import { ExistingVerifyModal } from './ExistingVerifyModal';

interface Props {
  selected: PatientType | null;
  onSelect: (type: PatientType) => void;
  verifyOpen: boolean;
  onVerifyOpenChange: (open: boolean) => void;
  onExistingVerified: (phone: string, otp: string) => void;
}

export function StepPatient({
  selected,
  onSelect,
  verifyOpen,
  onVerifyOpenChange,
  onExistingVerified,
}: Props) {
  const { t } = useLang();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="mb-4 flex-none text-center sm:mb-5">
        <h2 className="text-[clamp(1.25rem,2.8vw,1.7rem)] font-semibold text-ink">
          {t('patient.title')}
        </h2>
        {t('patient.subtitle') ? (
          <p className="mx-auto mt-1.5 max-w-md text-[0.88rem] leading-snug text-ink-soft">
            {t('patient.subtitle')}
          </p>
        ) : null}
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {PATIENT_OPTIONS.map((opt) => {
          const active = selected === opt.id;
          const { Icon } = opt;

          return (
            <button
              key={opt.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(opt.id)}
              className={[
                'relative flex h-full min-h-[12rem] flex-col items-center justify-center rounded-2xl border px-5 py-6 text-center transition-all sm:min-h-0 sm:px-6 sm:py-8',
                active
                  ? 'border-emerald bg-mist/40 shadow-sm'
                  : 'border-line bg-white hover:border-jade/35 hover:bg-mist/15',
              ].join(' ')}
            >
              <span
                className={[
                  'absolute right-3.5 top-3.5 flex h-5 w-5 items-center justify-center rounded-full border transition-colors',
                  active
                    ? 'border-emerald bg-emerald text-ivory'
                    : 'border-line bg-transparent text-transparent',
                ].join(' ')}
              >
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>

              <span
                className={[
                  'mb-4 flex h-14 w-14 flex-none items-center justify-center rounded-full sm:mb-5 sm:h-16 sm:w-16',
                  active ? 'bg-emerald text-ivory' : 'bg-mist text-emerald',
                ].join(' ')}
              >
                <Icon className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={1.6} />
              </span>

              <h4 className="text-[1.1rem] font-semibold leading-snug text-ink [overflow-wrap:anywhere] sm:text-[1.2rem]">
                {t(`patient.${opt.id}.name`)}
              </h4>
              <p className="mt-2 max-w-[16rem] text-[0.82rem] leading-snug text-ink-soft [overflow-wrap:anywhere] sm:mt-2.5 sm:text-[0.88rem]">
                {t(`patient.${opt.id}.desc`)}
              </p>
            </button>
          );
        })}
      </div>

      <ExistingVerifyModal
        open={verifyOpen}
        onClose={() => onVerifyOpenChange(false)}
        onVerified={(phone, otp) => {
          onVerifyOpenChange(false);
          onExistingVerified(phone, otp);
        }}
      />
    </div>
  );
}
