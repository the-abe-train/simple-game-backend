import { FastifyInstance, FastifyPluginAsync, FastifySchema } from "fastify";
import { Player } from "../entities/Player";
import { compare } from "bcryptjs";
import { logIn } from "../authentication/logIn";

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
      "/authorize",
      { schema },
      async (request, reply) => {
        try {
          const { username, password } = request.body;

          // Authorize user
          const player = await Player.findOne({ username });
          if (player) {
            const savedPassword = player.password;
            const isAuthorized = await compare(password, savedPassword);
            if (isAuthorized) {
              await logIn(player, request, reply);
              return reply.send({
                data: {
                  status: "AUTHORIZATION SUCCESSFUL",
                  player
                },
              });
            }
          }
          return reply.send({
            data: {
              status: "AUTHORIZATION FAILED",
              player,
            },
          });
        } catch (error) {
          console.error(error);
          reply.code(500);
          return reply.send({
            status: "Database error",
            error,
          });
        }
      }
    );
  };
