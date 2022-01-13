import { Player } from "./src/entities/Player";
import { Session } from "./src/entities/Session";
import { dbUrl, dbTestUrl } from "./src/env";

export default [
  {
    name: "development",
    type: "postgres",
    entities: [Player, Session],
    synchronize: false,
    url: dbUrl,
    ssl: { rejectUnauthorized: false },
    logging: true,
    dropSchema: false
  },
  {
    name: "test",
    type: "postgres",
    entities: [Player, Session],
    synchronize: true,
    url: dbTestUrl,
    ssl: { rejectUnauthorized: false },
    logging: false,
    dropSchema: true
  },
];
