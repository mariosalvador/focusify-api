import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { verifyPassword } from "../../module/services/bcrypt/verifyPassword";
import { generateToken } from "../../module/services/jwt/generateToken";

export const Login = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/auth/login",
    {
      schema: {
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }

      const isPasswordValid = await verifyPassword(password, user.password);

      if (!isPasswordValid) {
        reply.status(401).send({ message: "Credentials not valid" });
        return;
      }

      const token = await generateToken({
        id_user: user.id,
        email: user.email,
      });

      return reply.send({
        message: "Login successful",
        user: { id: user.id, email: user.email },
        token,
      });
    }
  );
};
