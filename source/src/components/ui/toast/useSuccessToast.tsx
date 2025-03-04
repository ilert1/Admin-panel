import { ReactNode } from "react";
import { useTranslate } from "react-admin";
import { toast } from "sonner";

export const useSuccessToast = () => {
    const translate = useTranslate();

    return (description: string | ReactNode, title?: string) => {
        toast.success(title ?? translate("app.ui.toast.success"), {
            description,
            dismissible: true,
            duration: 3000
        });
    };
};
