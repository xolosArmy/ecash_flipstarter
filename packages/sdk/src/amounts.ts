export {
  DECIMALS_XEC,
  SATS_PER_XEC,
  toSatsFromXec,
  toXecFromSats
} from '@ecash-flipstarter/config';

import { DECIMALS_XEC, toSatsFromXec, toXecFromSats } from '@ecash-flipstarter/config';

const DEFAULT_FORMAT_OPTIONS: Intl.NumberFormatOptions = {
  minimumFractionDigits: 0,
  maximumFractionDigits: DECIMALS_XEC
};

export const formatXec = (
  satoshis: number,
  options: Intl.NumberFormatOptions = DEFAULT_FORMAT_OPTIONS
): string => {
  const amount = toXecFromSats(satoshis);
  return amount.toLocaleString(undefined, { ...DEFAULT_FORMAT_OPTIONS, ...options });
};

export const parseXec = (input: string): number => {
  const normalized = input
    .trim()
    .replace(/xec$/i, '')
    .replace(/[,_\s]/g, '')
    .trim();

  if (!normalized) {
    throw new Error('Amount is required');
  }

  const amount = Number(normalized);
  if (!Number.isFinite(amount)) {
    throw new Error('Invalid XEC amount');
  }

  return toSatsFromXec(amount);
};
