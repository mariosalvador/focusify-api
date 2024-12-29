import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

export const Login = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post("/auth/login", {
    schema: {
      body: z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    },
  }, async (request, reply) => {
    const { email, password } = request.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }

    if (user.password !== password) {
      return reply.status(401).send({ message: "Invalid password" });
    }
    const { password:_, ...userWithoutPassword } = user;

    return reply.send({
      message: "Login successful",
      user: userWithoutPassword
    });
  });
};