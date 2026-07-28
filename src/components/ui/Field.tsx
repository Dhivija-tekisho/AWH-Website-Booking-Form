import { type InputHTMLAttributes, type TextareaHTMLAttributes, useId } from 'react';

const fieldClass =
  'w-full rounded-lg border-[1.6px] border-line bg-mist px-3 py-2.5 text-[0.95rem] ' +
  'text-ink transition-all focus:border-jade focus:bg-white focus:outline-none';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
}

export function InputField({ label, required = false, id, ...rest }: InputFieldProps) {
  const generated = useId();
  const fieldId = id ?? generated;
  return (
    <div className="mb-3">
      <label htmlFor={fieldId} className="mb-1 block text-[0.82rem] font-semibold">
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
      <label htmlFor={fieldId} className="mb-1 block text-[0.82rem] font-semibold">
        {label} {required && <span className="text-rose">*</span>}
      </label>
      <textarea id={fieldId} className={`${fieldClass} min-h-[64px] resize-none`} {...rest} />
    </div>
  );
}
