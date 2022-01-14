import { FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { host, jwtSignature } from "../env";

type Tokens = {
  refreshToken: string;
  accessToken: string;
};

export const createTokens = (
  sessionToken: string,
  playerId: string
): Tokens => {
  if (!jwtSignature) throw "No jwt signature in environment variables";

  // Create refresh token (Session id)
  const refreshToken = jwt.sign({ sessionToken }, jwtSignature);

  // create access token (session ID, user ID)
  const accessToken = jwt.sign({ sessionToken, playerId }, jwtSignature);

  // Return refresh token and access token
  return { accessToken, refreshToken };
};

export const refreshTokens = async (
  sessionToken: string,
  playerId: string,
  reply: FastifyReply
): Promise<void> => {
  // Create JWT
  const tokens = createTokens(sessionToken, playerId);

  const { accessToken, refreshToken } = tokens;

  // Set cookie
  const now = new Date();
  const refreshExpires = new Date(now.setDate(now.getDate() + 30));

  reply
    .setCookie("refreshToken", refreshToken, {
      path: "/",
      domain: host,
      httpOnly: true,
      expires: refreshExpires,
      // secure
    })
    .setCookie("accessToken", accessToken, {
      path: "/",
      domain: host,
      httpOnly: true,
      // expires
      // secure
    });
  return;
};
