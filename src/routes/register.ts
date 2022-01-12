import { FastifyInstance, FastifyPluginAsync, FastifySchema } from "fastify";
import { Player } from "../entities/Player";
import bcrypt from "bcryptjs";
import { authenticate } from "../authorization/authentication";
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
      "/register",
      { schema },
      async (request, reply) => {
        try {
          const { username, password } = request.body;

          // Hash password with salt
          const salt = await genSalt(10);
          const hashedPassword = await hash(password, salt);

          // Create user
          const player = Player.create({
            username,
            password: hashedPassword,
          });
          await player.save();

          // Log-in right after registration
          if (player) await authenticate(player, request, reply);

          reply.send({
            message: "Player registered",
            playerId: player.id,
          });
        } catch (e) {
          console.error(e);
          reply.code(500);
          reply.send({
            status: "Database error",
            error: e,
          });
        }
      }
    );
  };
