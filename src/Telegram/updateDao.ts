import { PoolConnection } from "mysql2/typings/mysql";

const getByChatId = (connection: PoolConnection, chatId: number) => {
  const query = `
        SELECT chat_id 
        FROM Chat
        WHERE chat_id = ${chatId};
    `;

  const chatIdRows = connection.query(query);
  return chatIdRows;
};

const insertChatId = (connection: PoolConnection, chatId: number): void => {
  const query = `
        INSERT INTO Chat (chat_id)
        VALUES (${chatId});
    `;
  connection.query(query);
};

const getAllChatId = (connection: PoolConnection) => {
  const query = `
        SELECT chat_id
        FROM Chat;
    `;
  const chat_idRows = connection.query(query);
  return chat_idRows;
};

const deleteChatId = (connection: PoolConnection, chat_id: number): void => {
  const query = `
        DELETE FROM Chat
        WHERE chat_id = "${chat_id}";
    `;

  connection.query(query);
};

export default {
  getByChatId,
  insertChatId,
  getAllChatId,
  deleteChatId,
};
