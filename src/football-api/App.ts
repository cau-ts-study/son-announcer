import { AppConfig } from "./AppConfig";
import IDs from "./data/IDs";
import { LINEUP } from "./entities/TelegramInterface";
import ApiHandler from "./interfaces/ApiHandler";
import FootballDataGetter from "./interfaces/FootballDataGetter";

class App {
  private appConfig: AppConfig;
  private apiHandler: ApiHandler;
  private footballDataGetter: FootballDataGetter;
  private IDs: object;

  constructor() {
    this.appConfig = new AppConfig();
    this.apiHandler = this.appConfig.apiHandler();
    this.footballDataGetter = this.appConfig.footballDataGetter(this.apiHandler);
    this.IDs = IDs;
  }

  async start() {
    // 다음경기 시간 받아오기
    // const upcomingMatch = await this.footballDataGetter.getUpcomingMatch(49);
    // console.log(upcomingMatch);
    
    // 라인업 받아오기
    // const lineUp = await this.footballDataGetter.getLineUp(49, 824593, 907);
    // console.log(lineUp);

    // 평점 받아오기
    // const rating = await this.footballDataGetter.getRating(710720, IDs.teams.tottenham, 244);
    // console.log(rating);

    // 이벤트 받아오기
    let matchEvent = await this.footballDataGetter.getNewEvents(824593, 2278);
    console.log(matchEvent);
    matchEvent = await this.footballDataGetter.getNewEvents(824593, 2278);
    console.log(matchEvent);
    matchEvent = await this.footballDataGetter.getNewEvents(824593, 2278);
    console.log(matchEvent);
  }
}

const app = new App();

app.start();
