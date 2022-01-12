import { FastifyInstance, FastifyPluginAsync, FastifySchema } from "fastify";
import { Player } from "../entities/Player";
import { affirmSession } from "../authorization/session";

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
        const newScore = request.body.score;
        const playerId = await affirmSession(request, reply);
        await Player.update(playerId, { high_score: newScore });
        reply.send({
          message: "Score updated",
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
