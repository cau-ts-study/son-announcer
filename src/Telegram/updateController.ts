import updateService from "./updateService";

const insertChatId = async (chatId: number) => {
  try {
    const getChatIdRes = await updateService.getByChatId(chatId);

    if (!getChatIdRes) {
      await updateService.insertChatId(chatId);
      console.log("Successfully Inserted!");
    } else {
      console.log("already exists");
    }

    return getChatIdRes;
  } catch (err) {
    console.error(err);
  }
};

const getAllChatId = async () => {
  try {
    const getAllchatIdRes = await updateService.getAllChatId();

    return getAllchatIdRes;
  } catch (err) {
    console.error(err);
  }
};

const deleteChatId = async (chatId: number) => {
  const userId: number = chatId;

  try {
    const getChatIdRes = await updateService.getByChatId(userId);

    if (getChatIdRes) {
      await updateService.deleteChatId(userId);
      console.log("Successfully deleted!");
    } else {
      console.log("User not exist");
    }
  } catch (err) {
    console.error(err);
  }
};

export { insertChatId, getAllChatId, deleteChatId };
