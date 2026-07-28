import type { LucideIcon } from 'lucide-react';
import {
  Footprints,
  Flame,
  Clock,
  Wind,
  Stethoscope,
  ShieldCheck,
  UserPlus,
  UserCheck,
} from 'lucide-react';
import { STEP_IDS, translate } from '@/i18n';

/* ============================================================
   BOOKING — clinic, steps, departments, doctors (ids only;
   all user-facing copy lives in src/locales/*.json)
   ============================================================ */

export const CLINIC = {
  name: "KVNN's Advanced Wound Healing Clinics",
  phoneDisplay: '+91 90541 08789',
  phoneDigits: '919054108789',
  tel: '+919054108789',
  address: 'Saleemnagar, opp. Musharambagh Metro, Hyderabad',
} as const;

/** Wizard step ids — labels from locale `step.<id>`. */
export const BOOKING_STEPS = STEP_IDS;

export const TOTAL_STEPS = BOOKING_STEPS.length;

export type PatientType = 'new' | 'existing';

/** Phone → OTP phases inside the Verify step. */
export type VerifyPhase = 'phone' | 'otp';

export type Gender = 'male' | 'female' | 'other';

/** Why an existing patient is booking this visit. */
export type VisitPurpose = 'follow-up' | 'dressing' | 'new-concern' | 'second-opinion';

export type WoundDuration = 'lt1w' | '1to4w' | '1to3m' | 'gt3m';

/** Option ids only — labels from locale keys. */
export const GENDER_OPTIONS: Gender[] = ['male', 'female', 'other'];

export const WOUND_DURATION_OPTIONS: WoundDuration[] = [
  'lt1w',
  '1to4w',
  '1to3m',
  'gt3m',
];

export const VISIT_PURPOSE_OPTIONS: VisitPurpose[] = [
  'follow-up',
  'dressing',
  'new-concern',
  'second-opinion',
];

export function visitPurposeLabel(purpose: VisitPurpose | null): string {
  if (!purpose) return '';
  return translate(`visit.${purpose}.label`);
}

export function genderLabel(gender: Gender | ''): string {
  if (!gender) return '';
  return translate(`gender.${gender}`);
}

export function woundDurationLabel(id: string): string {
  if (!id) return '';
  return translate(`wound.${id}`);
}

export function departmentName(id: string): string {
  return translate(`dept.${id}.name`);
}

export function departmentDesc(id: string): string {
  return translate(`dept.${id}.desc`);
}

export function doctorName(id: string): string {
  return translate(`doctor.${id}.name`);
}

export function doctorRole(id: string): string {
  return translate(`doctor.${id}.role`);
}

export interface Department {
  id: string;
  Icon: LucideIcon;
}

export interface Doctor {
  id: string;
  initials: string;
  isLead: boolean;
  departments: string[];
}

export interface TimeSlot {
  time: string;
  taken: boolean;
}

export interface BookingState {
  step: number;
  patientType: PatientType | null;
  verifyPhase: VerifyPhase;
  otp: string;
  phoneVerified: boolean;
  patientId: string | null;
  /** Demo: last department/doctor for returning patients. */
  lastDepartmentId: string | null;
  lastDoctorId: string | null;
  department: Department | null;
  doctor: Doctor | null;
  date: Date | null;
  slot: string | null;
  name: string;
  phone: string;
  age: string;
  gender: Gender | '';
  locality: string;
  /** New patients only — how long the wound has been open. */
  woundDuration: string;
  /** Existing patients only — reason for this booking. */
  visitPurpose: VisitPurpose | null;
  notes: string;
  reference: string | null;
}

export type BookingDetails = Pick<
  BookingState,
  | 'name'
  | 'phone'
  | 'age'
  | 'gender'
  | 'locality'
  | 'woundDuration'
  | 'visitPurpose'
  | 'notes'
>;

/** Demo lookup — pretends we found a returning patient from the mobile number. */
export function lookupExistingPatient(phone: string): {
  name: string;
  age: string;
  gender: Gender;
  locality: string;
  patientId: string;
  lastDepartmentId: string;
  lastDoctorId: string;
} {
  const digits = phone.replace(/\D/g, '');
  const tail = digits.slice(-4) || '0000';
  return {
    name: 'Ramesh Kumar',
    age: '52',
    gender: 'male',
    locality: 'Saleemnagar, Hyderabad',
    patientId: `KVN-${tail}`,
    lastDepartmentId: 'diabetic',
    lastDoctorId: 'santosh',
  };
}

export const PATIENT_OPTIONS: {
  id: PatientType;
  Icon: LucideIcon;
}[] = [
  { id: 'new', Icon: UserPlus },
  { id: 'existing', Icon: UserCheck },
];

export const DEPARTMENTS: Department[] = [
  { id: 'diabetic', Icon: Footprints },
  { id: 'burns', Icon: Flame },
  { id: 'chronic', Icon: Clock },
  { id: 'advanced', Icon: Wind },
  { id: 'general', Icon: Stethoscope },
  { id: 'salvage', Icon: ShieldCheck },
];

export const DOCTORS: Doctor[] = [
  {
    id: 'santosh',
    initials: 'KS',
    isLead: true,
    departments: ['diabetic', 'burns', 'chronic', 'advanced', 'general', 'salvage'],
  },
  {
    id: 'wcspec',
    initials: 'WS',
    isLead: false,
    departments: ['chronic', 'general'],
  },
  {
    id: 'podiatry',
    initials: 'DF',
    isLead: false,
    departments: ['diabetic', 'salvage'],
  },
  {
    id: 'hbot',
    initials: 'HT',
    isLead: false,
    departments: ['advanced', 'burns'],
  },
  {
    id: 'nurse',
    initials: 'RN',
    isLead: false,
    departments: ['general', 'chronic', 'burns'],
  },
];

const WEEKDAY_SLOTS = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM',
];
const SUNDAY_SLOTS = ['11:00 AM', '12:00 PM', '4:00 PM'];

function seeded(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function formatLongDate(d: Date): string {
  return `${translate(`dow.${d.getDay()}`)}, ${d.getDate()} ${translate(`mon.${d.getMonth()}`)} ${d.getFullYear()}`;
}

export function formatShortDate(d: Date): string {
  return `${translate(`dow.${d.getDay()}`)}, ${d.getDate()} ${translate(`mon.${d.getMonth()}`)}`;
}

export function nextDays(count: number): Date[] {
  const out: Date[] = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  for (let i = 1; i <= count; i += 1) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    out.push(d);
  }
  return out;
}

export function isSunday(d: Date): boolean {
  return d.getDay() === 0;
}

export function slotsForDate(d: Date): TimeSlot[] {
  const sunday = isSunday(d);
  const base = sunday ? SUNDAY_SLOTS : WEEKDAY_SLOTS;
  const rnd = seeded(`${dateKey(d)}slots`);
  const threshold = sunday ? 0.34 : 0.42;
  return base.map((time) => ({ time, taken: rnd() < threshold }));
}

export function makeReference(): string {
  const raw = (Date.now().toString(36) + Math.random().toString(36).slice(2))
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
  return `APT-${raw.slice(0, 6)}`;
}

export function waLink(message: string): string {
  return `https://wa.me/${CLINIC.phoneDigits}?text=${encodeURIComponent(message)}`;
}

export function openExternal(url: string): void {
  const win = window.open(url, '_blank', 'noopener');
  if (win) return;
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function bookingMessage(booking: BookingState): string {
  const t = translate;
  const lines = [t('wa.hello', { clinic: CLINIC.name }), ''];
  if (booking.reference) lines.push(`${t('wa.ref')}: ${booking.reference}`);
  lines.push(
    `${t('wa.patient')}: ${
      booking.patientType === 'existing'
        ? t('review.existingPatient')
        : t('review.newPatient')
    }`,
  );
  if (booking.patientId) lines.push(`${t('wa.patientId')}: ${booking.patientId}`);
  if (booking.visitPurpose) {
    lines.push(`${t('wa.visitPurpose')}: ${visitPurposeLabel(booking.visitPurpose)}`);
  }
  if (booking.department) {
    lines.push(`${t('wa.department')}: ${departmentName(booking.department.id)}`);
  }
  lines.push(
    `${t('wa.specialist')}: ${
      booking.doctor ? doctorName(booking.doctor.id) : t('review.noPref')
    }`,
  );
  if (booking.date) lines.push(`${t('wa.preferredDate')}: ${formatLongDate(booking.date)}`);
  if (booking.slot) lines.push(`${t('wa.preferredTime')}: ${booking.slot}`);
  lines.push(`${t('wa.name')}: ${booking.name}`);
  lines.push(`${t('wa.mobile')}: ${booking.phone}`);
  if (booking.age) lines.push(`${t('wa.age')}: ${booking.age}`);
  if (booking.gender) lines.push(`${t('wa.gender')}: ${genderLabel(booking.gender)}`);
  if (booking.locality) lines.push(`${t('wa.locality')}: ${booking.locality}`);
  if (booking.woundDuration) {
    lines.push(`${t('wa.woundDuration')}: ${woundDurationLabel(booking.woundDuration)}`);
  }
  if (booking.notes) lines.push(`${t('wa.concern')}: ${booking.notes}`);
  return lines.join('\n');
}

function getInitialState(): BookingState {
  const baseState: BookingState = {
    step: 1,
    patientType: null,
    verifyPhase: 'phone',
    otp: '',
    phoneVerified: false,
    patientId: null,
    lastDepartmentId: null,
    lastDoctorId: null,
    department: null,
    doctor: null,
    date: null,
    slot: null,
    name: '',
    phone: '',
    age: '',
    gender: '',
    locality: '',
    woundDuration: '',
    visitPurpose: null,
    notes: '',
    reference: null,
  };

  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const pType = params.get('patientType');
    const pName = params.get('name');

    if (pType === 'new' || pType === 'existing') {
      baseState.patientType = pType;
      baseState.step = 2; // Jump to verify step
    }
    if (pName) {
      baseState.name = pName;
    }
  }

  return baseState;
}

export const initialBookingState: BookingState = getInitialState();
