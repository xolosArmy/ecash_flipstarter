import { env, constants } from '@ecash-flipstarter/config';
import type { Campaign, Pledge, TransactionStatus } from '@ecash-flipstarter/types';

type ChronikClient = {
  broadcastTx: (rawTx: string) => Promise<{ txid: string }>;
  tx: (txid: string) => Promise<{ confirmations: number } | { confs: number }>;
};

type EcashLibModule = {
  Utils?: {
    toXec?: (satoshis: number) => number;
  };
};

type EcashAddrModule = {
  isValidCashAddress?: (address: string) => boolean;
  toCashAddress?: (address: string) => string;
};

export interface CreatePledgeInput {
  campaignId: Campaign['id'];
  amountSatoshis: number;
  address: string;
  rawTransactionHex?: string;
}

class EcashFlipstarterSdk {
  private chronikPromise?: Promise<ChronikClient | null>;

  private async loadChronik(): Promise<ChronikClient | null> {
    if (!this.chronikPromise) {
      this.chronikPromise = import('@fullstackcash/chronik-client')
        .then((mod: any) => {
          const Client = mod?.ChronikClient ?? mod?.default;
          if (!Client) {
            return null;
          }
          const url = env.CHRONIK_URL ?? 'https://chronik.be.cash/xec';
          return new Client(url) as ChronikClient;
        })
        .catch(() => null);
    }

    return this.chronikPromise;
  }

  private async normalizeAddress(address: string): Promise<string> {
    try {
      const mod: EcashAddrModule = (await import('ecashaddrjs')) as any;
      if (typeof mod.isValidCashAddress === 'function' && !mod.isValidCashAddress(address)) {
        throw new Error('Invalid eCash address');
      }
      if (typeof mod.toCashAddress === 'function') {
        return mod.toCashAddress(address);
      }
      return address;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      return address;
    }
  }

  private async toXec(satoshis: number): Promise<number> {
    const mod: EcashLibModule = (await import('ecash-lib')) as any;
    if (mod?.Utils?.toXec) {
      return mod.Utils.toXec(satoshis);
    }
    return satoshis / 100;
  }

  campaigns = {
    list: async (): Promise<Campaign[]> => {
      const now = new Date();
      return [
        {
          id: 'demo-campaign',
          title: 'Launch builders on eCash',
          description: 'A sample campaign bootstrap demonstrating the SDK surface.',
          ownerAddress: 'ecash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a',
          goalSatoshis: 5_000_000,
          pledgedSatoshis: 1_500_000,
          expiresAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7),
          createdAt: now,
          network: constants.defaultNetwork,
          nftTokenId: undefined
        }
      ];
    }
  };

  pledges = {
    create: async ({ campaignId, amountSatoshis, address, rawTransactionHex }: CreatePledgeInput): Promise<Pledge> => {
      const normalizedAddress = await this.normalizeAddress(address);
      const chronik = await this.loadChronik();

      let txId: string | undefined;
      if (rawTransactionHex && chronik) {
        try {
          const result = await chronik.broadcastTx(rawTransactionHex);
          txId = result.txid;
        } catch (error) {
          throw new Error(`Failed to broadcast pledge transaction: ${(error as Error).message}`);
        }
      }

      return {
        id: `${campaignId}-${Date.now()}`,
        campaignId,
        pledgerAddress: normalizedAddress,
        amountSatoshis,
        txId,
        status: txId ? 'broadcast' : 'pending',
        createdAt: new Date()
      } satisfies Pledge;
    }
  };

  transactions = {
    status: async (txId: string): Promise<TransactionStatus> => {
      const chronik = await this.loadChronik();
      if (!chronik) {
        return { txId, status: 'pending', confirmations: 0 } satisfies TransactionStatus;
      }

      const tx = await chronik.tx(txId);
      const confirmations = (tx as any).confirmations ?? (tx as any).confs ?? 0;
      let status: TransactionStatus['status'] = 'broadcast';
      if (confirmations >= 1) {
        status = 'confirmed';
      }

      return { txId, status, confirmations } satisfies TransactionStatus;
    },
    formatAmount: async (satoshis: number) => {
      const xec = await this.toXec(satoshis);
      return `${xec.toLocaleString(undefined, { maximumFractionDigits: 2 })} XEC`;
    }
  };
}

export const sdk = new EcashFlipstarterSdk();
export type EcashFlipstarterSdkType = EcashFlipstarterSdk;
