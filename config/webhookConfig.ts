import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const { NGROK_URL, PORT, BOT_TOKEN } = process.env;
const TELEGRAM_API: string = `https://api.telegram.org/bot${BOT_TOKEN}`;

const URI: string = `/webhook/${BOT_TOKEN}`;
const WEBHOOK_URL: string = NGROK_URL + URI;


export const webHookInit = async () => {
    const params = {
        url: WEBHOOK_URL,
    };
    const res = await axios.get(`${TELEGRAM_API}/setWebhook`, { params });
    console.log("Webhook status: ", res.data);
};

