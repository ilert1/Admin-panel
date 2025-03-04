import { useTranslate } from "react-admin";
import { toast } from "sonner";

export const useErrorToast = () => {
    const translate = useTranslate();

    return (description: string, title?: string) => {
        toast.error(title ?? translate("app.ui.toast.error"), {
            description,
            dismissible: true,
            duration: 3000
        });
    };
};
