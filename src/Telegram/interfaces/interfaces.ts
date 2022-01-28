// interfaces
export interface sendPhotoAPIParams {
    chatId: number,
    photo: string,
    caption?: string,
    parseMode?: string,
}

export interface sendMessageAPIParams {
    chatId: number,
    text: string,
    parseMode?: string,
};

export interface EventParams {
    [type: string]: {
        url: string,
        content: string,
    }
}


// enums
export enum Commands {
    Start = "/start",
    Exit = "/exit",
};

export enum FootballEvents {
    SINGLE,
    DUOBLE,
    TRIPLE,
    QUADRUPLE,
    QUINTUPLE,
}

export class EventClass {
    url: string;
    caption: string;

    constructor (url: string, caption: string) {
        this.url = url;
        this.caption = caption;
    };
}

const SINGLE_URL = "https://img.khan.co.kr/news/2020/08/23/l_2020082401002530900204221.jpg";
const DOUBLE_URL = "https://img.sbs.co.kr/newimg/news/20181224/201264134_1280.jpg";
const TRIPLE_URL = "http://www.footballist.co.kr/news/photo/202009/127130_52775_2423.jpg";

const SINGLE_CAPTION = "손흥민 골 !";
const DOUBLE_CAPTION = "손흥민 멅티 골 !";
const TRIPLE_CAPTION = "손흥민 해트트릭 !";