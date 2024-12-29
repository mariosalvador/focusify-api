import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

export const CreateGoals = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post("/goal/create", {
    schema: {
      body: z.object({
        title: z.string().min(10, { message: "Title must be at least 10 characters long" }),
        startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
          message: "Invalid date format",
        }).transform((val) => new Date(val)),
        endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
          message: "Invalid date format",
        }).transform((val) => new Date(val)),
        status: z.enum(["PENDING", "COMPLETED", "CANCELED"]),
        userId: z.string().cuid(),
        subTasks: z.array(z.object({
          title: z.string().min(10, { message: "Title must be at least 10 characters long" }),
          startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
          }).transform((val) => new Date(val)),
          endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
          }).transform((val) => new Date(val)),
          status: z.enum(["PENDING", "COMPLETED", "CANCELED"]),
        })),
      }).refine((data) => data.startDate < data.endDate, {
        message: "Start date must be before end date",
        path: ["startDate"],
      })
    },
  }, async (request, reply) => {
    const { title, startDate, endDate, status, userId, subTasks } = request.body;

    const goal = await prisma.goal.create({
      data: {
        title,
        startDate,
        endDate,
        status,
        user: {
          connect: { id: userId },
        },
        subTasks: {
          create: subTasks.map((subTask) => ({ ...subTask })),
        },
      },
    });

    return reply.send({
      message: "Goal created successfully",
      goal: {
        id: goal.id,
        title: goal.title,
        startDate: goal.startDate,
        endDate: goal.endDate,
        status: goal.status,
      },

    });
  });
};
