import { cn } from '../utils';
import type { TransactionStatus } from '@ecash-flipstarter/types';

export interface TxStatusProps {
  status: TransactionStatus['status'] | 'idle';
  txId?: string;
}

const STATUS_TEXT: Record<TxStatusProps['status'], string> = {
  idle: 'Awaiting pledge details',
  pending: 'Pending broadcast',
  broadcast: 'Broadcast to the network',
  confirmed: 'Confirmed on-chain',
  failed: 'Transaction failed'
};

export function TxStatus({ status, txId }: TxStatusProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/70">
      <p className="font-medium text-white">{STATUS_TEXT[status]}</p>
      {txId && (
        <p className={cn('truncate text-xs text-white/50', status === 'failed' && 'text-red-400')}>
          txid: {txId}
        </p>
      )}
    </div>
  );
}
