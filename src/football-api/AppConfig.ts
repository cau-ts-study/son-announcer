import ApiFootballDataGetter from "./ApiFootballDataGetter";
import FootballApiHandler from "./AxiosApiHandler";
import ApiHandler from "./interfaces/ApiHandler";

export class AppConfig {
  public apiHandler(): FootballApiHandler {
    return new FootballApiHandler();
  }

  public footballDataGetter(apiHandler: ApiHandler): ApiFootballDataGetter {
    return new ApiFootballDataGetter(apiHandler);
  }

}