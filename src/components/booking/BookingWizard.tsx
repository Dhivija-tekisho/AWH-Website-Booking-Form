import { useState, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import { useBooking } from '@/booking/useBooking';
import type { PatientType } from '@/booking';
import { useLang } from '@/i18n';
import { BookingNav, BookingProgress } from './shared';
import { StepPatient } from './StepPatient';
import { StepDetails } from './StepDetails';
import { StepDepartment } from './StepDepartment';
import { StepSpecialist } from './StepSpecialist';
import { StepDateTime } from './StepDateTime';
import { StepReview } from './StepReview';
import { StepSuccess } from './StepSuccess';

interface BookingWizardProps {
  /** Pre-seed state from the chatbot so the wizard skips patient-selection. */
  initialOverrides?: {
    patientType?: PatientType;
    name?: string;
    /** 1-based step index to start on (default 1). */
    step?: number;
    /** When true, the Verify modal opens immediately (existing patient flow). */
    openVerifyOnMount?: boolean;
  };
  /** Called when the booking is fully confirmed. */
  onBookingComplete?: (details: any) => void;
}

function StepShell({
  children,
  nav,
  scroll = true,
}: {
  children: ReactNode;
  nav?: ReactNode;
  /** When false, content is clipped to the pane — no inner scrollbar. */
  scroll?: boolean;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        className={[
          'min-h-0 flex-1',
          scroll ? 'overflow-y-auto overscroll-contain' : 'overflow-hidden',
        ].join(' ')}
      >
        {children}
      </div>
      {nav ? <div className="mt-3 flex-none">{nav}</div> : null}
    </div>
  );
}

export function BookingWizard({ initialOverrides, onBookingComplete }: BookingWizardProps = {}) {
  const wizard = useBooking(
    initialOverrides
      ? {
          patientType: initialOverrides.patientType ?? null,
          name: initialOverrides.name ?? '',
          step: initialOverrides.step ?? 1,
        }
      : undefined,
  );
  const { state, stepId } = wizard;
  const { t } = useLang();
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const isNew = state.patientType === 'new';
  const [verifyOpen, setVerifyOpen] = useState(initialOverrides?.openVerifyOnMount ?? false);

  const handleNext = () => {
    const result = wizard.validate();
    if (!result.ok) {
      setErrorKey(result.messageKey ?? 'err.generic');
      return;
    }
    setErrorKey(null);
    wizard.next();
  };

  const handlePatientContinue = () => {
    if (!state.patientType) {
      setErrorKey('err.patientType');
      return;
    }
    if (state.patientType === 'existing') {
      setErrorKey(null);
      setVerifyOpen(true);
      return;
    }
    handleNext();
  };

  const handleBack = () => {
    setErrorKey(null);
    wizard.back();
  };

  const handleSendOtp = () => {
    if (state.phone.replace(/\D/g, '').length < 10) {
      setErrorKey('err.phone');
      return;
    }
    setErrorKey(null);
    wizard.sendOtp();
  };

  const handleConfirm = () => {
    const reference = wizard.confirm();
    // Return to chatbot immediately with full booking details
    onBookingComplete?.({ ...state, reference });
  };

  const error = errorKey ? t(errorKey) : null;

  const backNext = (
    <BookingNav onBack={handleBack} onNext={handleNext} error={error} />
  );

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white/70 p-3 shadow-md backdrop-blur-sm sm:p-4">
      <BookingProgress step={state.step} patientType={state.patientType} />

      <div className="min-h-0 flex-1">
        {stepId === 'patient' && (
          <StepShell nav={<BookingNav onNext={handlePatientContinue} error={error} />}>
            <StepPatient
              selected={state.patientType}
              onSelect={wizard.setPatientType}
              verifyOpen={verifyOpen}
              onVerifyOpenChange={setVerifyOpen}
              onExistingVerified={(phone, otp) => wizard.completeExistingVerify(phone, otp)}
            />
          </StepShell>
        )}

        {stepId === 'profile' && (
          <StepShell
            nav={
              <BookingNav
                onBack={handleBack}
                onNext={handleNext}
                nextLabel={isNew ? t('nav.verifyContinue') : t('nav.continue')}
                error={error}
              />
            }
          >
            <StepDetails
              patientType={state.patientType}
              patientId={state.patientId}
              phone={state.phone}
              matchedPatients={state.matchedPatients}
              onSelectMatchedPatient={wizard.selectMatchedPatient}
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
              otp={state.otp}
              verifyPhase={state.verifyPhase}
              onOtpChange={wizard.setOtp}
              onSendOtp={handleSendOtp}
            />
          </StepShell>
        )}

        {stepId === 'department' && (
          <StepShell nav={backNext}>
            <StepDepartment
              selectedId={state.department?.id ?? null}
              lastDepartmentId={state.lastDepartmentId}
              patientType={state.patientType}
              onSelect={wizard.setDepartment}
            />
          </StepShell>
        )}

        {stepId === 'specialist' && (
          <StepShell nav={backNext}>
            <StepSpecialist
              department={state.department}
              selectedId={state.doctor?.id ?? null}
              lastDoctorId={state.lastDoctorId}
              patientType={state.patientType}
              onSelect={wizard.setDoctor}
            />
          </StepShell>
        )}

        {stepId === 'datetime' && (
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

        {stepId === 'confirm' && (
          <StepShell
            scroll={false}
            nav={
              <BookingNav
                onBack={handleBack}
                onNext={handleConfirm}
                nextLabel={t('nav.confirmSend')}
                nextVariant="gold"
                nextIcon={<Check className="h-4 w-4" strokeWidth={2.6} />}
              />
            }
          >
            <StepReview state={state} />
          </StepShell>
        )}

        {!stepId && state.step > 1 && (
          <StepSuccess
            state={state}
            onRestart={() => {
              wizard.reset();
              onBookingComplete?.(state);
            }}
          />
        )}
      </div>
    </div>
  );
}
