import { PoolConnection } from "mysql2/promise";

const getByChatId = async (connection: PoolConnection, chatId: number) => {
  const query = `
        SELECT chat_id 
        FROM Chat
        WHERE chat_id = ${chatId};
    `;

  const chatIdRows = await connection.query(query);
  return chatIdRows;
};

const insertChatId = async (connection: PoolConnection, chatId: number) => {
  const query = `
        INSERT INTO Chat (chat_id)
        VALUES (${chatId});
    `;
  await connection.query(query);
};

const getAllChatId = async (connection: PoolConnection) => {
  const query = `
        SELECT chat_id
        FROM Chat;
    `;
  const chat_idRows = await connection.query(query);
  return chat_idRows;
};

const deleteChatId = async (connection: PoolConnection, chat_id: number) => {
  const query = `
        DELETE FROM Chat
        WHERE chat_id = "${chat_id}";
    `;

  await connection.query(query);
};

export default {
  getByChatId,
  insertChatId,
  getAllChatId,
  deleteChatId,
};
