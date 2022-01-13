import { randomBytes } from "crypto";
import { Player } from "../entities/Player";
import { Session } from "../entities/Session";
import { jwtSignature, nodeEnv } from "../env";
import jwt from "jsonwebtoken";
import { FastifyReply, FastifyRequest } from "fastify";
import { refreshTokens } from "./tokens";
import { getConnection } from "typeorm";

interface IConnection {
  ip: string;
  userAgent: string;
}

export const createSession = async (player: Player, headers: IConnection) => {
  // Generate a session token
  const sessionToken = randomBytes(43).toString("hex");

  // Retrieve connection information
  const { ip, userAgent } = headers;

  // Find connection
  const connection = getConnection(nodeEnv);
  Session.useConnection(connection);

  // Database insert for session
  const session = Session.create({
    player,
    session_token: sessionToken,
    valid: true,
    user_agent: userAgent,
    ip,
  });
  await session.save();

  return sessionToken;
};

export const affirmSession = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<string> => {
  // Scenario 1: Access token exists
  if (request?.cookies?.accessToken) {
    const { accessToken } = request.cookies;
    const decodedToken = jwt.verify(accessToken, jwtSignature);
    if (typeof decodedToken === "string") throw "error"; // Type narrowing
    const { playerId } = decodedToken;
    return playerId;
  }

  // Scenario 2: Refresh token exists and is valid
  if (request?.cookies?.refreshToken) {
    const { refreshToken } = request.cookies;
    const decodedToken = jwt.verify(refreshToken, jwtSignature);
    if (typeof decodedToken === "string") throw "error"; // Type narrowing
    const { sessionToken } = decodedToken;
    const currentSession = await Session.findOne({
      session_token: sessionToken,
    });
    // If session is valid, refresh tokens
    if (currentSession?.valid) {
      const playerId = currentSession.player.id;
      await refreshTokens(sessionToken, playerId, reply);
      return playerId;
    }
  }

  // Scenario 3: Refresh token is not valid or does not exist
  throw "Refresh token is not valid or does not exist";
};
