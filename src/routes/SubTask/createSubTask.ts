import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

export const CreateSubTask = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post("/subtask/create", {
    schema: {
      body: z.object({
        title: z.string().min(5, { message: "Title must be at least 10 characters long" }),
        startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
          message: "Invalid date format",
        }).transform((val) => new Date(val)),
        endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
          message: "Invalid date format",
        }).transform((val) => new Date(val)),
        status: z.enum(["PENDING", "COMPLETED", "CANCELED"]),
        goalId: z.string().cuid(),
      }).refine((data) => data.startDate < data.endDate, {
        message: "Start date must be before end date",
        path: ["startDate"],
      })
    },
  }, async (request, reply) => {
    const { title, startDate, endDate, status, goalId } = request.body;

    const goalsExists = await prisma.goal.findFirst({
      where: {
        id: goalId,
      },
    });

    if (!goalsExists) {
      return reply.status(404).send({ message: "Goal not found" });
    }

    const subTask = await prisma.subTask.create({
      data: {
        title,
        startDate,
        endDate,
        status,
        goalId,
      },
    });

    return reply.send({message: "SubTask created successfully",subTask});
  });
};