import * as ecashaddr from 'ecashaddrjs';
import { createHash } from 'node:crypto';

export type EcashPrefix = 'ecash' | 'ectest';

const SUPPORTED_PREFIXES: EcashPrefix[] = ['ecash', 'ectest'];

interface DecodedAddress {
  prefix: string;
  type: string;
  hash: number[];
}

const decodeAddress = (address: string): DecodedAddress => {
  const decoded = ecashaddr.decode(address) as DecodedAddress;
  if (
    !decoded ||
    typeof decoded.prefix !== 'string' ||
    typeof decoded.type !== 'string' ||
    !Array.isArray(decoded.hash)
  ) {
    throw new Error('Invalid eCash address');
  }

  return decoded;
};

export const isValidEcash = (address: string): boolean => {
  try {
    const decoded = decodeAddress(address);
    return SUPPORTED_PREFIXES.includes(decoded.prefix as EcashPrefix);
  } catch (error) {
    return false;
  }
};

export const getPrefix = (address: string): EcashPrefix => {
  const decoded = decodeAddress(address);
  if (!SUPPORTED_PREFIXES.includes(decoded.prefix as EcashPrefix)) {
    throw new Error(`Unsupported eCash prefix: ${decoded.prefix}`);
  }

  return decoded.prefix as EcashPrefix;
};

const hash160 = (data: Uint8Array): Uint8Array => {
  const sha256 = createHash('sha256').update(data).digest();
  const ripe = createHash('ripemd160').update(sha256).digest();
  return new Uint8Array(ripe);
};

export const toLockingBytecodeP2PKH = (address: string): Uint8Array => {
  const decoded = decodeAddress(address);
  if (decoded.type.toLowerCase() !== 'p2pkh') {
    throw new Error('Only P2PKH addresses are supported');
  }

  const payload = Uint8Array.from(decoded.hash);
  const pubKeyHash = hash160(payload);
  if (pubKeyHash.length !== 20) {
    throw new Error('Unexpected hash length');
  }

  const lockingBytecode = new Uint8Array(25);
  lockingBytecode.set([0x76, 0xa9, 0x14]);
  lockingBytecode.set(pubKeyHash, 3);
  lockingBytecode.set([0x88, 0xac], 23);

  return lockingBytecode;
};
