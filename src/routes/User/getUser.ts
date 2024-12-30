import { FastifyInstance } from "fastify";
import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";

export const GetUser = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get("/user/:id", {
    schema: {
      params: z.object({
        id: z.string().cuid(),
      }),
    },
  }, async (request, reply) => {
    const { id } = request.params;

    const user = await prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }
    const { password: _, ...userWithoutPassword } = user;

    return reply.send({user: userWithoutPassword});
  });
};