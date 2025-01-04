import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";

export const DeleteAllFeedbacks = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().delete("/feedback/deleteAll", async (request, reply) => {
    const feedbacks = await prisma.feedback.deleteMany();

    if (!feedbacks) {
      return reply.status(404).send({ message: "Feedbacks not found" });
    }

    return reply.send(feedbacks);
  });
}