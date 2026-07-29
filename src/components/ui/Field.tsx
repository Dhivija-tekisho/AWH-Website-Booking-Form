import { type InputHTMLAttributes, type TextareaHTMLAttributes, useId } from 'react';

const fieldClass =
  'w-full rounded-lg border-[1.6px] border-line bg-mist px-3 py-2 text-[0.95rem] ' +
  'leading-normal min-h-[44px] ' +
  'text-ink transition-all focus:border-jade focus:bg-white focus:outline-none ' +
  'disabled:cursor-not-allowed disabled:opacity-60';

/* Long translated labels wrap onto a second line instead of being clipped. */
const labelClass = 'mb-1 block text-[0.82rem] font-semibold leading-snug [overflow-wrap:anywhere]';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
}

export function InputField({ label, required = false, id, ...rest }: InputFieldProps) {
  const generated = useId();
  const fieldId = id ?? generated;
  return (
    <div className="mb-3">
      <label htmlFor={fieldId} className={labelClass}>
        {label} {required && <span className="text-rose">*</span>}
      </label>
      <input id={fieldId} className={fieldClass} {...rest} />
    </div>
  );
}

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
}

export function TextareaField({ label, required = false, id, ...rest }: TextareaFieldProps) {
  const generated = useId();
  const fieldId = id ?? generated;
  return (
    <div className="mb-3">
      <label htmlFor={fieldId} className={labelClass}>
        {label} {required && <span className="text-rose">*</span>}
      </label>
      <textarea id={fieldId} className={`${fieldClass} min-h-[60px] resize-none`} {...rest} />
    </div>
  );
}
