import { randomBytes } from "crypto";
import { Player } from "../entities/Player";
import { Session } from "../entities/Session";

interface Connection {
  ip: string;
  userAgent: string;
}

export async function createSession(player: Player, connection: Connection) {
  try {
    // generate a session token
    const sessionToken = randomBytes(43).toString("hex");

    // retrieve connection information
    const { ip, userAgent } = connection;

    // database insert for session
    
    const session = Session.create({
      player,
      session_token: sessionToken,
      valid: true,
      user_agent: userAgent,
      ip
    });
    await session.save();

    return sessionToken;
  } catch (error) {
    throw new Error("session creation failed");
  }
}
