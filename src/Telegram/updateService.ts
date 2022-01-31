import pool from "../../config/database";
import updateDao from "./updateDao";

const getByChatId = async (chatId: number) => {
  try {
    const connection = await pool.getConnection();
    const getChatIdRes = await updateDao.getByChatId(connection, chatId);
    connection.release();

    return getChatIdRes;
  } catch (err) {
    console.error(err);
  }
};

const insertChatId = async (chatId: number) => {
  try {
    const connection = await pool.getConnection();
    const insertChatIdRes = await updateDao.insertChatId(connection, chatId);
    connection.release();

    return insertChatIdRes;
  } catch (err) {
    console.error(err);
  }
};

const getAllChatId = async () => {
  try {
    const connection = await pool.getConnection();
    const getAllChatIdRes = await updateDao.getAllChatId(connection);
    connection.release();

    return getAllChatIdRes;
  } catch (err) {
    console.error(err);
  }
};

const deleteChatId = async (userId: number) => {
  try {
    const connection = await pool.getConnection();
    await updateDao.deleteChatId(connection, userId);
    connection.release();
  } catch (err) {
    console.error(err);
  }
};

export default {
  getByChatId,
  insertChatId,
  getAllChatId,
  deleteChatId,
};
