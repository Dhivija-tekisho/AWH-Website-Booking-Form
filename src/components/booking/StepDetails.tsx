import { UserCheck, UserPlus } from 'lucide-react';
import { InputField, TextareaField } from '@/components/ui/Field';
import { SelectMark } from './shared';
import {
  GENDER_OPTIONS,
  VISIT_PURPOSE_OPTIONS,
  WOUND_DURATION_OPTIONS,
  type BookingDetails,
  type Gender,
  type PatientType,
  type VisitPurpose,
} from '@/booking';
import { useLang } from '@/i18n';

interface Props {
  patientType: PatientType | null;
  patientId: string | null;
  phone: string;
  details: BookingDetails;
  onChange: (patch: Partial<BookingDetails>) => void;
}

function ChoiceRow<T extends string>({
  label,
  required,
  options,
  value,
  onSelect,
}: {
  label: string;
  required?: boolean;
  options: { id: T; label: string; description?: string }[];
  value: T | '' | null;
  onSelect: (id: T) => void;
}) {
  return (
    <div className="mb-3">
      <p className="mb-1.5 text-[0.82rem] font-semibold">
        {label} {required && <span className="text-rose">*</span>}
      </p>
      <div className="grid gap-1.5 sm:grid-cols-2">
        {options.map((opt) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              aria-pressed={active}
              className={[
                'flex w-full items-center gap-2 rounded-lg border-2 px-2.5 py-2 text-left transition-all',
                active
                  ? 'border-emerald bg-mist/60 shadow-sm'
                  : 'border-line bg-white hover:border-jade/50',
              ].join(' ')}
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[0.88rem] font-semibold text-ink">{opt.label}</span>
                {opt.description && (
                  <span className="mt-0.5 block text-[0.75rem] leading-snug text-ink-soft">
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

export function StepDetails({ patientType, patientId, phone, details, onChange }: Props) {
  const { t } = useLang();
  const existing = patientType === 'existing';

  if (existing) {
    const needsNotes = details.visitPurpose === 'new-concern';

    return (
      <div className="h-full">
        <h2 className="text-[clamp(1.25rem,2.8vw,1.7rem)] font-semibold text-ink">
          {t('details.existing.title')}
        </h2>
        <p className="mt-1 text-[0.88rem] text-ink-soft">{t('details.existing.subtitle')}</p>

        <div className="mt-3 rounded-lg border-2 border-emerald/40 bg-mist/50 p-3">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-gradient-to-br from-mist to-mist-2 text-emerald">
              <UserCheck className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-ink-faint">
                {t('details.onFile')}
              </p>
              <p className="mt-0.5 text-[1rem] font-semibold text-ink">{details.name || '—'}</p>
              <p className="text-[0.82rem] text-ink-soft">
                {patientId ? `ID ${patientId}` : t('details.returning')} · {phone}
              </p>
            </div>
          </div>
          <dl className="mt-2 grid gap-1.5 border-t border-line/80 pt-2 text-[0.82rem] sm:grid-cols-3">
            <div>
              <dt className="text-ink-faint">{t('details.age')}</dt>
              <dd className="font-semibold text-ink">{details.age || '—'}</dd>
            </div>
            <div>
              <dt className="text-ink-faint">{t('details.gender')}</dt>
              <dd className="font-semibold text-ink">
                {details.gender ? t(`gender.${details.gender}`) : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-ink-faint">{t('details.locality')}</dt>
              <dd className="font-semibold text-ink">{details.locality || '—'}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-3">
          <ChoiceRow<VisitPurpose>
            label={t('details.visitWhy')}
            required
            options={VISIT_PURPOSE_OPTIONS.map((id) => ({
              id,
              label: t(`visit.${id}.label`),
              description: t(`visit.${id}.desc`),
            }))}
            value={details.visitPurpose}
            onSelect={(visitPurpose) => onChange({ visitPurpose })}
          />

          <TextareaField
            label={needsNotes ? t('details.notes.newConcern') : t('details.notes.optional')}
            required={needsNotes}
            value={details.notes}
            placeholder={
              needsNotes
                ? t('details.notes.placeholder.required')
                : t('details.notes.placeholder.optional')
            }
            onChange={(e) => onChange({ notes: e.target.value })}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <h2 className="text-[clamp(1.25rem,2.8vw,1.7rem)] font-semibold text-ink">
        {t('details.new.title')}
      </h2>
      <p className="mt-1 text-[0.88rem] text-ink-soft">{t('details.new.subtitle')}</p>

      <div className="mb-3 mt-3 flex items-center gap-3 rounded-lg border border-line bg-mist/40 px-3 py-2">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-gradient-to-br from-mist to-mist-2 text-emerald">
          <UserPlus className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-ink-faint">
            {t('details.creating')}
          </p>
          <p className="text-[0.88rem] text-ink-soft">
            {t('details.verifiedMobile')} <span className="font-semibold text-ink">{phone}</span>
          </p>
        </div>
      </div>

      <InputField
        label={t('details.fullName')}
        required
        value={details.name}
        autoComplete="name"
        placeholder={t('details.fullName.placeholder')}
        onChange={(e) => onChange({ name: e.target.value })}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <InputField
          label={t('details.age')}
          required
          type="number"
          min={0}
          max={120}
          value={details.age}
          placeholder={t('details.age.placeholder')}
          onChange={(e) => onChange({ age: e.target.value })}
        />
        <InputField
          label={t('details.locality.label')}
          required
          value={details.locality}
          autoComplete="address-level2"
          placeholder={t('details.locality.placeholder')}
          onChange={(e) => onChange({ locality: e.target.value })}
        />
      </div>

      <ChoiceRow<Gender>
        label={t('details.gender')}
        required
        options={GENDER_OPTIONS.map((id) => ({ id, label: t(`gender.${id}`) }))}
        value={details.gender}
        onSelect={(gender) => onChange({ gender })}
      />

      <ChoiceRow<string>
        label={t('details.woundDuration')}
        required
        options={WOUND_DURATION_OPTIONS.map((id) => ({
          id,
          label: t(`wound.${id}`),
        }))}
        value={details.woundDuration}
        onSelect={(woundDuration) => onChange({ woundDuration })}
      />

      <TextareaField
        label={t('details.concern')}
        required
        value={details.notes}
        placeholder={t('details.concern.placeholder')}
        onChange={(e) => onChange({ notes: e.target.value })}
      />
    </div>
  );
}
