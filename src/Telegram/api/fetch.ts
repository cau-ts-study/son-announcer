import TelegramAPI from ".";
import {
  sendMessageAPIParams,
  sendPhotoAPIParams,
} from "../interfaces/interfaces";

const exitChat = async (chatId: number) => {
  const params = {
    chat_id: chatId,
  };

  try {
    const res = await TelegramAPI.get("/leaveChat", { params });
    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
};

const sendPhoto = async (params: sendPhotoAPIParams) => {
  // const params = {
  //   chat_id: chatId,
  //   photo: events.url,
  //   caption: events.content,
  // };
  try {
    const res = await TelegramAPI.get("/sendPhoto", { params });
    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
};

const sendMessage = async (params: sendMessageAPIParams) => {
  // const params = {
  //   chat_id: chatId,
  //   text: event.content,
  // };
  try {
    const res = await TelegramAPI.get("/sendMessage", { params });
    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
};

export { exitChat, sendPhoto, sendMessage };
