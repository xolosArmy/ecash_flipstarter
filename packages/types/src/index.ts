export type Network = 'mainnet' | 'testnet' | 'chipnet';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  ownerAddress: string;
  goalSatoshis: number;
  pledgedSatoshis: number;
  expiresAt: Date;
  createdAt: Date;
  network: Network;
  nftTokenId?: string;
}

export interface Pledge {
  id: string;
  campaignId: Campaign['id'];
  pledgerAddress: string;
  amountSatoshis: number;
  txId?: string;
  status: 'pending' | 'broadcast' | 'confirmed' | 'failed';
  createdAt: Date;
}

export interface TransactionStatus {
  txId: string;
  status: Pledge['status'];
  confirmations: number;
}

export interface CashScriptArtifact {
  abi: Array<unknown>;
  bytecode: string;
  source: string;
  compiler: string;
}
