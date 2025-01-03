import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import fastifyCors from "@fastify/cors";

//Auth Routes
import { Login } from "./routes/auth/login";

//User Routes
import { CreateUser } from "./routes/User/createUser";
import { GetUser } from "./routes/User/getUser";

//Goals Routes
import { CreateGoals } from "./routes/Goal/createGoals";
import { GoalsByUserId } from "./routes/Goal/getGoalsByUserId";

//SubTask Routes
import { CreateSubTask } from "./routes/SubTask/createSubTask";

//Feedback Routes
import { createFeedback } from "./routes/Feedback/createFeedback";
import { GetAllFeedbacks } from "./routes/Feedback/getAllFeedbacks";
import { DeleteAllFeedbacks } from "./routes/Feedback/deleteAll-feedbacks";



const port = Number(process.env.PORT) || 3500;
const server = fastify({
  logger: true,
});


server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(fastifyCors, {
  origin: "*",
});

//Auth routes
server.register(Login);

// User routes
server.register(CreateUser);
server.register(GetUser);

// Goals routes
server.register(CreateGoals);
server.register(GoalsByUserId);

//SubTasks  routes
server.register(CreateSubTask);

//Feedback routes
server.register(createFeedback);
server.register(GetAllFeedbacks);
server.register(DeleteAllFeedbacks);

server.listen({ port: port , host: "0.0.0.0"}, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});