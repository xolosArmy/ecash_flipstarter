import { z } from 'zod';
import type { Campaign } from '@ecash-flipstarter/types';

export const envSchema = z.object({
  API_PORT: z.coerce.number().int().positive().optional(),
  API_HOST: z.string().optional(),
  CHRONIK_URL: z.string().url().optional(),
  NETWORK: z.enum(['mainnet', 'testnet', 'chipnet']).default('chipnet')
});

type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse(process.env);

export const campaignSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  ownerAddress: z.string(),
  goalSatoshis: z.number().int().nonnegative(),
  pledgedSatoshis: z.number().int().nonnegative(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  network: z.enum(['mainnet', 'testnet', 'chipnet']),
  nftTokenId: z.string().optional()
});

export const campaignsSchema = z.array(campaignSchema satisfies z.ZodType<Campaign>);

export const pledgeSchema = z.object({
  id: z.string(),
  campaignId: z.string(),
  pledgerAddress: z.string(),
  amountSatoshis: z.number().int().positive(),
  txId: z.string().optional(),
  status: z.enum(['pending', 'broadcast', 'confirmed', 'failed']),
  createdAt: z.coerce.date()
});

export const pledgesSchema = z.array(pledgeSchema);

export const constants = {
  minimumPledgeSatoshis: 10_000,
  defaultNetwork: env.NETWORK
} as const;
