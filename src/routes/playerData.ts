import { FastifyInstance, FastifyPluginAsync, FastifySchema } from "fastify";
import { Player } from "../entities/Player";
import { getConnection } from "typeorm";
import { nodeEnv } from "../env";
import { affirmSession } from "../authorization/session";

export const playerDataRouter: FastifyPluginAsync<{ prefix: string }> =
  async function router(server: FastifyInstance) {
    server.get("/player", async (request, reply) => {
      try {
        const playerId = await affirmSession(request, reply);
        if (!playerId) {
          reply.code(404);
          reply.send({
            message: "Player is not signed in"
          })
        };

        // Find connection
        const connection = getConnection(nodeEnv);
        Player.useConnection(connection);

        const player = await Player.findOne(playerId);
        if (!player) throw "Player not found in database"

        const { id, username, high_score } = player;

        reply.send({
          message: "Player data fetched",
          playerId: id,
          playerData: { username, high_score },
        });
      } catch (e) {
        reply.code(500);
        reply.send({
          message: "Database error",
          error: e,
        });
        console.error(e);
      }
    });
  };
