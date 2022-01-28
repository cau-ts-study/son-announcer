import express from "express";
import dotenv from "dotenv";
import morgan from 'morgan';

import updateRoutes from "../src/Telegram/updateRoutes";


// envs
dotenv.config();
const { PORT, BOT_TOKEN } = process.env;
const URI: string = `/webhook/${BOT_TOKEN}`;

// express
const app = express();


// middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use(morgan('dev'));


// Routes.
app.use(URI, updateRoutes);


// export
export default app;
