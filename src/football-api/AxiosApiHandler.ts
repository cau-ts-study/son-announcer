import ApiHandler from "./interfaces/ApiHandler";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export default class AxiosApiHandler implements ApiHandler {
  public async requestData(
    url: string,
    options: AxiosRequestConfig<object>
  ): Promise<any> {
    try {
      const response = await axios.get(url, options)
      return response
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}


