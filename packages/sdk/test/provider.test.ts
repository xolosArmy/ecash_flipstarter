import { describe, expect, it, vi } from 'vitest';

vi.mock('../src/chronik.js', () => ({
  getUtxosByAddress: vi.fn(),
  broadcastTx: vi.fn()
}));

vi.mock('../src/addresses.js', () => ({
  toLockingBytecodeP2PKH: vi.fn()
}));

const chronik = await import('../src/chronik.js');
const addresses = await import('../src/addresses.js');
const provider = await import('../src/provider.js');

describe('provider', () => {
  it('returns utxos for an address', async () => {
    const mockUtxos = [
      { value: '50', outpoint: { txid: 'a', outIdx: 0 } },
      { value: 25, outpoint: { txid: 'b', outIdx: 1 } }
    ];

    (chronik.getUtxosByAddress as any).mockResolvedValue(mockUtxos);

    const utxos = await provider.getUtxos('ecash:qq...');
    expect(utxos).toEqual(mockUtxos);
    expect(chronik.getUtxosByAddress).toHaveBeenCalledWith('ecash:qq...');
  });

  it('computes address balances', async () => {
    (chronik.getUtxosByAddress as any).mockResolvedValue([
      { value: '50', outpoint: { txid: 'a', outIdx: 0 } },
      { value: 25, outpoint: { txid: 'b', outIdx: 1 } }
    ]);

    const balance = await provider.getAddressBalance('ecash:qq...');
    expect(balance).toEqual({ sats: 75 });
  });

  it('broadcasts raw transactions', async () => {
    (chronik.broadcastTx as any).mockResolvedValue({ txid: '123' });

    const result = await provider.sendRawTransaction('rawhex');
    expect(result).toEqual({ txid: '123' });
    expect(chronik.broadcastTx).toHaveBeenCalledWith('rawhex');
  });

  it('builds locking bytecode for P2PKH addresses', () => {
    (addresses.toLockingBytecodeP2PKH as any).mockReturnValue(new Uint8Array([1, 2, 3]));

    const bytecode = provider.buildP2PKHLock('ecash:qq...');
    expect(bytecode).toEqual(new Uint8Array([1, 2, 3]));
    expect(addresses.toLockingBytecodeP2PKH).toHaveBeenCalledWith('ecash:qq...');
  });
});
