import moment from "moment";
import "moment/locale/ru";
import "moment/locale/es-us";

export interface MessageTimeProps {
    locale?: string;
    timestamp: number;
}

export const MessageTime = ({ locale = "ru", timestamp }: MessageTimeProps) => {
    const currentLocale = locale ? locale : "ru";
    moment.locale(currentLocale === "en" ? "es-us" : currentLocale);

    const formattedTime = currentLocale === "ru" ? moment(timestamp).format("HH:mm") : moment(timestamp).format("LT");
    return <span className="mt-1 text-xs text-neutral-500">{formattedTime}</span>;
};
