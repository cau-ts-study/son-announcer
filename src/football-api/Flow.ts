import { AppConfig } from "./AppConfig";
import IDs from "./data/IDs";
import ApiHandler from "./interfaces/ApiHandler";
import FootballDataGetter from "./interfaces/FootballDataGetter";
import { sendMessage } from "../Telegram/api/fetch";
import { getAllChatId } from "../Telegram/updateController";
import { UpcomingMatch } from "./entities/UpcomingMatch";
import cron from "node-schedule";

export default class Flow {
  private appConfig: AppConfig;
  private apiHandler: ApiHandler;
  private footballDataGetter: FootballDataGetter;
  private IDs;

  constructor() {
    this.appConfig = new AppConfig();
    this.apiHandler = this.appConfig.apiHandler();
    this.footballDataGetter = this.appConfig.footballDataGetter(
      this.apiHandler
    );
    this.IDs = IDs;
  }

  private async sendMessageToMany(message: string, chatIds: number[]) {
    for (const chatId of chatIds) {
      await sendMessage({ chat_id: chatId, text: message });
    }
  }

  private sendLineUp(match: UpcomingMatch, chatIds: number[]) {
    const startDate = new Date(match.date.setHours(match.date.getHours() - 1));
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const task = cron.scheduleJob(
      {
        start: startDate,
        rule: "*/10 * * * *",
      },
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async () => {
        const lineUp = await this.footballDataGetter.getLineUp(
          this.IDs.teams.tottenham,
          match.ID,
          this.IDs.players.Son
        );
        if ("msg" in lineUp) {
          return;
        }
        if (lineUp.type === "STARTING") {
          await this.sendMessageToMany("손흥민이 선발입니다.", chatIds);
        } else if (lineUp.type === "BENCH") {
          await this.sendMessageToMany("손흥민이 벤치입니다.", chatIds);
        } else if (lineUp.type === "EXCLUDED") {
          await this.sendMessageToMany("명단 제외입니다.", chatIds);
        }
        await this.sendMessageToMany(lineUp.lineup, chatIds);
        task.cancel();
      }
    );
  }

  private sendMatchEvent(match: UpcomingMatch, chatIds: number[]) {
    const task = cron.scheduleJob(
      {
        start: match.date,
        rule: "*/2 * * * *",
      },
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async () => {
        const matchEvent = await this.footballDataGetter.getNewEvents(
          match.ID,
          this.IDs.players.Son
        );
        if ("msg" in matchEvent) {
          return;
        }
        if (matchEvent.live === true) {
          const events = matchEvent.events;
          events.map(async (event) => {
            if (event.type === "GOAL") {
              await this.sendMessageToMany(
                "손흥민이 골을 넣었습니다.",
                chatIds
              );
            } else if (event.type === "ASSIST") {
              await this.sendMessageToMany("손흥민 어시스트!!", chatIds);
            } else if (event.type === "YELLOW_CARD") {
              await this.sendMessageToMany("옐로카드네요", chatIds);
            } else if (event.type === "RED_CARD") {
              await this.sendMessageToMany(
                "레드카드 받았네요. 잘가용",
                chatIds
              );
            } else if (event.type === "SUBIN") {
              await this.sendMessageToMany(
                "손흥민이 교체 출전합니다.",
                chatIds
              );
            } else if (event.type === "SUBOUT") {
              await this.sendMessageToMany("손흥민 교체 아웃!!", chatIds);
            } else if (event.type === "GOAL_CANCELLED") {
              await this.sendMessageToMany("손흥민 골이 취소됐네요", chatIds);
            }
          });
        } else if (matchEvent.live === false) {
          await this.sendMessageToMany("경기가 끝났습니다.", chatIds);
          task.cancel();
        }
      }
    );
  }

  private async flow(): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const chatIds = (await getAllChatId()) as number[];
    console.log(chatIds);
    const upcomingMatch = await this.footballDataGetter.getUpcomingMatch(
      this.IDs.teams.tottenham
    );
    if ("msg" in upcomingMatch) {
      return false;
    }
    this.sendLineUp(upcomingMatch, chatIds);
    this.sendMatchEvent(upcomingMatch, chatIds);

    return true;
  }

  start() {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    cron.scheduleJob("13 21 * * *", async () => {
      await this.flow();
    });
  }
}
