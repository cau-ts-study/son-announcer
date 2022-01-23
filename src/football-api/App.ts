import { AppConfig } from "./AppConfig";
import IDs from "./data/IDs";
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
    const upcomingMatch = await this.footballDataGetter.getUpcomingMatch(IDs.teams.tottenham);
    console.log(upcomingMatch);
  }
}

const app = new App();

app.start();
