import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { campaignsSchema } from '@ecash-flipstarter/config';
import { Campaign, Pledge } from '@ecash-flipstarter/types';
import { sdk } from '@ecash-flipstarter/sdk';

const pledgeBodySchema = z.object({
  campaignId: z.string(),
  amountSatoshis: z.number().int().positive(),
  address: z.string()
});

type PledgeBody = z.infer<typeof pledgeBodySchema>;

export const campaignsRouter: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async () => {
    const campaigns = await sdk.campaigns.list();
    return campaignsSchema.parse(campaigns);
  });

  fastify.post<{ Body: PledgeBody }>('/:campaignId/pledges', async (request, reply) => {
    const { campaignId } = request.params as { campaignId: Campaign['id'] };
    const payload = pledgeBodySchema.parse({ ...request.body, campaignId });

    const pledge: Pledge = await sdk.pledges.create(payload);
    return reply.status(201).send(pledge);
  });
};

export default campaignsRouter;
