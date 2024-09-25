import moment from "moment";
import "moment/locale/ru";
import "moment/locale/es-us";

export interface MessageTimeProps {
    locale: string;
    timestamp: number;
}

export const MessageTime = ({ locale = "ru", timestamp }: MessageTimeProps) => {
    moment.locale(locale === "en" ? "es-us" : locale);
    console.log(timestamp);
    const formattedTime = locale === "ru" ? moment(timestamp).format("HH:mm") : moment(timestamp).format("LT");
    return <span className="text-xs text-neutral-500 mt-1">{formattedTime}</span>;
};
