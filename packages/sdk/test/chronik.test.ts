import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const scriptUtxos = vi.fn();
const addressUtxos = vi.fn();
const tx = vi.fn();
const broadcastTx = vi.fn();
let currentClient: any;

const ChronikCtor = vi.fn(() => currentClient);

vi.mock('chronik-client', () => ({
  ChronikClient: ChronikCtor
}));

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();

  scriptUtxos.mockResolvedValue({ utxos: [] });
  addressUtxos.mockResolvedValue([]);
  tx.mockResolvedValue({ txid: 'abc' });
  broadcastTx.mockResolvedValue({ txid: 'broadcasted' });

  currentClient = {
    script: vi.fn().mockReturnValue({ utxos: scriptUtxos }),
    address: vi.fn().mockReturnValue({ utxos: addressUtxos }),
    tx,
    broadcastTx
  };

  process.env.CHRONIK_URL = 'https://chronik.test';
});

afterEach(() => {
  delete process.env.CHRONIK_URL;
});

describe('chronik helpers', () => {
  it('instantiates a single chronik client and fetches utxos by script', async () => {
    const chronik = await import('../src/chronik.js');
    scriptUtxos.mockResolvedValue({ utxos: [{ value: '100' }] });

    const utxos = await chronik.getUtxosByScriptType('p2pkh', 'payload');
    await chronik.getUtxosByAddress('ecash:qqtest');

    expect(ChronikCtor).toHaveBeenCalledTimes(1);
    expect(currentClient.script).toHaveBeenCalledWith('p2pkh', 'payload');
    expect(utxos).toEqual([{ value: '100' }]);
  });

  it('fetches utxos by address', async () => {
    const chronik = await import('../src/chronik.js');
    addressUtxos.mockResolvedValue([{ value: 50 }]);

    const utxos = await chronik.getUtxosByAddress('ecash:qqtest');

    expect(currentClient.address).toHaveBeenCalledWith('ecash:qqtest');
    expect(utxos).toEqual([{ value: 50 }]);
  });

  it('fetches transactions and broadcasts raw hex', async () => {
    const chronik = await import('../src/chronik.js');

    const txResult = await chronik.getTx('txid123');
    const broadcastResult = await chronik.broadcastTx('deadbeef');

    expect(tx).toHaveBeenCalledWith('txid123');
    expect(broadcastTx).toHaveBeenCalledWith('deadbeef');
    expect(txResult).toEqual({ txid: 'abc' });
    expect(broadcastResult).toEqual({ txid: 'broadcasted' });
  });
});
