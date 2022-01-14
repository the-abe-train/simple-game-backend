import { connectDb } from "../database";
import { host, nodeEnv, port } from "../env";
import { startServer } from "../server";
import { Connection } from "typeorm";
import axios from "axios";
import { FastifyInstance } from "fastify";
import { Session } from "../entities/Session";
import { Player } from "../entities/Player";
import { createTokens } from "../authorization/tokens";

type Response = {
  status: number;
  data: {
    message: string;
    playerId: string;
    playerData: {
      username: string;
      high_score: number;
    };
  };
};

function fail(reason = "fail was called in a test.") {
  throw new Error(reason);
}

// global.fail = fail;

async function getAccessToken(testPlayerId: string) {
  // Get session from database for test player to make this request.
  // This is necessary in test because there is no browser to hold cookies,
  // so we need to get the access token from the session token in the db

  try {
    const testPlayerEntity = await Player.findOne({
      id: testPlayerId,
    });
    const currentSession = await Session.findOne({
      player: testPlayerEntity,
    });
    if (!currentSession) throw "Session not found";
    const sessionToken = currentSession.session_token;

    const { accessToken } = createTokens(sessionToken, testPlayerId);
    return accessToken;
  } catch (e) {
    fail("Player is not signed in");
    return
  }
}

describe("API tests", () => {
  let connection: Connection, server: FastifyInstance;

  const domain = host === "localhost" ? `${host}:${port}` : host;
  const protocol = host === "localhost" ? "http://" : "https://";

  const testPlayer = {
    username: "octopus",
    password: "elephant",
  };
  let testPlayerId: string;

  const testHighScore = 100;

  beforeAll(async () => {
    // Need to start the server so that it can push to the db
    // Need to connect to the database to check that the push worked
    connection = await connectDb(nodeEnv);
    server = await startServer();
  });

  afterAll(async () => {
    await connection.close();
    await server.close();
    console.log("Database and server connections closed.");
  });

  it("should register a new player", async () => {
    try {
      const url = protocol + domain + "/api/player";
      const response: Response = await axios.post(url, testPlayer);
      testPlayerId = response.data.playerId;
      expect(response.status).toBe(201);
      expect(response.data.message).toBe("Player registered");
    } catch (e) {
      fail("Failed to register new player");
      console.error(e);
    }
  });

  it("should log a player out", async () => {
    try {
      const url = protocol + domain + "/api/authorization";
      const response: Response = await axios.delete(url);
      expect(response.status).toBe(200);
      expect(response.data.message).toBe("Player logged out");
    } catch (e) {
      fail("Failed to log the player out");
      console.error(e);
    }
  });

  it("should log a player back in", async () => {
    try {
      const url = protocol + domain + "/api/authorization";
      const response: Response = await axios.post(url, testPlayer);
      expect(response.status).toBe(200);
      expect(response.data.message).toBe("Player logged in");
    } catch (e) {
      fail("Failed to log the player back in");
      console.error(e);
    }
  });

  it("should update a player's high score", async () => {
    try {
      const accessToken = await getAccessToken(testPlayerId);
      const url = protocol + domain + "/api/player/score";
      const response = await axios.put(
        url,
        { score: testHighScore },
        {
          headers: {
            Cookie: `accessToken=${accessToken};`,
          },
        }
      );
      expect(response.status).toBe(200);
      expect(response.data.message).toBe("Player's high score updated");
    } catch (e) {
      fail("Failed to update the player's high score");
      console.error(e);
    }
  });

  it("should get the player's data", async () => {
    const accessToken = await getAccessToken(testPlayerId);
    const url = protocol + domain + "/api/player";
    try {
      const response = await axios.get(url, {
        headers: {
          Cookie: `accessToken=${accessToken};`,
        },
      });
      expect(response.status).toBe(200);
      expect(response.data.message).toBe("Player data fetched");
      expect(response.data.playerData.username).toBe(testPlayer.username);
      expect(response.data.playerData.high_score).toBe(testHighScore);
    } catch (e) {
      fail("Failed to fetch player data");
      console.error(e);
    }
  });

  it("should delete the player's account", async () => {
    try {
      const accessToken = await getAccessToken(testPlayerId);
      const url = protocol + domain + "/api/player";
      const response = await axios.delete(url, {
        headers: {
          Cookie: `accessToken=${accessToken};`,
        },
      });
      expect(response.status).toBe(200);
      expect(response.data.message).toBe("Player deleted");
    } catch (e) {
      fail("Failed to delete the player's account");
      console.error(e);
    }
  });
});
