import { DEPARTMENTS, type Department } from '@/booking';
import { useLang } from '@/i18n';
import { CARD_GRID, SelectMark, StepHeader } from './shared';

interface Props {
  selectedId: string | null;
  lastDepartmentId?: string | null;
  patientType?: 'new' | 'existing' | null;
  onSelect: (dept: Department) => void;
}

export function StepDepartment({
  selectedId,
  lastDepartmentId = null,
  patientType = null,
  onSelect,
}: Props) {
  const { t } = useLang();
  const existing = patientType === 'existing';

  return (
    <div className="flex min-h-full flex-col">
      <StepHeader
        title={existing ? t('dept.title.existing') : t('dept.title.new')}
        subtitle={existing ? t('dept.subtitle.existing') : t('dept.subtitle.new')}
      />
      <div className={`my-auto ${CARD_GRID}`}>
        {DEPARTMENTS.map((dept) => {
          const selected = selectedId === dept.id;
          const lastVisit = existing && lastDepartmentId === dept.id;
          const { Icon } = dept;
          return (
            <button
              key={dept.id}
              type="button"
              onClick={() => onSelect(dept)}
              aria-pressed={selected}
              className={[
                'flex h-full items-start gap-3 rounded-lg border-2 p-4 text-left transition-all',
                selected
                  ? 'border-emerald bg-mist/60 shadow-sm'
                  : 'border-line bg-white hover:border-jade/50 hover:bg-mist/30',
              ].join(' ')}
            >
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-gradient-to-br from-mist to-mist-2 text-emerald">
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <span className="min-w-0 flex-1">
                <h4 className="text-[0.88rem] font-semibold leading-snug text-ink [overflow-wrap:anywhere]">
                  {t(`dept.${dept.id}.name`)}
                </h4>
                <p className="mt-1 text-[0.74rem] leading-snug text-ink-soft [overflow-wrap:anywhere]">
                  {t(`dept.${dept.id}.desc`)}
                </p>
                {lastVisit && (
                  <span className="mt-1 inline-block text-[0.7rem] font-semibold leading-snug text-jade">
                    {t('dept.lastVisit')}
                  </span>
                )}
              </span>
              <SelectMark active={selected} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
