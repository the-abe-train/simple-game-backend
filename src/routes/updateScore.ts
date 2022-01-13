import { FastifyInstance, FastifyPluginAsync, FastifySchema } from "fastify";
import { Player } from "../entities/Player";
import { affirmSession } from "../authorization/session";
import { getConnection } from "typeorm";
import { nodeEnv } from "../env";

interface IBody {
  score: number;
}

const schema: FastifySchema = {
  body: {
    type: "object",
    properties: {
      score: { type: "number" },
    },
  },
};

export const scoreUpdateRouter: FastifyPluginAsync<{ prefix: string }> = async (
  server: FastifyInstance
) => {
  server.put<{ Body: IBody }>(
    "/score/update",
    { schema },
    async (request, reply) => {
      try {
        // Find connection
        const connection = getConnection(nodeEnv);
        Player.useConnection(connection);

        // Update score
        const newScore = request.body.score;
        const playerId = await affirmSession(request, reply);
        await Player.update(playerId, { high_score: newScore });
        reply.send({
          message: "Player's high score updated",
          playerId,
          score: newScore,
        });
      } catch (e) {
        reply.code(500);
        reply.send({
          message: "Database error",
          error: e,
        });
        console.error(e);
      }
    }
  );
};
