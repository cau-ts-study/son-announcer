export default interface ApiHandler {
  requestData(url: string, options?: any): Promise<any>;
}
