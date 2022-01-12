import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { logOut } from "../authentication/logOut";

export const logOutRouter: FastifyPluginAsync<{ prefix: string }> = async (
  server: FastifyInstance
) => {
  server.post("/logout", async (request, reply) => {
    try {
      await logOut(request, reply);
      reply.send({
        message: "User logged out",
      });
    } catch (e) {
      reply.code(500);
      reply.send({
        status: "Database error",
        error: e,
      });
      console.error(e);
    }
  });
};
