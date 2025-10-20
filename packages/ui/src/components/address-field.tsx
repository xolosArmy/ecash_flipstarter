import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Input } from './input';

export interface AddressFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const AddressField = forwardRef<HTMLInputElement, AddressFieldProps>(function AddressField(props, ref) {
  return <Input ref={ref} autoComplete="off" spellCheck={false} {...props} />;
});
