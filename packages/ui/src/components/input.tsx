import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../utils';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, hint, id, ...props },
  ref
) {
  const inputId = id ?? props.name;

  return (
    <label className="flex w-full flex-col gap-2 text-left text-sm text-white/80" htmlFor={inputId}>
      {label && <span className="font-medium text-white">{label}</span>}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-brand-light focus:outline-none focus:ring-1 focus:ring-brand-light',
          className
        )}
        {...props}
      />
      {hint && <span className="text-xs text-white/50">{hint}</span>}
    </label>
  );
});
