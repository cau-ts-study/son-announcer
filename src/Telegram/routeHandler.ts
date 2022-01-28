import { Commands } from "./interfaces/interfaces";
import { ChatMemberUpdated, EntityType, Message, MemberStatus } from "./interfaces/telegramInterfaces";
import { deleteUserId, insertUserId } from "./updateController";

export const messageHandler = async (params: any) => {
    const { update_id, message }: { update_id: number, message: Message} = params;

    // command 
    if (message.entities) {
        entityHandler(message);
    }
    // image

    // poll

    // 
}


export const memberStatusHandler = async (params: { update_id: number, my_chat_member: ChatMemberUpdated }) => {
    const { update_id, my_chat_member } = params;
    const chat_id: number = my_chat_member.from.id;
    const updatedStatus: MemberStatus = my_chat_member.new_chat_member.status!;

    switch (updatedStatus) {
        case MemberStatus.BANNED:
            await deleteUserId(chat_id);
            break;
    }

}


const entityHandler = (message: Message): void => {
    const content: string = message.text as string;
    const parsedList: string[] | null = entityParser(content);
    const chatId: number = message.from!.id;
    
    for (let entity of message.entities!) {
        switch (entity.type) {
            case EntityType.BOT_COMMAND: 
                const command: string = parsedList.shift() as string;
                commandHandler({command, chatId});
                break;
        }
    }
}

const entityParser = (content: string): string[] => {
    const contentList: string[] = content.split(" ");
    const commandRegex: RegExp = /^\/[a-z0-9]+$/i;
    const parsedList: string[] = new Array();

    for (let contentIter of contentList) {
        const regexRes: RegExpExecArray | null = commandRegex.exec(contentIter);

        if (regexRes) {
            parsedList.push(regexRes[0]);
        }
    }

    return parsedList;
};


const commandHandler = async (params: { command: string, chatId: number})  => {
    const { command, chatId } = params;
    switch (command) {
        case Commands.Start:
            await insertUserId(chatId);
            break;
    
        case Commands.Exit:
            await deleteUserId(chatId);
            break;
    }
}