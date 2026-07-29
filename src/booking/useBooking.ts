import { useCallback, useReducer } from 'react';
import {
  BOOKING_STEPS,
  DEPARTMENTS,
  DOCTORS,
  initialBookingState,
  lookupExistingPatients,
  makeReference,
  stepsForPatient,
  totalStepsFor,
  type BookingDetails,
  type BookingState,
  type Department,
  type Doctor,
  type ExistingPatientRecord,
  type PatientType,
} from './index';

type Action =
  | { type: 'SET_PATIENT'; payload: PatientType }
  | { type: 'SET_OTP'; payload: string }
  | { type: 'SEND_OTP' }
  | { type: 'VERIFY_OTP' }
  | { type: 'COMPLETE_EXISTING_VERIFY'; phone: string; otp: string }
  | { type: 'SELECT_MATCHED_PATIENT'; payload: ExistingPatientRecord }
  | { type: 'SET_DEPARTMENT'; payload: Department }
  | { type: 'SET_DOCTOR'; payload: Doctor | null }
  | { type: 'SET_DATE'; payload: Date }
  | { type: 'SET_SLOT'; payload: string }
  | { type: 'PATCH_DETAILS'; payload: Partial<BookingDetails> }
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'CONFIRM'; reference: string }
  | { type: 'RESET' };

function applyMatchedPatient(
  record: ExistingPatientRecord,
): Pick<
  BookingState,
  | 'patientId'
  | 'name'
  | 'age'
  | 'gender'
  | 'locality'
  | 'lastDepartmentId'
  | 'lastDoctorId'
  | 'department'
  | 'doctor'
> {
  const department =
    DEPARTMENTS.find((d) => d.id === record.lastDepartmentId) ?? null;
  const doctor = DOCTORS.find((d) => d.id === record.lastDoctorId) ?? null;
  return {
    patientId: record.patientId,
    name: record.name,
    age: record.age,
    gender: record.gender,
    locality: record.locality,
    lastDepartmentId: record.lastDepartmentId,
    lastDoctorId: record.lastDoctorId,
    department,
    doctor,
  };
}

function clearProfileFields(): Pick<
  BookingState,
  | 'otp'
  | 'phoneVerified'
  | 'patientId'
  | 'matchedPatients'
  | 'lastDepartmentId'
  | 'lastDoctorId'
  | 'name'
  | 'age'
  | 'gender'
  | 'locality'
  | 'woundDuration'
  | 'visitPurpose'
  | 'notes'
  | 'department'
  | 'doctor'
  | 'verifyPhase'
  | 'phone'
> {
  return {
    verifyPhase: 'phone',
    otp: '',
    phone: '',
    phoneVerified: false,
    patientId: null,
    matchedPatients: [],
    lastDepartmentId: null,
    lastDoctorId: null,
    name: '',
    age: '',
    gender: '',
    locality: '',
    woundDuration: '',
    visitPurpose: null,
    notes: '',
    department: null,
    doctor: null,
  };
}

function stepIdAt(state: BookingState): string | undefined {
  return stepsForPatient(state.patientType)[state.step - 1];
}

function validateNewRegistration(state: BookingState): { ok: boolean; messageKey?: string } {
  if (!state.name.trim()) {
    return { ok: false, messageKey: 'err.name' };
  }
  if (!state.age.trim()) {
    return { ok: false, messageKey: 'err.age' };
  }
  if (!state.gender) {
    return { ok: false, messageKey: 'err.gender' };
  }
  if (state.phone.replace(/\D/g, '').length < 10) {
    return { ok: false, messageKey: 'err.phone' };
  }
  if (state.verifyPhase !== 'otp') {
    return { ok: false, messageKey: 'err.sendOtpFirst' };
  }
  if (!state.otp.trim()) {
    return { ok: false, messageKey: 'err.otp' };
  }
  return { ok: true };
}

function validateExistingProfile(state: BookingState): { ok: boolean; messageKey?: string } {
  if (!state.phoneVerified) {
    return { ok: false, messageKey: 'err.otp' };
  }
  if (!state.patientId || state.matchedPatients.length === 0) {
    return { ok: false, messageKey: 'err.matchedPatient' };
  }
  return { ok: true };
}

function reducer(state: BookingState, action: Action): BookingState {
  switch (action.type) {
    case 'SET_PATIENT':
      return {
        ...state,
        patientType: action.payload,
        ...clearProfileFields(),
      };
    case 'SET_OTP':
      return { ...state, otp: action.payload };
    case 'SEND_OTP':
      return { ...state, verifyPhase: 'otp', otp: '', phoneVerified: false };
    case 'VERIFY_OTP':
      if (state.patientType === 'new') {
        return {
          ...state,
          phoneVerified: true,
          patientId: null,
          matchedPatients: [],
          lastDepartmentId: null,
          lastDoctorId: null,
        };
      }
      return { ...state, phoneVerified: true };
    case 'COMPLETE_EXISTING_VERIFY': {
      const matched = lookupExistingPatients(action.phone);
      const primary = matched[0]!;
      return {
        ...initialBookingState,
        step: 2,
        patientType: 'existing',
        phone: action.phone,
        otp: action.otp,
        verifyPhase: 'otp',
        phoneVerified: true,
        matchedPatients: matched,
        ...applyMatchedPatient(primary),
      };
    }
    case 'SELECT_MATCHED_PATIENT':
      return {
        ...state,
        ...applyMatchedPatient(action.payload),
        visitPurpose: null,
        notes: '',
      };
    case 'SET_DEPARTMENT': {
      const doctorStillValid =
        state.doctor && state.doctor.departments.includes(action.payload.id);
      return {
        ...state,
        department: action.payload,
        doctor: doctorStillValid ? state.doctor : null,
      };
    }
    case 'SET_DOCTOR':
      return { ...state, doctor: action.payload };
    case 'SET_DATE':
      return { ...state, date: action.payload, slot: null };
    case 'SET_SLOT':
      return { ...state, slot: action.payload };
    case 'PATCH_DETAILS': {
      const phoneChanged =
        action.payload.phone !== undefined && action.payload.phone !== state.phone;
      if (phoneChanged) {
        return {
          ...state,
          ...action.payload,
          verifyPhase: 'phone',
          otp: '',
          phoneVerified: false,
          matchedPatients: [],
        };
      }
      return { ...state, ...action.payload };
    }
    case 'NEXT': {
      const total = totalStepsFor(state.patientType);
      return { ...state, step: Math.min(state.step + 1, total + 1) };
    }
    case 'BACK':
      return { ...state, step: Math.max(state.step - 1, 1) };
    case 'CONFIRM': {
      const total = totalStepsFor(state.patientType);
      return { ...state, reference: action.reference, step: total + 1 };
    }
    case 'RESET':
      return { ...initialBookingState };
    default:
      return state;
  }
}

export function useBooking(initialOverrides?: Partial<BookingState>) {
  const [state, dispatch] = useReducer(
    reducer,
    initialOverrides ? { ...initialBookingState, ...initialOverrides } : initialBookingState,
  );

  const validate = useCallback((): { ok: boolean; messageKey?: string } => {
    if (state.step === 1 && !state.patientType) {
      return { ok: false, messageKey: 'err.patientType' };
    }

    const id = stepIdAt(state);

    if (id === 'profile' && state.patientType === 'new') {
      return validateNewRegistration(state);
    }
    if (id === 'profile' && state.patientType === 'existing') {
      return validateExistingProfile(state);
    }
    if (id === 'department' && !state.department) {
      return { ok: false, messageKey: 'err.department' };
    }
    if (id === 'datetime' && !state.slot) {
      return { ok: false, messageKey: 'err.slot' };
    }
    return { ok: true };
  }, [state]);

  const next = useCallback(() => {
    const id = stepIdAt(state);
    if (id === 'profile' && state.patientType === 'new') {
      dispatch({ type: 'VERIFY_OTP' });
      dispatch({ type: 'NEXT' });
      return;
    }
    dispatch({ type: 'NEXT' });
  }, [state]);

  return {
    state,
    steps: BOOKING_STEPS,
    stepId: stepIdAt(state),
    setPatientType: (payload: PatientType) => dispatch({ type: 'SET_PATIENT', payload }),
    setOtp: (payload: string) => dispatch({ type: 'SET_OTP', payload }),
    sendOtp: () => dispatch({ type: 'SEND_OTP' }),
    completeExistingVerify: (phone: string, otp: string) =>
      dispatch({ type: 'COMPLETE_EXISTING_VERIFY', phone, otp }),
    selectMatchedPatient: (payload: ExistingPatientRecord) =>
      dispatch({ type: 'SELECT_MATCHED_PATIENT', payload }),
    setDepartment: (payload: Department) => dispatch({ type: 'SET_DEPARTMENT', payload }),
    setDoctor: (payload: Doctor | null) => dispatch({ type: 'SET_DOCTOR', payload }),
    setDate: (payload: Date) => dispatch({ type: 'SET_DATE', payload }),
    setSlot: (payload: string) => dispatch({ type: 'SET_SLOT', payload }),
    patchDetails: (payload: Partial<BookingDetails>) =>
      dispatch({ type: 'PATCH_DETAILS', payload }),
    next,
    back: () => dispatch({ type: 'BACK' }),
    reset: () => dispatch({ type: 'RESET' }),
    confirm: () => {
      const reference = makeReference();
      dispatch({ type: 'CONFIRM', reference });
      return reference;
    },
    validate,
  };
}
