import { connectDb } from "../database";
import { host, nodeEnv, port } from "../env";
import { startServer } from "../server";
import { Connection } from "typeorm";
import axios from "axios";
import { FastifyInstance } from "fastify";

describe("Database and route tests", () => {
  let connection: Connection, server: FastifyInstance;

  const domain = host === "localhost" ? `${host}:${port}` : host;
  const protocol = host === "localhost" ? "http://" : "https://";

  const testUser = {
    username: "octopus",
    password: "elephant",
  };

  const testHighScore = {
    score: 100
  }

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
    const url = protocol + domain + "/api/register";
    const response = await axios.post(url, testUser);
    expect(response.status).toBe(200);
    expect(response.data.message).toBe("Player registered");
  });

  it("should log a player out", async () => {
    const url = protocol + domain + "/api/logout";
    const response = await axios.post(url, {});
    expect(response.status).toBe(200);
    expect(response.data.message).toBe("Player logged out");
  });

  it("should log a player back in", async () => {
    const url = protocol + domain + "/api/authorize";
    const response = await axios.post(url, testUser);
    console.log(response.headers);
    expect(response.status).toBe(200);
    expect(response.data.message).toBe("Player logged in");
  });

  it("should update a player's high score", async () => {
    const url = protocol + domain + "/api/score/update";
    try {

      // TODO finish this test
      // Get session from database for test player to make this request

      const response = await axios.put(url, testHighScore);
      expect(response.status).toBe(200);
      expect(response.data.message).toBe("Player's high score updated");
      
    } catch (e) {
      
      // console.error(e);
      throw e
    }
  });
});
