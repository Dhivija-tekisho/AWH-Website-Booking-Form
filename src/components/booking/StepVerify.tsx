import { useId } from 'react';
import { Button } from '@/components/ui/Button';
import type { PatientType, VerifyPhase } from '@/booking';
import { useLang } from '@/i18n';
import { StepHeader } from './shared';

interface Props {
  patientType: PatientType | null;
  phase: VerifyPhase;
  phone: string;
  otp: string;
  onPhoneChange: (phone: string) => void;
  onOtpChange: (otp: string) => void;
  onSendOtp: () => void;
}

const fieldClass =
  'w-full rounded-lg border-[1.6px] border-line bg-mist px-3 py-2 text-[0.95rem] ' +
  'leading-normal min-h-[44px] ' +
  'text-ink transition-all focus:border-jade focus:bg-white focus:outline-none ' +
  'disabled:cursor-not-allowed disabled:opacity-60';

const labelClass = 'mb-1 block text-[0.82rem] font-semibold leading-snug [overflow-wrap:anywhere]';

export function StepVerify({
  patientType,
  phase,
  phone,
  otp,
  onPhoneChange,
  onOtpChange,
  onSendOtp,
}: Props) {
  const { t } = useLang();
  const phoneId = useId();
  const otpId = useId();
  const existing = patientType === 'existing';
  const otpSent = phase === 'otp';
  const canSend = phone.replace(/\D/g, '').length >= 10;

  return (
    <div className="flex min-h-full flex-col">
      <StepHeader
        title={existing ? t('verify.phone.existing.title') : t('verify.phone.new.title')}
        subtitle={
          existing ? t('verify.phone.existing.subtitle') : t('verify.phone.new.subtitle')
        }
      />

      <div className="my-auto w-full">
        {/* Mobile + compact Send OTP on one row */}
        <div className="mb-3">
          <label htmlFor={phoneId} className={labelClass}>
            {t('verify.phone.label')} <span className="text-rose">*</span>
          </label>
          <div className="flex items-stretch gap-2">
            <input
              id={phoneId}
              className={`${fieldClass} min-w-0 flex-1`}
              type="tel"
              autoComplete="tel"
              value={phone}
              placeholder=""
              onChange={(e) => onPhoneChange(e.target.value)}
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-auto min-h-[44px] w-auto shrink-0 px-3"
              onClick={onSendOtp}
              disabled={!canSend}
            >
              {otpSent ? t('nav.resendOtp') : t('nav.sendOtp')}
            </Button>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor={otpId} className={labelClass}>
            {t('verify.otp.label')} <span className="text-rose">*</span>
          </label>
          <input
            id={otpId}
            className={fieldClass}
            inputMode="text"
            autoComplete="one-time-code"
            value={otp}
            placeholder=""
            disabled={!otpSent}
            onChange={(e) => onOtpChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
