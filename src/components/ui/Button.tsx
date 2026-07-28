import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';

type Variant = 'gold' | 'emerald' | 'ghost' | 'whatsapp';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-pill font-bold leading-none ' +
  'transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none';

const variants: Record<Variant, string> = {
  gold: 'bg-gradient-to-br from-gold-2 to-gold text-emerald-deep shadow-gold hover:-translate-y-0.5',
  emerald: 'bg-emerald text-ivory shadow-md hover:bg-emerald-deep hover:-translate-y-0.5',
  ghost: 'bg-transparent text-emerald ring-[1.5px] ring-inset ring-gold/45 hover:bg-gold-soft',
  whatsapp: 'bg-[#1FA855] text-white hover:bg-[#178a45] hover:-translate-y-0.5',
};

const sizes: Record<Size, string> = {
  sm: 'text-[0.9rem] min-h-[44px] px-[1.1em]',
  md: 'text-[0.95rem] min-h-[48px] px-[1.5em]',
  lg: 'text-base min-h-[54px] px-[1.9em]',
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'emerald', size = 'md', className = '', children, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
});

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function LinkButton({
  variant = 'emerald',
  size = 'md',
  className = '',
  children,
  ...rest
}: LinkProps) {
  return (
    <a className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </a>
  );
}
