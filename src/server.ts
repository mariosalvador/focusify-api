import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

//User Routes
import { CreateUser } from "./routes/User/createUser";

//Goals Routes
import { CreateGoals } from "./routes/Goal/createGoals";
import { GoalsByUserId } from "./routes/Goal/getGoalsByUserId";



const server = fastify({
  logger: true,
});

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

// User routes
server.register(CreateUser);

// Goals routes
server.register(CreateGoals);
server.register(GoalsByUserId);

server.listen({ port: 3500 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});