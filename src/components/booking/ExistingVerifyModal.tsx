import { useId, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLang } from '@/i18n';

const fieldClass =
  'w-full rounded-lg border-[1.6px] border-line bg-mist px-3 py-2 text-[0.95rem] ' +
  'leading-normal min-h-[44px] ' +
  'text-ink transition-all focus:border-jade focus:bg-white focus:outline-none ' +
  'disabled:cursor-not-allowed disabled:opacity-60';

const labelClass = 'mb-1 block text-[0.82rem] font-semibold leading-snug [overflow-wrap:anywhere]';

interface Props {
  open: boolean;
  onClose: () => void;
  onVerified: (phone: string, otp: string) => void;
}

export function ExistingVerifyModal({ open, onClose, onVerified }: Props) {
  const { t } = useLang();
  const phoneId = useId();
  const otpId = useId();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  if (!open) return null;

  const canSend = phone.replace(/\D/g, '').length >= 10;

  const resetAndClose = () => {
    setPhone('');
    setOtp('');
    setOtpSent(false);
    setErrorKey(null);
    onClose();
  };

  const handleSendOtp = () => {
    if (!canSend) {
      setErrorKey('err.phone');
      return;
    }
    setErrorKey(null);
    setOtpSent(true);
    setOtp('');
  };

  const handleVerify = () => {
    if (!canSend) {
      setErrorKey('err.phone');
      return;
    }
    if (!otpSent) {
      setErrorKey('err.sendOtpFirst');
      return;
    }
    if (!otp.trim()) {
      setErrorKey('err.otp');
      return;
    }
    setErrorKey(null);
    onVerified(phone, otp.trim());
    setPhone('');
    setOtp('');
    setOtpSent(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 p-4 backdrop-blur-lg"
      role="dialog"
      aria-modal="true"
      aria-labelledby="existing-verify-title"
      onClick={resetAndClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-line bg-white p-4 shadow-md sm:p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2
              id="existing-verify-title"
              className="text-[clamp(1.15rem,2.6vw,1.4rem)] font-semibold text-ink"
            >
              {t('verify.phone.existing.title')}
            </h2>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-ink-soft hover:bg-mist hover:text-ink"
            aria-label={t('nav.back')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

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
              placeholder={t('verify.phone.placeholder')}
              onChange={(e) => {
                setPhone(e.target.value);
                setOtpSent(false);
                setOtp('');
                setErrorKey(null);
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-auto min-h-[44px] w-auto shrink-0 px-3"
              onClick={handleSendOtp}
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
            placeholder={t('verify.otp.placeholder')}
            disabled={!otpSent}
            onChange={(e) => {
              setOtp(e.target.value);
              setErrorKey(null);
            }}
          />
        </div>

        {errorKey ? (
          <p className="mb-3 rounded-lg border border-rose/50 bg-rose-soft/50 px-3 py-2 text-[0.85rem] font-semibold leading-snug text-danger">
            {t(errorKey)}
          </p>
        ) : null}

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" size="sm" onClick={resetAndClose}>
            {t('nav.back')}
          </Button>
          <Button variant="emerald" size="md" onClick={handleVerify}>
            {t('nav.verifyContinue')}
          </Button>
        </div>
      </div>
    </div>
  );
}
