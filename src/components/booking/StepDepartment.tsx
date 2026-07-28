import { DEPARTMENTS, type Department } from '@/booking';
import { useLang } from '@/i18n';
import { SelectMark } from './shared';

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
    <div className="h-full">
      <h2 className="text-[clamp(1.25rem,2.8vw,1.7rem)] font-semibold text-ink">
        {existing ? t('dept.title.existing') : t('dept.title.new')}
      </h2>
      <p className="mt-1 text-[0.88rem] text-ink-soft">
        {existing ? t('dept.subtitle.existing') : t('dept.subtitle.new')}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
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
                'flex items-start gap-2 rounded-lg border-2 p-2.5 text-left transition-all',
                selected
                  ? 'border-emerald bg-mist/60 shadow-sm'
                  : 'border-line bg-white hover:border-jade/50 hover:bg-mist/30',
              ].join(' ')}
            >
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-gradient-to-br from-mist to-mist-2 text-emerald">
                <Icon className="h-4 w-4" strokeWidth={1.8} />
              </span>
              <span className="min-w-0 flex-1">
                <h4 className="text-[0.88rem] font-semibold leading-snug text-ink">
                  {t(`dept.${dept.id}.name`)}
                </h4>
                <p className="mt-0.5 text-[0.72rem] leading-snug text-ink-soft">
                  {t(`dept.${dept.id}.desc`)}
                </p>
                {lastVisit && (
                  <span className="mt-1 inline-block text-[0.7rem] font-semibold text-jade">
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
