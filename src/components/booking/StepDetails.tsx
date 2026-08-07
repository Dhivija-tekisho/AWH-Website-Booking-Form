import { UserCheck } from 'lucide-react';
import { InputField } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { SelectMark, StepHeader } from './shared';
import {
  GENDER_OPTIONS,
  type BookingDetails,
  type ExistingPatientRecord,
  type Gender,
  type PatientType,
  type VerifyPhase,
} from '@/booking';
import { useLang } from '@/i18n';

interface Props {
  patientType: PatientType | null;
  patientId: string | null;
  phone: string;
  details: BookingDetails;
  onChange: (patch: Partial<BookingDetails>) => void;
  matchedPatients?: ExistingPatientRecord[];
  onSelectMatchedPatient?: (patient: ExistingPatientRecord) => void;
  otp?: string;
  verifyPhase?: VerifyPhase;
  onOtpChange?: (otp: string) => void;
  onSendOtp?: () => void;
}

function ChoiceRow<T extends string>({
  label,
  required,
  options,
  value,
  onSelect,
  columns = 2,
}: {
  label: string;
  required?: boolean;
  options: { id: T; label: string; description?: string }[];
  value: T | '' | null;
  onSelect: (id: T) => void;
  columns?: 2 | 3;
}) {
  return (
    <div className="mb-3">
      <p className="mb-2 text-[0.82rem] font-semibold leading-snug [overflow-wrap:anywhere]">
        {label} {required && <span className="text-rose">*</span>}
      </p>
      <div
        className={`grid gap-2 ${
          columns === 3 ? 'grid-cols-3' : 'grid-cols-1 min-[420px]:grid-cols-2'
        }`}
      >
        {options.map((opt) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              aria-pressed={active}
              className={[
                'flex w-full items-center gap-2 rounded-lg border-2 px-3 py-2 text-left transition-all',
                active
                  ? 'border-emerald bg-mist/60 shadow-sm'
                  : 'border-line bg-white hover:border-jade/50',
              ].join(' ')}
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[0.85rem] font-semibold leading-snug text-ink [overflow-wrap:anywhere]">
                  {opt.label}
                </span>
                {opt.description && (
                  <span className="mt-1 block text-[0.74rem] leading-snug text-ink-soft [overflow-wrap:anywhere]">
                    {opt.description}
                  </span>
                )}
              </span>
              <SelectMark active={active} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function StepDetails({
  patientType,
  patientId,
  phone,
  details,
  matchedPatients = [],
  onSelectMatchedPatient,
  otp = '',
  verifyPhase = 'phone',
  onOtpChange,
  onSendOtp,
  onChange,
}: Props) {
  const { t } = useLang();
  const existing = patientType === 'existing';
  const otpSent = verifyPhase === 'otp';
  const canSend = phone.replace(/\D/g, '').length >= 10;

  if (existing) {
    const single = matchedPatients.length === 1 ? matchedPatients[0]! : null;

    return (
      <div className="flex min-h-full flex-col">
        <StepHeader title={t('details.matched.title')} />

        <div className="flex flex-col gap-3">
          {single ? (
            <div className="rounded-lg border-2 border-emerald/40 bg-mist/50 p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gradient-to-br from-mist to-mist-2 text-emerald">
                  <UserCheck className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.7rem] font-semibold uppercase leading-snug tracking-wide text-ink-faint [overflow-wrap:anywhere]">
                    {t('details.onFile')}
                  </p>
                  <p className="text-[0.95rem] font-semibold leading-snug text-ink [overflow-wrap:anywhere]">
                    {single.name}
                  </p>
                  <p className="mt-1 text-[0.8rem] leading-snug text-ink-soft [overflow-wrap:anywhere]">
                    ID {single.patientId} · {phone}
                  </p>
                </div>
              </div>
              <dl className="mt-3 grid grid-cols-1 gap-2 border-t border-line/80 pt-3 text-[0.8rem] min-[420px]:grid-cols-3">
                <div className="min-w-0">
                  <dt className="leading-snug text-ink-faint">{t('details.age.label')}</dt>
                  <dd className="font-semibold leading-snug text-ink">{single.age}</dd>
                </div>
                <div className="min-w-0">
                  <dt className="leading-snug text-ink-faint">{t('details.gender')}</dt>
                  <dd className="font-semibold leading-snug text-ink">
                    {t(`gender.${single.gender}`)}
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="leading-snug text-ink-faint">{t('details.locality.label')}</dt>
                  <dd className="font-semibold leading-snug text-ink [overflow-wrap:anywhere]">
                    {single.locality}
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            matchedPatients.map((patient) => {
              const active = patientId === patient.patientId;
              return (
                <button
                  key={patient.patientId}
                  type="button"
                  onClick={() => onSelectMatchedPatient?.(patient)}
                  aria-pressed={active}
                  className={[
                    'flex w-full items-start gap-3 rounded-lg border-2 p-3 text-left transition-all',
                    active
                      ? 'border-emerald bg-mist/60 shadow-sm'
                      : 'border-line bg-white hover:border-jade/50 hover:bg-mist/30',
                  ].join(' ')}
                >
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gradient-to-br from-mist to-mist-2 text-emerald">
                    <UserCheck className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.95rem] font-semibold leading-snug text-ink [overflow-wrap:anywhere]">
                      {patient.name}
                    </span>
                    <span className="mt-1 block text-[0.8rem] leading-snug text-ink-soft [overflow-wrap:anywhere]">
                      ID {patient.patientId} · {t('details.age.label')} {patient.age} ·{' '}
                      {t(`gender.${patient.gender}`)}
                    </span>
                    <span className="mt-1 block text-[0.76rem] leading-snug text-ink-faint [overflow-wrap:anywhere]">
                      {patient.locality}
                    </span>
                  </span>
                  <SelectMark active={active} />
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      <StepHeader title={t('details.new.title')} />

      <div className="space-y-1">
        <InputField
          label={t('details.fullName.label')}
          required
          value={details.name}
          autoComplete="name"
          placeholder=""
          onChange={(e) => onChange({ name: e.target.value })}
        />

        <InputField
          label={t('details.age.label')}
          required
          type="number"
          min={0}
          max={120}
          value={details.age}
          placeholder=""
          onChange={(e) => onChange({ age: e.target.value })}
        />

        <ChoiceRow<Gender>
          label={t('details.gender')}
          required
          columns={3}
          options={GENDER_OPTIONS.map((id) => ({ id, label: t(`gender.${id}`) }))}
          value={details.gender}
          onSelect={(gender) => onChange({ gender })}
        />

        <div className="mb-3">
          <div className="flex items-end gap-2">
            <div className="min-w-0 flex-1 [&_>div]:mb-0">
              <InputField
                label={t('verify.phone.label')}
                required
                type="tel"
                autoComplete="tel"
                value={phone}
                placeholder=""
                onChange={(e) => onChange({ phone: e.target.value })}
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mb-0 h-auto min-h-[44px] w-auto shrink-0 px-3"
              onClick={onSendOtp}
              disabled={!canSend}
            >
              {otpSent ? t('nav.resendOtp') : t('nav.sendOtp')}
            </Button>
          </div>
        </div>

        <InputField
          label={t('verify.otp.label')}
          required
          inputMode="text"
          autoComplete="one-time-code"
          value={otp}
          placeholder=""
          disabled={!otpSent}
          onChange={(e) => onOtpChange?.(e.target.value)}
        />
      </div>
    </div>
  );
}
