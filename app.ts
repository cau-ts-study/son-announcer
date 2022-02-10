import dotenv from "dotenv";

import app from "./config/express";
import { webHookInit } from "./config/webhookConfig";
import { ProcessEnv } from "./config/globalInterfaces";
import Flow from "./src/football-api/Flow";

dotenv.config();

const { PORT } = process.env as ProcessEnv;

// Server Init
app.listen(PORT, () => {
  const flow = new Flow();
  void (async () => {
    await webHookInit();
    flow.start();
  })();
  console.log(`Express server listening on PORT: ${PORT} ... 🚀`);
});
