import { FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { jwtSignature } from "../env";

const createTokens = (sessionToken: string, playerId: string) => {
  try {
    if (!jwtSignature) throw "No jwt signature in environment variables";

    // Create refresh token (Session id)
    const refreshToken = jwt.sign({ sessionToken }, jwtSignature);

    // create access token (session ID, user ID)
    const accessToken = jwt.sign({ sessionToken, playerId }, jwtSignature);

    // Return refresh token and access token
    return { accessToken, refreshToken };
  } catch (error) {
    return console.error(error);
  }
};

export const refreshTokens = async (
  sessionToken: string,
  playerId: string,
  reply: FastifyReply
): Promise<void> => {
  try {
    // Create JWT
    const tokens = createTokens(sessionToken, playerId);

    if (tokens) {
      const { accessToken, refreshToken } = tokens;

      // Set cookie
      const now = new Date();
      const refreshExpires = new Date(now.setDate(now.getDate() + 30));

      reply
        .setCookie("refreshToken", refreshToken, {
          path: "/",
          domain: "localhost",
          // httpOnly: true,
          expires: refreshExpires,
          // secure
        })
        .setCookie("accessToken", accessToken, {
          path: "/",
          domain: "localhost",
          // httpOnly: true,
          // expires
          // secure
        });
        return
    } else {
      throw "tokens not found";
    }
  } catch (e) {
    console.error(e);
  }
};
