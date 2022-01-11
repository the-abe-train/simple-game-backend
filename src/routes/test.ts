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
import { refreshTokens } from "../authentication/tokens";

async function getUserFromCookies(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    if (!jwtSignature) throw "No jwt signature in environment variables";

    // check that access token exists
    if (request?.cookies?.accessToken) {
      // Get the access and refresh tokens
      const { accessToken } = request.cookies;

      // If there is an access token, decode the access token
      const decodedAccessToken = jwt.verify(accessToken, jwtSignature);
      console.log(decodedAccessToken);

      if (typeof decodedAccessToken === "string") {
        throw "decoded access token wrong type";
      }

      // Return user form record
      return Player.findOne({ id: decodedAccessToken.playerId });
    }
    if (request?.cookies?.refreshToken) {
      // If there is no access token, decode the refresh token,
      const { refreshToken } = request.cookies;
      const decodedRefreshToken = jwt.verify(refreshToken, jwtSignature);

      if (typeof decodedRefreshToken === "string") {
        throw "decoded access token wrong type";
      }

      const { sessionToken } = decodedRefreshToken;

      // lookup session

      const currentSession = await Session.findOne({
        session_token: sessionToken,
      });

      // If session is valid, look up current user,
      if (currentSession?.valid) {
        const currentUser = await Player.findOne({
          id: currentSession.player.id,
        });
        if (currentUser) {
          console.log("current user", currentUser);

          // refresh tokens, return current user
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
