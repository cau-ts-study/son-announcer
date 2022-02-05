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
    // const upcomingMatch = await this.footballDataGetter.getUpcomingMatch(IDs.teams.tottenham);
    // console.log(upcomingMatch);
    
    // const lineUp = await this.footballDataGetter.getLineUp(IDs.teams.tottenham, 710720, IDs.players.Son);
    // console.log(lineUp);

    // const rating = await this.footballDataGetter.getRating(710720, IDs.teams.tottenham, 244);
    // console.log(rating);

    let matchEvent = await this.footballDataGetter.getNewEvents(815150, 18778);
    console.log(matchEvent)
    matchEvent = await this.footballDataGetter.getNewEvents(815150, 18778);
    console.log(matchEvent)
    matchEvent = await this.footballDataGetter.getNewEvents(815150, 18778);
    console.log(matchEvent)
  }
}

const app = new App();

app.start();
