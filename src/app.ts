import dotenv from 'dotenv';

import app from "../config/express";
import { webHookInit } from "../config/webhookConfig";


dotenv.config();


// Server Init
app.listen(process.env.PORT, async () => {
    await webHookInit();
    console.log(`Express server listening on PORT: ${process.env.PORT} ... 🚀`);
})

