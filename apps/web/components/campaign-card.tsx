'use client';

import { useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ProgressBar } from '@ecash-flipstarter/ui';
import type { Campaign } from '@ecash-flipstarter/types';

export interface CampaignCardProps extends Pick<Campaign, 'id' | 'title' | 'goalSatoshis' | 'pledgedSatoshis' | 'expiresAt'> {}

export function CampaignCard({ id, title, goalSatoshis, pledgedSatoshis, expiresAt }: CampaignCardProps) {
  const progress = Math.min(pledgedSatoshis / goalSatoshis, 1);
  const timeRemaining = useMemo(() => formatDistanceToNow(expiresAt, { addSuffix: true }), [expiresAt]);

  return (
    <article
      data-campaign-id={id}
      className="flex flex-col gap-4 rounded-3xl bg-zinc-900/60 p-6 text-white ring-1 ring-white/10"
    >
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-sm text-zinc-400">Ends {timeRemaining}</p>
      </header>
      <ProgressBar progress={progress} />
      <dl className="grid grid-cols-2 gap-2 text-sm text-zinc-300">
        <div>
          <dt className="text-xs uppercase tracking-wide text-zinc-500">Raised</dt>
          <dd>{(pledgedSatoshis / 100).toLocaleString()} XEC</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-zinc-500">Goal</dt>
          <dd>{(goalSatoshis / 100).toLocaleString()} XEC</dd>
        </div>
      </dl>
    </article>
  );
}
