import { FastifyReply, FastifyRequest } from "fastify";
import { Player } from "../entities/Player";
import { createSession } from "./session";
import { refreshTokens } from "./tokens";

export async function logIn(
  player: Player,
  request: FastifyRequest,
  reply: FastifyReply
) {
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

    return reply;
  } catch (e) {
    throw e;
  }
}
