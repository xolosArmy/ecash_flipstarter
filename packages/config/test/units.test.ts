import { describe, expect, it } from 'vitest';

import { DECIMALS_XEC, SATS_PER_XEC, toSatsFromXec, toXecFromSats } from '../src/units.js';

describe('units', () => {
  it('uses two decimal places for XEC amounts', () => {
    expect(DECIMALS_XEC).toBe(2);
    expect(SATS_PER_XEC).toBe(100);
  });

  it('converts XEC to satoshis', () => {
    expect(toSatsFromXec(0)).toBe(0);
    expect(toSatsFromXec(1)).toBe(100);
    expect(toSatsFromXec(0.01)).toBe(1);
    expect(toSatsFromXec(123.45)).toBe(12_345);
  });

  it('converts satoshis to XEC', () => {
    expect(toXecFromSats(0)).toBe(0);
    expect(toXecFromSats(100)).toBe(1);
    expect(toXecFromSats(1)).toBe(0.01);
    expect(toXecFromSats(12_345)).toBeCloseTo(123.45);
  });

  it('guards against invalid numbers', () => {
    expect(() => toSatsFromXec(Number.NaN)).toThrowError(TypeError);
    expect(() => toXecFromSats(Number.POSITIVE_INFINITY)).toThrowError(TypeError);
  });
});
