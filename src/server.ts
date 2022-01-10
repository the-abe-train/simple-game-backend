import Fastify, { FastifyInstance } from "fastify";
import fastifyStatic from "fastify-static";
import path from "path";
import { registerUser } from "./accounts/register";
import { port } from "./env";

const server: FastifyInstance = Fastify({});

server.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
  prefix: "/public/", // optional: default '/'
});

server.get("/", async (request, reply) => {
  return reply.sendFile("index.html");
});

server.post<{ Body: Record<"name" | "password", string> }>(
  "/api/register",
  async (request, reply) => {
    try {
      console.log(request.body.name);
      console.log(request.body.password);

      const userId = await registerUser(
        request.body.name,
        request.body.password
      );

      return reply.send(userId);

      // if (userId) {
      //   await logUserIn(userId, request, reply);
      // }
      // reply.send({
      //   data: {
      //     status: "SUCCESS",
      //     userId,
      //   },
      // });
    } catch (error) {
      console.error(error);
      return reply.send({
        data: {
          status: "FAILED",
        },
      });
    }
  }
);

server.post("/api/logout", async (request, reply) => {
  return { msg: "endpoint hit!" };
});

server.post("/api/authorize", async (request, reply) => {
  return { msg: "endpoint hit!" };
});

const start = async () => {
  try {
    await server.listen(port);
    console.log(`Server listening on port ${port}`);

    // const address = server.server.address();
    // const port = typeof address === "string" ? address : address?.port;
  } catch (err) {
    server.log.error(err);
    console.error(err);
    process.exitCode = 1;
  }
};
start();
