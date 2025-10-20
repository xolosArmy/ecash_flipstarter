import { z } from 'zod';

export type Network = 'mainnet' | 'testnet';

export const networkSchema = z.enum(['mainnet', 'testnet']);

export const envSchema = z.object({
  NETWORK: networkSchema,
  CHRONIK_URL: z.string().url(),
  RPC_URL: z.string().url().optional(),
  EXPLORER_TX_URL: z.string().url(),
  EXPLORER_ADDR_URL: z.string().url()
});

export type Env = z.infer<typeof envSchema>;

export const parseEnv = (input: unknown): Env => envSchema.parse(input);

export const getEnv = (): Env =>
  parseEnv({
    NETWORK: process.env.NETWORK,
    CHRONIK_URL: process.env.CHRONIK_URL,
    RPC_URL: process.env.RPC_URL,
    EXPLORER_TX_URL: process.env.EXPLORER_TX_URL,
    EXPLORER_ADDR_URL: process.env.EXPLORER_ADDR_URL
  });

export const isNetwork = (value: unknown): value is Network =>
  typeof value === 'string' && networkSchema.safeParse(value).success;
