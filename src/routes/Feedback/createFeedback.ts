import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

export const createFeedback = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post("/feedback/create", {
    schema: {
      body: z.object({
        message: z.string().min(5, { message: "Message must be at least 10 characters long" }),
        userId: z.string().cuid(),
      }),
    },
  }, async (request, reply) => {
    const { message, userId } = request.body;

    const feedback = await prisma.feedback.create({
      data: {
        message,
        userId,
      },
    });

    if (!feedback) {
      return reply.status(404).send({ message: "Feedback not found" });
    }

    return reply.send(feedback);
  });
};