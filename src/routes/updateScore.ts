import { FastifyInstance, FastifyPluginAsync, FastifySchema } from "fastify";
import { Player } from "../entities/Player";
import { affirmSession } from "../authentication/session";
import { Score } from "../entities/Score";

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
        const playerId = await affirmSession(request, reply);

        const player = await Player.findOne(playerId);
        const newScore = request.body.score;

        if (player) {
          const score = Score.create({
            username: player.username,
            score: newScore,
          });
          score.save();
        }

        reply.send({
          message: "Score updated",
          playerId,
          score: newScore,
        });
      } catch (e) {
        reply.code(500);
        reply.send({
          message: "Database error",
          error: e
        });
        console.error(e);
      }
    }
  );
};
