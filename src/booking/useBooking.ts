import { useCallback, useReducer } from 'react';
import {
  BOOKING_STEPS,
  DEPARTMENTS,
  DOCTORS,
  TOTAL_STEPS,
  initialBookingState,
  lookupExistingPatient,
  makeReference,
  type BookingDetails,
  type BookingState,
  type Department,
  type Doctor,
  type PatientType,
} from './index';

type Action =
  | { type: 'SET_PATIENT'; payload: PatientType }
  | { type: 'SET_OTP'; payload: string }
  | { type: 'SEND_OTP' }
  | { type: 'VERIFY_OTP' }
  | { type: 'SET_DEPARTMENT'; payload: Department }
  | { type: 'SET_DOCTOR'; payload: Doctor | null }
  | { type: 'SET_DATE'; payload: Date }
  | { type: 'SET_SLOT'; payload: string }
  | { type: 'PATCH_DETAILS'; payload: Partial<BookingDetails> }
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'CONFIRM'; reference: string }
  | { type: 'RESET' };

function clearProfileFields(): Pick<
  BookingState,
  | 'otp'
  | 'phoneVerified'
  | 'patientId'
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
> {
  return {
    verifyPhase: 'phone',
    otp: '',
    phoneVerified: false,
    patientId: null,
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
    case 'VERIFY_OTP': {
      if (state.patientType === 'existing') {
        const found = lookupExistingPatient(state.phone);
        const department =
          DEPARTMENTS.find((d) => d.id === found.lastDepartmentId) ?? null;
        const doctor = DOCTORS.find((d) => d.id === found.lastDoctorId) ?? null;
        return {
          ...state,
          phoneVerified: true,
          patientId: found.patientId,
          name: found.name,
          age: found.age,
          gender: found.gender,
          locality: found.locality,
          lastDepartmentId: found.lastDepartmentId,
          lastDoctorId: found.lastDoctorId,
          department,
          doctor,
          woundDuration: '',
          visitPurpose: null,
          notes: '',
        };
      }
      return {
        ...state,
        phoneVerified: true,
        patientId: null,
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
    case 'PATCH_DETAILS':
      return { ...state, ...action.payload };
    case 'NEXT':
      return { ...state, step: Math.min(state.step + 1, TOTAL_STEPS + 1) };
    case 'BACK': {
      if (state.step === 3) {
        return {
          ...state,
          step: 2,
          phoneVerified: false,
          verifyPhase: state.phone ? 'otp' : 'phone',
        };
      }
      if (state.step === 2 && state.verifyPhase === 'otp') {
        return { ...state, verifyPhase: 'phone', otp: '', phoneVerified: false };
      }
      return { ...state, step: Math.max(state.step - 1, 1) };
    }
    case 'CONFIRM':
      return { ...state, reference: action.reference, step: TOTAL_STEPS + 1 };
    case 'RESET':
      return { ...initialBookingState };
    default:
      return state;
  }
}

export function useBooking(initialOverrides?: Partial<BookingState>) {
  const [state, dispatch] = useReducer(reducer, { ...initialBookingState, ...initialOverrides });

  const validate = useCallback((): { ok: boolean; messageKey?: string } => {
    if (state.step === 1 && !state.patientType) {
      return { ok: false, messageKey: 'err.patientType' };
    }
    if (state.step === 2) {
      if (state.verifyPhase === 'phone') {
        if (state.phone.replace(/\D/g, '').length < 10) {
          return { ok: false, messageKey: 'err.phone' };
        }
      } else if (!state.otp.trim()) {
        return { ok: false, messageKey: 'err.otp' };
      }
    }
    if (state.step === 3) {
      if (state.patientType === 'existing') {
        if (!state.visitPurpose) {
          return { ok: false, messageKey: 'err.visitPurpose' };
        }
        if (state.visitPurpose === 'new-concern' && !state.notes.trim()) {
          return { ok: false, messageKey: 'err.newConcern' };
        }
      } else {
        if (!state.name.trim()) {
          return { ok: false, messageKey: 'err.name' };
        }
        if (!state.age.trim()) {
          return { ok: false, messageKey: 'err.age' };
        }
        if (!state.gender) {
          return { ok: false, messageKey: 'err.gender' };
        }
        if (!state.locality.trim()) {
          return { ok: false, messageKey: 'err.locality' };
        }
        if (!state.woundDuration) {
          return { ok: false, messageKey: 'err.woundDuration' };
        }
        if (!state.notes.trim()) {
          return { ok: false, messageKey: 'err.notes' };
        }
      }
    }
    if (state.step === 4 && !state.department) {
      return { ok: false, messageKey: 'err.department' };
    }
    if (state.step === 6 && !state.slot) {
      return { ok: false, messageKey: 'err.slot' };
    }
    return { ok: true };
  }, [state]);

  const next = useCallback(() => {
    if (state.step === 2 && state.verifyPhase === 'phone') {
      dispatch({ type: 'SEND_OTP' });
      return;
    }
    if (state.step === 2 && state.verifyPhase === 'otp') {
      dispatch({ type: 'VERIFY_OTP' });
      dispatch({ type: 'NEXT' });
      return;
    }
    dispatch({ type: 'NEXT' });
  }, [state.step, state.verifyPhase]);

  return {
    state,
    steps: BOOKING_STEPS,
    setPatientType: (payload: PatientType) => dispatch({ type: 'SET_PATIENT', payload }),
    setOtp: (payload: string) => dispatch({ type: 'SET_OTP', payload }),
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
