

const getByChatId = async (connection: any, chatId: number) => {
    const query = `
        SELECT chat_id 
        FROM Chat
        WHERE chat_id = ${chatId};
    `;
    const [[chatIdRows]] = await connection.query(query);
    return chatIdRows;
}

const insertChatId = async (connection: any, chatId: number) => {
    const query = `
        INSERT INTO Chat (chat_id)
        VALUES (${chatId});
    `;
    const [chatIdRows] = await connection.query(query);
    return chatIdRows;
}

const getAllChatId = async (connection: any) => {
    const query = `
        SELECT chat_id
        FROM Chat;
    `;
    const [chat_idRows] = await connection.query(query);
    return chat_idRows;
}

const deleteChatId = async (connection: any, chat_id: number) => {
    const query = `
        DELETE FROM Chat
        WHERE chat_id = "${chat_id}";
    `;
    
    await connection.query(query);
}

export default {
    getByChatId,
    insertChatId,
    getAllChatId,
    deleteChatId,
}