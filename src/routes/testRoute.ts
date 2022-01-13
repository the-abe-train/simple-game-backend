import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { jwtSignature } from "../env";
import jwt from "jsonwebtoken";
import { Player } from "../entities/Player";
import { Session } from "../entities/Session";
import { refreshTokens } from "../authorization/tokens";

async function getUserFromCookies(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {

    // Scenario 1: Access token exists
    if (request?.cookies?.accessToken) {
      const { accessToken } = request.cookies;
      const decodedToken = jwt.verify(accessToken, jwtSignature);
      if (typeof decodedToken === "string") throw "error"  // Type narrowing
      return Player.findOne({ id: decodedToken.playerId });
    }

    // Scenario 2: If there is no access token, use the refresh token
    if (request?.cookies?.refreshToken) {
      const { refreshToken } = request.cookies;
      const decodedToken = jwt.verify(refreshToken, jwtSignature);
      if (typeof decodedToken === "string") throw "error"  // Type narrowing
      const { sessionToken } = decodedToken;
      const currentSession = await Session.findOne({
        session_token: sessionToken,
      });

      // If session is valid, look up current user
      if (currentSession?.valid) {
        const currentUser = await Player.findOne({
          id: currentSession.player.id,
        });

        // Refresh tokens, return current user
        if (currentUser) {
          await refreshTokens(sessionToken, currentUser.id, reply);
          return currentUser;
        }
      }
    }
  } catch (error) {
    return console.error(error);
  }
}

export const testRouter: FastifyPluginAsync<{ prefix: string }> =
  async function router(server: FastifyInstance) {
    server.get("/test", async (request, reply) => {
      try {
        const user = await getUserFromCookies(request, reply);

        // return user email if it exists, otherwise return unquthorized
        if (user?.id) {
          reply.send({ data: user });
        } else {
          reply.send({ data: "user lookup failed" });
        }
      } catch (error) {
        console.error(error);
      }

      reply.send({ data: "hello world" });
    });
  };
