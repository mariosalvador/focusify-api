import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";

export const GetAllFeedbacks = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get("/feedback/getAll", async (request, reply) => {

    const feedbacks = await prisma.feedback.findMany();

    if (!feedbacks) {
      return reply.status(404).send({ message: "Feedbacks not found" });
    }

    const userData = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      where: {
        id: {
          in: feedbacks.map((feedback) => feedback.userId),
        },
      },
    });

    if (!userData) {
      return reply.status(404).send({ message: "User not found" });
    }

    const feedbacksAndUsersData = feedbacks.map((feedback) => {
      const user = userData.find((user) => user.id === feedback.userId);
      return {
        ...feedback,
        user,
      };
    });

    return reply.send(feedbacksAndUsersData);
  })
};