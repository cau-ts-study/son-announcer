import { RowDataPacket } from "mysql2/typings/mysql/lib/protocol/packets";
import updateService from "./updateService";

const insertChatId = async (chatId: number) => {
  try {
    const getChatIdRes = await updateService.getByChatId(chatId);
    const packet = getChatIdRes as RowDataPacket;

    if (!packet[0]) {
      await updateService.insertChatId(chatId);
      console.log("Successfully Inserted!");
    } else {
      console.log("already exists");
    }

    return packet;
  } catch (err) {
    console.error(err);
  }
};

const getAllChatId = async () => {
  try {
    const getAllchatIdRes = await updateService.getAllChatId();
    const packet = getAllchatIdRes as RowDataPacket;

    console.log(packet);
    return getAllchatIdRes;
  } catch (err) {
    console.error(err);
  }
};

const deleteChatId = async (chatId: number) => {
  try {
    const getChatIdRes = await updateService.getByChatId(chatId);
    const packet = getChatIdRes as RowDataPacket;

    if (packet[0]) {
      await updateService.deleteChatId(chatId);
      console.log("Successfully deleted!");
    } else {
      console.log("User not exist");
    }

    return packet;
  } catch (err) {
    console.error(err);
  }
};

export { insertChatId, getAllChatId, deleteChatId };
