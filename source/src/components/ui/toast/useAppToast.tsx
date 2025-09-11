import { Check, Copy } from "lucide-react";
import { ReactNode, useState } from "react";
import { useTranslate } from "react-admin";
import { toast } from "sonner";

type AppToastType = "success" | "error";

export const DescriptionWithCopyBtn = ({ description }: { description: string | ReactNode }) => {
    const [copySuccess, setCopySuccess] = useState(false);

    const onCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopySuccess(true);

        setTimeout(() => {
            setCopySuccess(false);
        }, 1500);
    };

    return (
        <>
            <span className="mr-1.5">{description}</span>

            {copySuccess ? (
                <Check className="mb-1 inline-block h-4 w-4 cursor-pointer text-green-50 hover:text-green-40 dark:text-green-40 dark:hover:text-green-50" />
            ) : (
                <Copy
                    className="mb-1 inline-block h-4 w-4 cursor-pointer text-green-50 hover:text-green-40 dark:text-green-40 dark:hover:text-green-50"
                    onClick={() => onCopy(description?.toString() || "")}
                />
            )}
        </>
    );
};

export const useAppToast = () => {
    const translate = useTranslate();

    return (type: AppToastType, description: string | ReactNode, title?: string, duration?: number) => {
        const defaultTitle = type === "success" ? translate("app.ui.toast.success") : translate("app.ui.toast.error");

        toast[type](title ?? defaultTitle, {
            description: type === "error" ? <DescriptionWithCopyBtn description={description} /> : description,
            dismissible: true,
            duration: duration ?? 3000
        });
    };
};
