import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";

import updateRoutes from "../src/Telegram/updateRoutes";
import { ProcessEnv } from "./globalInterfaces";

// envs
dotenv.config();
const { BOT_TOKEN } = process.env as ProcessEnv;
const URI = `/webhook/${BOT_TOKEN}`;

// express
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use(morgan("dev"));

// Routes.
app.use(URI, updateRoutes);

// export
export default app;
