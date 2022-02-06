import dotenv from "dotenv";

import app from "./config/express";
import { webHookInit } from "./config/webhookConfig";
import { ProcessEnv } from "./config/globalInterfaces";

dotenv.config();

const { PORT } = process.env as ProcessEnv;

// Server Init
app.listen(PORT, () => {
  void (async () => {
    await webHookInit();
  })();
  console.log(`Express server listening on PORT: ${PORT} ... 🚀`);
});
