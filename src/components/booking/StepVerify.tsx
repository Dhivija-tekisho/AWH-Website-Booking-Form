import { InputField } from '@/components/ui/Field';
import type { PatientType, VerifyPhase } from '@/booking';
import { useLang } from '@/i18n';

interface Props {
  patientType: PatientType | null;
  phase: VerifyPhase;
  phone: string;
  otp: string;
  onPhoneChange: (phone: string) => void;
  onOtpChange: (otp: string) => void;
}

export function StepVerify({
  patientType,
  phase,
  phone,
  otp,
  onPhoneChange,
  onOtpChange,
}: Props) {
  const { t } = useLang();
  const existing = patientType === 'existing';

  if (phase === 'otp') {
    return (
      <div className="h-full">
        <h2 className="text-[clamp(1.25rem,2.8vw,1.7rem)] font-semibold text-ink">
          {t('verify.otp.title')}
        </h2>
        <p className="mt-1 text-[0.9rem] text-ink-soft">
          {t('verify.otp.subtitle.before')}{' '}
          <span className="font-semibold text-ink">{phone}</span>.{' '}
          {existing ? t('verify.otp.subtitle.existing') : t('verify.otp.subtitle.new')}
        </p>

        <div className="mt-4">
          <InputField
            label={t('verify.otp.label')}
            required
            inputMode="text"
            autoComplete="one-time-code"
            value={otp}
            placeholder={t('verify.otp.placeholder')}
            onChange={(e) => onOtpChange(e.target.value)}
          />
          <p className="rounded-lg border border-line bg-mist/70 px-3 py-2 text-[0.82rem] text-ink-soft">
            {t('verify.otp.demo')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <h2 className="text-[clamp(1.25rem,2.8vw,1.7rem)] font-semibold text-ink">
        {existing ? t('verify.phone.existing.title') : t('verify.phone.new.title')}
      </h2>
      <p className="mt-1 text-[0.9rem] text-ink-soft">
        {existing ? t('verify.phone.existing.subtitle') : t('verify.phone.new.subtitle')}
      </p>

      <div className="mt-4">
        <InputField
          label={t('verify.phone.label')}
          required
          type="tel"
          autoComplete="tel"
          value={phone}
          placeholder={t('verify.phone.placeholder')}
          onChange={(e) => onPhoneChange(e.target.value)}
        />
      </div>
    </div>
  );
}
