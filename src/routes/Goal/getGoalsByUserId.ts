import { FastifyInstance } from 'fastify';
import z from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { prisma } from '../../lib/prisma';


export const GoalsByUserId = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get("/goal/getByUserId/:userId", {
    schema: {
      params: z.object({
        userId: z.string().cuid(),
      }),
    },
  }, async (request, reply) => {
    const { userId } = request.params;

    const goals = await prisma.goal.findMany({
      where: {
        userId,
      },
    });

    if (!goals) {
      return reply.status(404).send({ message: "Goals not found" });
    }

    return reply.send(goals);
  });
};