import { FastifyReply, FastifyRequest } from "fastify";
import { Player } from "../entities/Player";
import { createSession } from "./session";
import { refreshTokens } from "./tokens";

export const logIn = async (
  player: Player,
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void>  => {
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
