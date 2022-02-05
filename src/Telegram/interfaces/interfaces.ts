import { RowDataPacket } from "mysql2";

// interfaces
export interface sendPhotoAPIParams {
  chatId: number;
  photo: string;
  caption?: string;
  parseMode?: string;
}

export interface sendMessageAPIParams {
  chatId: number;
  text: string;
  parseMode?: string;
}

export interface EventParams {
  [type: string]: {
    url?: string;
    content: string;
  };
}

export interface ChatRowDataPacket extends RowDataPacket {
  chat_id: number;
}

// enums
export enum Commands {
  Start = "/start",
  Exit = "/exit",
  GetAll = "/getall",
}

export enum FootballEvents {
  SINGLE,
  DUOBLE,
  TRIPLE,
  QUADRUPLE,
  QUINTUPLE,
}
