import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";


export const CreateUser = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post("/user/create", {
    schema: {
      body: z.object({
        name: z.string().min(10, { message: "Name must be at least 10 characters long" }),
        email: z.string().email(),
        password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
        phone_number: z.string(),
      })
    },
  },
    async (request, reply) => {
      const { name, email, password, phone_number } = request.body;

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password,
          phone_number,
        },
      });

      console.log(user);

      return reply.send({message: "User created successfully", user});
    });
}