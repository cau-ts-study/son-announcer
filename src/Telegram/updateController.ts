import { sendMessage } from "./api/fetch";
import {
  ChatRowDataPacket,
  sendMessageAPIParams,
} from "./interfaces/interfaces";
import { TelegramMessages } from "./api/messages";
import updateService from "./updateService";

const insertChatId = async (chatId: number) => {
  try {
    const getChatIdRes = await updateService.getByChatId(chatId);
    const packet = getChatIdRes as ChatRowDataPacket[];

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

const checkChatId = async (chat_id: number) => {
  try {
    const getChatIdRes = await updateService.getByChatId(chat_id);
    const packet = getChatIdRes as ChatRowDataPacket[];
    const params: sendMessageAPIParams = {
      chat_id,
      text: "",
    };

    if (packet[0]) {
      params.text = TelegramMessages.USER_FOLLOWING;
    } else {
      params.text = TelegramMessages.USER_NOT_FOLLOWING;
    }

    await sendMessage(params);
  } catch (err) {
    console.error(err);
  }
};

const getAllChatId = async () => {
  try {
    const getAllchatIdRes = await updateService.getAllChatId();
    const packet = getAllchatIdRes as ChatRowDataPacket[];

    const result: number[] = packet.map((packetIter: ChatRowDataPacket) => {
      return packetIter.chat_id;
    });

    return result;
  } catch (err) {
    console.error(err);
  }
};

const deleteChatId = async (chatId: number) => {
  try {
    const getChatIdRes = await updateService.getByChatId(chatId);
    const packet = getChatIdRes as ChatRowDataPacket[];

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

export { insertChatId, getAllChatId, deleteChatId, checkChatId };
