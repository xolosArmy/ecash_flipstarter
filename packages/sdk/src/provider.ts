import { getUtxosByAddress, broadcastTx } from './chronik.js';
import { toLockingBytecodeP2PKH } from './addresses.js';
import type { ChronikUtxo } from './chronik.js';

const parseValue = (value: ChronikUtxo['value']): number => {
  const numeric = typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(numeric)) {
    throw new Error('Invalid UTXO value');
  }
  return numeric;
};

export const getUtxos = async (address: string): Promise<ChronikUtxo[]> =>
  getUtxosByAddress(address);

export const getAddressBalance = async (address: string): Promise<{ sats: number }> => {
  const utxos = await getUtxos(address);
  const sats = utxos.reduce((total, utxo) => total + parseValue(utxo.value), 0);
  return { sats };
};

export const sendRawTransaction = async (rawHex: string): Promise<{ txid: string }> =>
  broadcastTx(rawHex);

export const buildP2PKHLock = (address: string): Uint8Array => toLockingBytecodeP2PKH(address);
