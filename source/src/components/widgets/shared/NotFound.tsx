import { useTranslate } from "react-admin";
import { Icon } from "./Icon";

export const NotFound = () => {
    const translate = useTranslate();
    return (
        <div className="flex flex-col h-full items-center justify-center">
            <div>
                <Icon name="404" folder="error" />
            </div>
            <span className="text-display-1">404: {translate("app.errors.404.text")}</span>
        </div>
    );
};
