import fastify, { FastifyInstance } from "fastify";
import fastifyCookie from "fastify-cookie";
import fastifyStatic from "fastify-static";
import path from "path";

import { createConnection } from "typeorm";
import { Player } from "./entities/Player";
import { Session } from "./entities/Session";

import { cookieSignature, dbUrl, port } from "./env";
import { authorizeRouter } from "./routes/authorize";
import { logOutRouter } from "./routes/logOut";
import { registerRouter } from "./routes/register";
import { testRouter } from "./routes/test";
import { scoreUpdateRouter } from "./routes/updateScore";

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


// Database
async function connectDb(): Promise<void> {
  await createConnection({
    type: "postgres",
    entities: [Player, Session],
    synchronize: true,
    url: dbUrl,
    ssl: { rejectUnauthorized: false },
  });
  return console.log("Connected to database!");
}

(async () => {
  try {
    await connectDb();
    await server.listen(port);
    console.log(`Server listening on port ${port}`);
  } catch (err) {
    server.log.error(err);
    console.error(err);
    process.exitCode = 1;
  }
})();
