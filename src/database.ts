import { Connection, createConnection } from "typeorm";

export async function connectDb(nodeEnv: string): Promise<Connection> {
  try {
    const connection = await createConnection(nodeEnv);
    console.log(`Connected to ${nodeEnv} database!`);
    return connection;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
