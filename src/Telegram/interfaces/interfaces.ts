import { RowDataPacket } from "mysql2";

// interfaces
export interface sendPhotoAPIParams {
  chat_id: number;
  photo: string;
  caption?: string;
  parseMode?: string;
}

export interface sendMessageAPIParams {
  chat_id: number;
  text: string;
  parseMode?: string;
}

export interface ChatRowDataPacket extends RowDataPacket {
  chat_id: number;
}

// enums
export enum Commands {
  Start = "/start",
  Exit = "/exit",
  GetAll = "/getall",
  Check = "/check",
}

export enum FootballEvents {
  SINGLE,
  DUOBLE,
  TRIPLE,
  QUADRUPLE,
  QUINTUPLE,
}
