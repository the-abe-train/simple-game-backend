import { connectDb } from "./database";
import { nodeEnv } from "./env";
import { startServer } from "./server";

(async () => {
  try {
    const db = await connectDb(nodeEnv);
    // console.log(db);
    
    await startServer();
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  }
})();
