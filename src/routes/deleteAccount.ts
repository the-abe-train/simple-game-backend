import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { deleteAccount } from "../authorization/authentication";

export const deleteAccountRouter: FastifyPluginAsync<{
  prefix: string;
}> = async (server: FastifyInstance) => {
  server.delete("/player", async (request, reply) => {
    try {
      await deleteAccount(request, reply);
      reply.send({
        message: "Player deleted",
      });
    } catch (e) {
      if (e?.message === "jwt must be provided") {
        reply.code(500);
        reply.send({
          status: "Account cannot be deleted if player is not logged in",
          error: e,
        });
      }
      reply.code(500);
      reply.send({
        status: "Database error",
        error: e,
      });
      console.error(e);
    }
  });
};
