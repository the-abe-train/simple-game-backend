import { FastifyInstance, FastifyPluginAsync, FastifySchema } from "fastify";
import { Player } from "../entities/Player";
import bcrypt from "bcryptjs";
import { authenticate } from "../authorization/authentication";
import { getConnection } from "typeorm";
import { nodeEnv } from "../env";
const { genSalt, hash } = bcrypt;

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

export const registerRouter: FastifyPluginAsync<{ prefix: string }> =
  async function router(server: FastifyInstance) {
    server.post<{ Body: IBody }>(
      "/player",
      { schema },
      async (request, reply) => {
        try {
          const { username, password } = request.body;

          // Hash password with salt
          const salt = await genSalt(10);
          const hashedPassword = await hash(password, salt);

          // Find connection
          const connection = getConnection(nodeEnv);
          Player.useConnection(connection);

          // Create user
          const player = Player.create({
            username,
            password: hashedPassword,
          });
          await player.save();

          // Log-in right after registration
          if (player) await authenticate(player, request, reply);

          reply.code(201);
          reply.send({
            message: "Player registered",
            playerId: player.id,
          });
        } catch (e) {

          // Throw unique error if player already exists
          if (e.driverError.code === "23505") {
            const { username } = request.body;
            reply.code(409);
            reply.send({
              message: `Player with username ${username} already exists`,
              error: e,
            })
          } else {
            reply.code(500);
            reply.send({
              message: "Database error",
              error: e,
            });
          }
          console.error(e);
        }
      }
    );
  };
