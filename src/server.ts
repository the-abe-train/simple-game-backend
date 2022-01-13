import fastify, { FastifyInstance } from "fastify";
import fastifyCookie from "fastify-cookie";
import fastifyStatic from "fastify-static";
import path from "path";

import { cookieSignature, port } from "./env";
import { authorizeRouter } from "./routes/logIn";
import { logOutRouter } from "./routes/logOut";
import { registerRouter } from "./routes/register";
import { testRouter } from "./routes/testRoute";
import { scoreUpdateRouter } from "./routes/updateScore";

// Declare server

export const startServer = async (): Promise<FastifyInstance> => {
  // Declare server
  const server: FastifyInstance = fastify({});

  // Middleware
  server.register(fastifyStatic, {
    root: path.join(__dirname, "public"),
    prefix: "/public/",
  });
  server.register(fastifyCookie, { secret: cookieSignature });

  // Routes
  server.get("/", async (request, reply) => {
    return reply.sendFile("index.html");
  });
  server.register(registerRouter, { prefix: "/api" });
  server.register(authorizeRouter, { prefix: "/api" });
  server.register(logOutRouter, { prefix: "/api" });
  server.register(scoreUpdateRouter, { prefix: "/api" });
  server.register(testRouter);

  // Start server
  await server.listen(port);
  console.log(`Server listening on port ${port}`);

  return server;
};
