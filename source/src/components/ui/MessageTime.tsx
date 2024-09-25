import moment from "moment";
import "moment/locale/ru";
import "moment/locale/es-us";

export interface MessageTimeProps {
    locale: string;
}
export const MessageTime = ({ locale }: MessageTimeProps) => {
    moment.locale(locale === "en" ? "es-us" : "ru");

    const currentTime = moment().format("LT");

    return <span className="text-xs text-neutral-500 mt-1">{currentTime}</span>;
};
