import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CashScriptArtifact } from '@ecash-flipstarter/types';

const modulePath = fileURLToPath(import.meta.url);
const CONTRACTS_ROOT = join(dirname(modulePath), 'contracts');

export type ContractName = 'campaign-nft' | 'pledge';

export async function loadContractSource(name: ContractName): Promise<string> {
  const path = join(CONTRACTS_ROOT, `${name}.cash`);
  return readFile(path, 'utf8');
}

export async function compileContract(name: ContractName): Promise<CashScriptArtifact> {
  const source = await loadContractSource(name);
  const cashscript = await import('cashscript');
  const { compileString } = cashscript as any;
  if (typeof compileString !== 'function') {
    throw new Error('cashscript compileString helper is unavailable');
  }

  const artifact = await compileString(source);
  return artifact as CashScriptArtifact;
}

export async function getCampaignNftArtifact() {
  return compileContract('campaign-nft');
}

export async function getPledgeArtifact() {
  return compileContract('pledge');
}
