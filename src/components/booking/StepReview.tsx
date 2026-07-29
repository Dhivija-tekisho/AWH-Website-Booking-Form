import {
  departmentName,
  doctorName,
  formatLongDate,
  genderLabel,
  visitPurposeLabel,
  woundDurationLabel,
  type BookingState,
} from '@/booking';
import { useLang } from '@/i18n';
import { StepHeader } from './shared';

interface Props {
  state: BookingState;
}

export function StepReview({ state }: Props) {
  const { lang, t } = useLang();
  const compact = lang !== 'en';

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
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      {compact ? (
        <header className="mb-2 flex-none">
          <h2 className="text-[clamp(1.25rem,2.8vw,1.7rem)] font-semibold leading-tight text-ink">
            {t('review.title')}
          </h2>
        </header>
      ) : (
        <StepHeader title={t('review.title')} subtitle={t('review.subtitle') || undefined} />
      )}

      <dl className="grid w-full flex-none gap-px overflow-hidden rounded-lg border border-line bg-line">
        {rows.map(([k, v]) => (
          <div
            key={k}
            className={[
              'flex min-w-0 items-center justify-between gap-3 bg-white px-3',
              compact ? 'py-0.5' : 'py-1',
            ].join(' ')}
          >
            <dt
              className="flex-none basis-[36%] text-[0.7rem] font-semibold leading-tight text-ink-faint [overflow-wrap:anywhere] sm:text-[0.74rem]"
            >
              {k}
            </dt>
            <dd
              className="min-w-0 flex-1 text-right text-[0.76rem] font-semibold leading-tight text-ink [overflow-wrap:anywhere] sm:text-[0.8rem]"
            >
              {v}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
