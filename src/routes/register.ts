import { FastifyInstance, FastifyPluginAsync, FastifySchema } from "fastify";
import { Player } from "../entities/Player";
import bcrypt from "bcryptjs";
import { logIn } from "../authentication/logIn";
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
          if (player) logIn(player, request, reply);

          return reply.send({
            data: {
              status: "SUCCESS",
              user: player,
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