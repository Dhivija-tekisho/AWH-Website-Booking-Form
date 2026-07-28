import { Check } from 'lucide-react';
import {
  departmentName,
  doctorName,
  formatLongDate,
  genderLabel,
  visitPurposeLabel,
  woundDurationLabel,
  type BookingState,
} from '@/booking';
import { Button } from '@/components/ui/Button';
import { useLang } from '@/i18n';

interface Props {
  state: BookingState;
  onBack: () => void;
  onConfirm: () => void;
}

export function StepReview({ state, onBack, onConfirm }: Props) {
  const { t } = useLang();

  const rows: [string, string][] = [
    [
      t('review.patient'),
      state.patientType === 'existing' ? t('review.existingPatient') : t('review.newPatient'),
    ],
  ];
  if (state.patientId) rows.push([t('review.patientId'), state.patientId]);
  if (state.visitPurpose) {
    rows.push([t('review.visitPurpose'), visitPurposeLabel(state.visitPurpose)]);
  }
  rows.push(
    [t('review.department'), state.department ? departmentName(state.department.id) : '—'],
    [t('review.specialist'), state.doctor ? doctorName(state.doctor.id) : t('review.noPref')],
    [t('review.date'), state.date ? formatLongDate(state.date) : '—'],
    [t('review.time'), state.slot ?? '—'],
    [t('review.name'), state.name || '—'],
    [t('review.mobile'), state.phone || '—'],
  );
  if (state.age) rows.push([t('review.age'), state.age]);
  if (state.gender) rows.push([t('review.gender'), genderLabel(state.gender)]);
  if (state.locality) rows.push([t('review.locality'), state.locality]);
  if (state.woundDuration) {
    rows.push([t('review.woundDuration'), woundDurationLabel(state.woundDuration)]);
  }
  if (state.notes) {
    rows.push([
      state.patientType === 'existing' ? t('review.notes') : t('review.concern'),
      state.notes,
    ]);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-hidden">
        <h2 className="text-[clamp(1.25rem,2.8vw,1.7rem)] font-semibold text-ink">
          {t('review.title')}
        </h2>
        <p className="mt-1 text-[0.88rem] text-ink-soft">{t('review.subtitle')}</p>

        <dl className="mt-3 divide-y divide-line overflow-hidden rounded-lg border border-line bg-white">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-start justify-between gap-3 px-3 py-2">
              <dt className="text-[0.82rem] font-semibold text-ink-faint">{k}</dt>
              <dd className="text-right text-[0.88rem] font-semibold text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-3 flex flex-none items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          {t('nav.back')}
        </Button>
        <span className="flex-1" />
        <Button variant="gold" size="md" onClick={onConfirm}>
          <Check className="h-4 w-4" strokeWidth={2.6} />
          {t('nav.confirmSend')}
        </Button>
      </div>
    </div>
  );
}
