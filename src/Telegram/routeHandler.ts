import { Commands } from "./interfaces/interfaces";
import {
  ChatMemberUpdated,
  EntityType,
  Message,
  MemberStatus,
} from "./interfaces/telegramInterfaces";
import { deleteChatId, insertChatId } from "./updateController";

export const messageHandler = async (params: {
  update_id: number;
  message: Message;
}) => {
  const { message } = params;

  // command
  if (message.entities) {
    await entityHandler(message);
  }
  // image

  // poll

  //
};

export const memberStatusHandler = async (params: {
  update_id: number;
  my_chat_member: ChatMemberUpdated;
}) => {
  const { my_chat_member } = params;
  const chat_id: number = my_chat_member.from.id;
  const updatedStatus: MemberStatus = my_chat_member.new_chat_member.status;

  switch (updatedStatus) {
    case MemberStatus.BANNED:
      await deleteChatId(chat_id);
      break;
  }
};

const entityHandler = async (message: Message) => {
  const content: string = message.text as string;
  const parsedList: string[] | null = entityParser(content);
  const chatId: number = message.from!.id;
  const command: string | undefined = parsedList.shift();

  for (const entity of message.entities!) {
    switch (entity.type) {
      case EntityType.BOT_COMMAND:
        if (typeof command === "string") {
          await commandHandler({ command, chatId });
        }
        break;
    }
  }
};

const entityParser = (content: string): string[] => {
  const contentList: string[] = content.split(" ");
  const commandRegex = /^\/[a-z0-9]+$/i;
  const parsedList: string[] = new Array<string>();

  for (const contentIter of contentList) {
    const regexRes: RegExpExecArray | null = commandRegex.exec(contentIter);

    if (regexRes) {
      parsedList.push(regexRes[0]);
    }
  }

  return parsedList;
};

const commandHandler = async (params: { command: string; chatId: number }) => {
  const { command, chatId } = params;
  switch (command) {
    case Commands.Start:
      await insertChatId(chatId);
      break;

    case Commands.Exit:
      await deleteChatId(chatId);
      break;
  }
};
