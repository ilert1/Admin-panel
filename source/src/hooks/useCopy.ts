import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useTranslate } from "react-admin";

export const useCopy = () => {
    const translate = useTranslate();
    const appToast = useAppToast();

    const copy = (text: string) => {
        navigator.clipboard.writeText(text);

        appToast("success", "", translate("app.ui.textField.copied"));
    };

    return { copy };
};
