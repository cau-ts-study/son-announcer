import TelegramAPI from ".";
import { EventParams } from "../interfaces/interfaces";

const exitChat = async (chatId: number) => {
    const params = {
        chat_id: chatId,
    };

    try {
        const res = await TelegramAPI.get('/leaveChat', { params });
        console.log(res.data);
    } catch(err) {
        console.error(err);
    }
};

const sendEvents = async (events: EventParams, chatId: number) => {
    const params = {
        chat_id: chatId,
        photo: events.url,
        caption: events.content,
    }
    try {
        const res = await TelegramAPI.get('/sendPhoto', { params });
        console.log(res.data);
    } catch (err) {
        console.error(err)
    }
}

const sendLineups = async (events: EventParams, chatId: number) => {
    const params = {
        chat_id: chatId,
        text: events.content
    };
    try {
        const res = await TelegramAPI.get('/sendMessage', { params });
        console.log(res.data);
    } catch (err) {
        console.error(err);
    }
}

export {
    exitChat,
    sendEvents,
    sendLineups,
}