export const DECIMALS_XEC = 2;
export const SATS_PER_XEC = 10 ** DECIMALS_XEC;

export const toSatsFromXec = (amount: number): number => {
  if (!Number.isFinite(amount)) {
    throw new TypeError('Amount must be a finite number');
  }

  return Math.round(amount * SATS_PER_XEC);
};

export const toXecFromSats = (satoshis: number): number => {
  if (!Number.isFinite(satoshis)) {
    throw new TypeError('Satoshis must be a finite number');
  }

  return satoshis / SATS_PER_XEC;
};
