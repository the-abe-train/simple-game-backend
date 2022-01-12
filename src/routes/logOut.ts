import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { deauthenticate } from "../authorization/authentication";

export const logOutRouter: FastifyPluginAsync<{ prefix: string }> = async (
  server: FastifyInstance
) => {
  server.post("/logout", async (request, reply) => {
    try {
      await deauthenticate(request, reply);
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
