import { FastifyInstance } from 'fastify';
import z from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { prisma } from '../../lib/prisma';


// export const GetGoalsByUserId = async (app: FastifyInstance) => {
//   app.withTypeProvider<ZodTypeProvider>().get("/goal/getByUserId/:userId", {
//     schema: {
//       params: z.object({
//         userId: z.string().cuid(),
//       }),
//     },
//   }, async (request, reply) => {
//     const { userId } = request.params;

//     const goals = await prisma.goal.findFirst({
//       where: {
//         userId,
//       },
//     });   


//     return reply.send(goals);
//   });
// };

export const GoalsByUserId = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get("/goal/all", {
  }, async (request, reply) => {
    const goals = await prisma.goal.findMany();

    return reply.send(goals);
  }
  );
};  
