import Link from 'next/link';
import { AddressField, Button, MoneyInputXec, TxStatus } from '@ecash-flipstarter/ui';
import { CampaignCard } from '../components/campaign-card';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 p-8">
      <section className="rounded-3xl bg-zinc-900/80 p-10 shadow-lg ring-1 ring-white/10">
        <h1 className="text-4xl font-bold text-white md:text-6xl">Crowdfunding on eCash (XEC)</h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-300">
          Empower builders in the eCash ecosystem with transparent, contract-backed crowdfunding. Create campaigns,
          track pledges, and follow on-chain settlement in real time.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button asChild>
            <Link href="/campaigns/new">Launch a campaign</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/learn">How it works</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <CampaignCard
          id="demo"
          title="Flipstarter for eCash Builders"
          goalSatoshis={5_000_000}
          pledgedSatoshis={1_250_000}
          expiresAt={new Date(Date.now() + 1000 * 60 * 60 * 24 * 10)}
        />
        <article className="space-y-4 rounded-3xl bg-zinc-900/60 p-6 ring-1 ring-white/10">
          <h2 className="text-2xl font-semibold text-white">Quick pledge</h2>
          <MoneyInputXec label="Amount" placeholder="1000" />
          <AddressField label="Your eCash address" placeholder="ecash:q..." />
          <TxStatus status="idle" />
          <Button className="w-full">Pledge with eCash</Button>
        </article>
      </section>

      <section className="rounded-3xl bg-zinc-900/80 p-8 text-sm text-zinc-400">
        <p>
          Campaign settlement leverages CashScript contracts inspired by CashStarter to issue campaign NFTs and manage
          pledge flows. Integrate programmatically via our SDK and Fastify API.
        </p>
      </section>
    </main>
  );
}
