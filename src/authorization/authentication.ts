import { FastifyReply, FastifyRequest } from "fastify";
import { Player } from "../entities/Player";
import { createSession } from "./session";
import { refreshTokens } from "./tokens";
import jwt from "jsonwebtoken";
import { jwtSignature, nodeEnv } from "../env";
import { Session } from "../entities/Session";
import { getConnection } from "typeorm";

export const authenticate = async (
  player: Player,
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const header = request.headers["user-agent"];

    if (!header) throw "No header";

    const connectionInformation = {
      ip: request.ip,
      userAgent: header,
    };

    // Create session token and add it to database
    const sessionToken = await createSession(player, connectionInformation);

    // Refresh tokens
    await refreshTokens(sessionToken, player.id, reply);

    return;
  } catch (e) {
    throw e;
  }
};

export const deauthenticate = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    if (request?.cookies?.refreshToken) {
      // Get and decode refresh token
      const { refreshToken } = request.cookies;
      const decodedToken = jwt.verify(refreshToken, jwtSignature);
      if (typeof decodedToken === "string") {
        throw "decoded access token wrong type";
      }
      const { sessionToken } = decodedToken;

      // Find connection
      const connection = getConnection(nodeEnv);
      Session.useConnection(connection);
      
      // Delete database record for session
      await Session.delete({ session_token: sessionToken });
    }

    // remove cookies
    reply.clearCookie("refreshToken").clearCookie("accessToken");
  } catch (e) {
    console.error(e);
  }
};
