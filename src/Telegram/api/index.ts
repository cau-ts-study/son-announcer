import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

const { BOT_TOKEN } = process.env;

const TelegramAPI = axios.create({
    baseURL: `https://api.telegram.org/bot${BOT_TOKEN}/`
});

TelegramAPI.defaults.timeout = 5000;
TelegramAPI.defaults.headers.common['content-type'] = 'application/x-www-form-urlencoded';


export default TelegramAPI;