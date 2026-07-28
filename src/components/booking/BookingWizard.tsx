import { useState, type ReactNode } from 'react';
import { useBooking } from '@/booking/useBooking';
import { bookingMessage, openExternal, waLink } from '@/booking';
import { useLang } from '@/i18n';
import { BookingNav, BookingProgress } from './shared';
import { StepPatient } from './StepPatient';
import { StepVerify } from './StepVerify';
import { StepDetails } from './StepDetails';
import { StepDepartment } from './StepDepartment';
import { StepSpecialist } from './StepSpecialist';
import { StepDateTime } from './StepDateTime';
import { StepReview } from './StepReview';
import { StepSuccess } from './StepSuccess';

function StepShell({
  children,
  nav,
}: {
  children: ReactNode;
  nav?: ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
      {nav}
    </div>
  );
}

export function BookingWizard({ 
  initialOverrides,
  onBookingComplete
}: { 
  initialOverrides?: import('@/booking').BookingState;
  onBookingComplete?: (details: any) => void;
}) {
  const wizard = useBooking(initialOverrides);
  const { state } = wizard;
  const { t } = useLang();
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const handleNext = () => {
    const result = wizard.validate();
    if (!result.ok) {
      setErrorKey(result.messageKey ?? 'err.generic');
      return;
    }
    setErrorKey(null);
    wizard.next();
  };

  const handleBack = () => {
    setErrorKey(null);
    wizard.back();
  };

  const handleConfirm = () => {
    const reference = wizard.confirm();
    if (onBookingComplete) {
      onBookingComplete({ ...state, reference });
    } else {
      openExternal(waLink(bookingMessage({ ...state, reference })));
    }
  };

  const verifyNextLabel =
    state.verifyPhase === 'phone' ? t('nav.sendOtp') : t('nav.verifyContinue');

  const error = errorKey ? t(errorKey) : null;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white/70 p-3 shadow-md backdrop-blur-sm sm:p-5">
      <BookingProgress step={state.step} />

      <div className="min-h-0 flex-1">
        {state.step === 1 && (
          <StepShell nav={<BookingNav onNext={handleNext} error={error} />}>
            <StepPatient selected={state.patientType} onSelect={wizard.setPatientType} />
          </StepShell>
        )}

        {state.step === 2 && (
          <StepShell
            nav={
              <BookingNav
                onBack={handleBack}
                onNext={handleNext}
                nextLabel={verifyNextLabel}
                error={error}
              />
            }
          >
            <StepVerify
              patientType={state.patientType}
              phase={state.verifyPhase}
              phone={state.phone}
              otp={state.otp}
              onPhoneChange={(phone) => wizard.patchDetails({ phone })}
              onOtpChange={wizard.setOtp}
            />
          </StepShell>
        )}

        {state.step === 3 && (
          <StepShell nav={<BookingNav onBack={handleBack} onNext={handleNext} error={error} />}>
            <StepDetails
              patientType={state.patientType}
              patientId={state.patientId}
              phone={state.phone}
              details={{
                name: state.name,
                phone: state.phone,
                age: state.age,
                gender: state.gender,
                locality: state.locality,
                woundDuration: state.woundDuration,
                visitPurpose: state.visitPurpose,
                notes: state.notes,
              }}
              onChange={wizard.patchDetails}
            />
          </StepShell>
        )}

        {state.step === 4 && (
          <StepShell nav={<BookingNav onBack={handleBack} onNext={handleNext} error={error} />}>
            <StepDepartment
              selectedId={state.department?.id ?? null}
              lastDepartmentId={state.lastDepartmentId}
              patientType={state.patientType}
              onSelect={wizard.setDepartment}
            />
          </StepShell>
        )}

        {state.step === 5 && (
          <StepShell nav={<BookingNav onBack={handleBack} onNext={handleNext} error={error} />}>
            <StepSpecialist
              department={state.department}
              selectedId={state.doctor?.id ?? null}
              lastDoctorId={state.lastDoctorId}
              patientType={state.patientType}
              onSelect={wizard.setDoctor}
            />
          </StepShell>
        )}

        {state.step === 6 && (
          <StepShell
            nav={
              <BookingNav
                onBack={handleBack}
                onNext={handleNext}
                nextLabel={t('nav.review')}
                error={error}
              />
            }
          >
            <StepDateTime
              date={state.date}
              slot={state.slot}
              onDateChange={wizard.setDate}
              onSlotChange={wizard.setSlot}
            />
          </StepShell>
        )}

        {state.step === 7 && (
          <StepReview state={state} onBack={handleBack} onConfirm={handleConfirm} />
        )}

        {state.step > 7 && <StepSuccess state={state} onRestart={wizard.reset} />}
      </div>
    </div>
  );
}
