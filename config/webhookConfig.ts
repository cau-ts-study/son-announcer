import axios from "axios";
import dotenv from "dotenv";

import { ProcessEnv } from "./globalInterfaces";

dotenv.config();

const { NGROK_URL, BOT_TOKEN } = process.env as ProcessEnv;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

const URI = `/webhook/${BOT_TOKEN}`;
const WEBHOOK_URL: string = NGROK_URL + URI;

export const webHookInit = async () => {
  const params = {
    url: WEBHOOK_URL,
  };
  try {
    const res = await axios.get(`${TELEGRAM_API}/setWebhook`, { params });
    console.log("Webhook status: ", res.data);
  } catch (err) {
    console.error(err);
  }
};
