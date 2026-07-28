import { Sparkles } from 'lucide-react';
import { DOCTORS, type Department, type Doctor } from '@/booking';
import { useLang } from '@/i18n';
import { SelectMark } from './shared';

interface Props {
  department: Department | null;
  selectedId: string | null;
  lastDoctorId?: string | null;
  patientType?: 'new' | 'existing' | null;
  onSelect: (doctor: Doctor | null) => void;
}

function slotsOpen(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) % 997;
  return 2 + (h % 7);
}

export function StepSpecialist({
  department,
  selectedId,
  lastDoctorId = null,
  patientType = null,
  onSelect,
}: Props) {
  const { t } = useLang();
  const existing = patientType === 'existing';
  const list = department
    ? DOCTORS.filter((d) => d.departments.includes(department.id))
    : DOCTORS;
  const doctors = list.length ? list : DOCTORS;

  return (
    <div className="h-full">
      <h2 className="text-[clamp(1.25rem,2.8vw,1.7rem)] font-semibold text-ink">
        {existing ? t('spec.title.existing') : t('spec.title.new')}
      </h2>
      <p className="mt-1 text-[0.88rem] text-ink-soft">
        {department && (
          <>
            {t('spec.for')}{' '}
            <strong className="text-emerald">{t(`dept.${department.id}.name`)}</strong>.{' '}
          </>
        )}
        {existing ? t('spec.subtitle.existing') : t('spec.subtitle.new')}
      </p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onSelect(null)}
          aria-pressed={selectedId === null}
          className={[
            'flex w-full items-center gap-3 rounded-lg border-2 p-2.5 text-left transition-all',
            selectedId === null
              ? 'border-emerald bg-mist/60 shadow-sm'
              : 'border-line bg-white hover:border-jade/50',
          ].join(' ')}
        >
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-gradient-to-br from-gold to-emerald text-ivory">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="min-w-0 flex-1">
            <h4 className="text-[0.92rem] font-semibold text-ink">{t('spec.noPref.name')}</h4>
            <small className="block text-[0.78rem] text-ink-soft">{t('spec.noPref.desc')}</small>
            <span className="mt-0.5 inline-block text-[0.72rem] font-semibold text-jade">
              {existing ? t('spec.noPref.hint.existing') : t('spec.noPref.hint.new')}
            </span>
          </span>
          <SelectMark active={selectedId === null} />
        </button>

        {doctors.map((doctor) => {
          const selected = selectedId === doctor.id;
          const lastVisit = existing && lastDoctorId === doctor.id;
          return (
            <button
              key={doctor.id}
              type="button"
              onClick={() => onSelect(doctor)}
              aria-pressed={selected}
              className={[
                'flex w-full items-center gap-3 rounded-lg border-2 p-2.5 text-left transition-all',
                selected
                  ? 'border-emerald bg-mist/60 shadow-sm'
                  : 'border-line bg-white hover:border-jade/50',
              ].join(' ')}
            >
              <span
                className={[
                  'flex h-9 w-9 flex-none items-center justify-center rounded-full text-xs font-bold text-ivory',
                  doctor.isLead
                    ? 'bg-gradient-to-br from-gold to-emerald'
                    : 'bg-gradient-to-br from-emerald-2 to-emerald',
                ].join(' ')}
              >
                {doctor.initials}
              </span>
              <span className="min-w-0 flex-1">
                <h4 className="text-[0.92rem] font-semibold leading-snug text-ink">
                  {t(`doctor.${doctor.id}.name`)}
                </h4>
                <small className="block text-[0.78rem] text-ink-soft">
                  {t(`doctor.${doctor.id}.role`)}
                </small>
                <span className="mt-0.5 inline-block text-[0.72rem] font-semibold text-jade">
                  {lastVisit
                    ? t('spec.lastVisit')
                    : t('spec.slots', {
                        n: slotsOpen(`${department?.id ?? 'x'}${doctor.id}`),
                      })}
                </span>
              </span>
              <SelectMark active={selected} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
