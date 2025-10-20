import { cloneElement, forwardRef, isValidElement } from 'react';
import type { ButtonHTMLAttributes, ReactElement } from 'react';
import { cn } from '../utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = {
  asChild?: boolean;
  variant?: ButtonVariant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-brand-primary text-white hover:bg-brand-light',
  secondary: 'bg-transparent text-white border border-white/20 hover:border-white/40',
  ghost: 'bg-transparent text-white hover:bg-white/10'
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, children, asChild, variant = 'primary', ...props },
  ref
) {
  const classes = cn(
    'inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light disabled:opacity-40 disabled:cursor-not-allowed',
    variantStyles[variant],
    className
  );

  if (asChild && isValidElement(children)) {
    return cloneElement(children as ReactElement, {
      className: cn(classes, (children as ReactElement).props.className),
      ref,
      ...props
    });
  }

  return (
    <button ref={ref} className={classes} {...props}>
      {children}
    </button>
  );
});
