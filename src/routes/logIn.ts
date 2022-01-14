import { FastifyInstance, FastifyPluginAsync, FastifySchema } from "fastify";
import { Player } from "../entities/Player";
import { compare } from "bcryptjs";
import { authenticate } from "../authorization/authentication";
import { getConnection } from "typeorm";
import { nodeEnv } from "../env";

// 2 types of type checking required: Typescript and schema
interface IBody {
  username: string;
  password: string;
}

const schema: FastifySchema = {
  body: {
    type: "object",
    properties: {
      username: { type: "string" },
      password: { type: "string" },
    },
  },
};

export const authorizeRouter: FastifyPluginAsync<{ prefix: string }> =
  async function router(server: FastifyInstance) {
    server.post<{ Body: IBody }>(
      "/authorization",
      { schema },
      async (request, reply) => {
        try {
          // Find connection
          const connection = getConnection(nodeEnv);
          Player.useConnection(connection);

          // Authorize user
          const { username, password } = request.body;
          const player = await Player.findOne({ username });
          if (player) {
            const savedPassword = player.password;
            const isAuthorized = await compare(password, savedPassword);
            if (isAuthorized) {
              await authenticate(player, request, reply);
              reply.send({
                message: "Player logged in",
                playerId: player.id,
              });
            }
          } else {
            throw "Player not found";
          }
        } catch (e) {
          reply.code(500);
          reply.send({
            status: "Database error",
            error: e,
          });
          console.error(e);
        }
      }
    );
  };
