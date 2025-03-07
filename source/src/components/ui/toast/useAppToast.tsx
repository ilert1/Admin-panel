import { ReactNode } from "react";
import { useTranslate } from "react-admin";
import { toast } from "sonner";

type AppToastType = "success" | "error";

export const useAppToast = () => {
    const translate = useTranslate();

    return (type: AppToastType, description: string | ReactNode, title?: string) => {
        const defaultTitle = type === "success" ? translate("app.ui.toast.success") : translate("app.ui.toast.error");

        toast[type](title ?? defaultTitle, {
            description,
            dismissible: true,
            duration: 3000
        });
    };
};
