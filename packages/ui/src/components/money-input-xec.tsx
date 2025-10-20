import { forwardRef, useState } from 'react';
import type { ChangeEvent, InputHTMLAttributes } from 'react';
import { cn } from '../utils';

interface MoneyInputXecProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>, value: number) => void;
}

export const MoneyInputXec = forwardRef<HTMLInputElement, MoneyInputXecProps>(function MoneyInputXec(
  { className, label, defaultValue = '', onChange, ...props },
  ref
) {
  const [value, setValue] = useState(String(defaultValue));

  return (
    <label className="flex w-full flex-col gap-2 text-left text-sm text-white/80">
      {label && <span className="font-medium text-white">{label}</span>}
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 py-3 focus-within:border-brand-light focus-within:ring-1 focus-within:ring-brand-light">
        <span className="text-xs uppercase tracking-wide text-brand-light">XEC</span>
        <input
          ref={ref}
          inputMode="decimal"
          pattern="[0-9]*"
          className={cn('w-full bg-transparent text-base text-white placeholder:text-white/40 focus:outline-none', className)}
          value={value}
          onChange={(event) => {
            const next = event.target.value.replace(/[^0-9.]/g, '');
            setValue(next);
            const numericValue = Number.parseFloat(next || '0');
            onChange?.(event, Number.isFinite(numericValue) ? numericValue : 0);
          }}
          {...props}
        />
      </div>
    </label>
  );
});
