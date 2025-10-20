import { describe, expect, it } from 'vitest';
import * as ecashaddr from 'ecashaddrjs';
import { createHash } from 'node:crypto';

import { getPrefix, isValidEcash, toLockingBytecodeP2PKH } from '../src/addresses.js';

const hash160 = (data: Uint8Array): Uint8Array => {
  const sha256 = createHash('sha256').update(data).digest();
  const ripe = createHash('ripemd160').update(sha256).digest();
  return new Uint8Array(ripe);
};

describe('addresses', () => {
  const address = 'ecash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a';

  it('validates ecash addresses', () => {
    expect(isValidEcash(address)).toBe(true);
    expect(isValidEcash('invalid-address')).toBe(false);
  });

  it('returns the correct prefix', () => {
    expect(getPrefix(address)).toBe('ecash');
  });

  it('derives a P2PKH locking bytecode', () => {
    const lockingBytecode = toLockingBytecodeP2PKH(address);
    const decoded = ecashaddr.decode(address) as { hash: number[] };
    const expectedHash = hash160(Uint8Array.from(decoded.hash));

    expect(lockingBytecode.length).toBe(25);
    expect(Array.from(lockingBytecode.slice(0, 3))).toEqual([0x76, 0xa9, 0x14]);
    expect(Array.from(lockingBytecode.slice(23))).toEqual([0x88, 0xac]);
    expect(Buffer.from(lockingBytecode.slice(3, 23))).toEqual(Buffer.from(expectedHash));
  });
});
