import Fastify from 'fastify';
import healthRoute from './routes/health';
import { env } from '@ecash-flipstarter/config';
import { campaignsRouter } from './routes/campaigns';

async function buildServer() {
  const fastify = Fastify({ logger: true });

  await fastify.register(healthRoute, { prefix: '/api' });
  await fastify.register(campaignsRouter, { prefix: '/api/campaigns' });

  return fastify;
}

async function start() {
  const fastify = await buildServer();
  const port = env.API_PORT ?? 3333;
  const host = env.API_HOST ?? '0.0.0.0';

  try {
    await fastify.listen({ port, host });
    fastify.log.info(`API server listening on http://${host}:${port}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

export { buildServer };
