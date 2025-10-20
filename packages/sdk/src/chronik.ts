import { getEnv } from '@ecash-flipstarter/config';

export type ScriptType = 'p2pkh' | 'p2sh' | 'p2tr';

export interface ChronikOutpoint {
  txid: string;
  outIdx: number;
}

export interface ChronikUtxo {
  outpoint: ChronikOutpoint;
  value: string | number;
  [key: string]: unknown;
}

export interface ChronikClient {
  script: (
    type: ScriptType,
    payload: string
  ) => {
    utxos: () => Promise<ChronikUtxo[] | { utxos: ChronikUtxo[] }>;
  };
  address: (
    address: string
  ) => {
    utxos: () => Promise<ChronikUtxo[] | { utxos: ChronikUtxo[] }>;
  };
  tx: (txid: string) => Promise<unknown>;
  broadcastTx: (rawHex: string) => Promise<{ txid: string }>;
}

interface ChronikModule {
  ChronikClient?: new (url: string) => ChronikClient;
  default?: new (url: string) => ChronikClient;
}

let chronikPromise: Promise<ChronikClient> | null = null;

const getChronikUrl = (): string => {
  try {
    const { CHRONIK_URL } = getEnv();
    return CHRONIK_URL;
  } catch (error) {
    if (process.env.CHRONIK_URL) {
      return process.env.CHRONIK_URL;
    }
  }

  return 'https://chronik.be.cash/xec';
};

const createChronikClient = async (): Promise<ChronikClient> => {
  const mod = (await import('chronik-client')) as ChronikModule;
  const Client = mod.ChronikClient ?? mod.default;
  if (!Client) {
    throw new Error('Chronik client module did not export a constructor');
  }

  const url = getChronikUrl();
  return new Client(url);
};

export const getChronikClient = async (): Promise<ChronikClient> => {
  if (!chronikPromise) {
    chronikPromise = createChronikClient();
  }

  return chronikPromise;
};

const normalizeUtxoResponse = (
  result: ChronikUtxo[] | { utxos?: ChronikUtxo[] }
): ChronikUtxo[] => {
  if (Array.isArray(result)) {
    return result;
  }

  return result.utxos ?? [];
};

export const getUtxosByScriptType = async (
  scriptType: ScriptType,
  payload: string
): Promise<ChronikUtxo[]> => {
  const chronik = await getChronikClient();
  const response = await chronik.script(scriptType, payload).utxos();
  return normalizeUtxoResponse(response);
};

export const getUtxosByAddress = async (address: string): Promise<ChronikUtxo[]> => {
  const chronik = await getChronikClient();
  const response = await chronik.address(address).utxos();
  return normalizeUtxoResponse(response);
};

export const getTx = async (txid: string): Promise<unknown> => {
  const chronik = await getChronikClient();
  return chronik.tx(txid);
};

export const broadcastTx = async (rawHex: string): Promise<{ txid: string }> => {
  const chronik = await getChronikClient();
  return chronik.broadcastTx(rawHex);
};

export const __testing = {
  resetChronik: () => {
    chronikPromise = null;
  }
};
