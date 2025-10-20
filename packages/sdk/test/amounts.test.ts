import { describe, expect, it } from 'vitest';

import { DECIMALS_XEC, SATS_PER_XEC, formatXec, parseXec } from '../src/amounts.js';

describe('amount helpers', () => {
  it('re-exports unit constants', () => {
    expect(DECIMALS_XEC).toBe(2);
    expect(SATS_PER_XEC).toBe(100);
  });

  it('formats satoshi amounts as XEC strings', () => {
    expect(formatXec(0)).toBe('0');
    expect(formatXec(1)).toBe('0.01');
    expect(formatXec(12_345)).toBe('123.45');
  });

  it('parses XEC strings into satoshis', () => {
    expect(parseXec('0')).toBe(0);
    expect(parseXec('0.01')).toBe(1);
    expect(parseXec('123.45')).toBe(12_345);
    expect(parseXec('1,234.56 XEC')).toBe(123_456);
  });

  it('throws on invalid input', () => {
    expect(() => parseXec('')).toThrowError('Amount is required');
    expect(() => parseXec('abc')).toThrowError('Invalid XEC amount');
  });
});
