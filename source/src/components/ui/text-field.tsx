import { Copy } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useTranslate } from "react-admin";
import { cn } from "@/lib/utils";
import { useAppToast } from "./toast/useAppToast";

export type LabelSize = "text-xs" | "text-sm";

export const TextField = ({
    text,
    label,
    labelSize = "text-sm",
    link = "/",
    type = "text",
    copyValue = false,
    wrap = false,
    lineClamp = false,
    linesCount = 3,
    minWidth = "150px",
    maxWidth = "100%",
    className = "",
    onClick
}: {
    text: string;
    label?: string | undefined;
    labelSize?: LabelSize;
    link?: string;
    type?: "text" | "link" | "internal-link";
    copyValue?: boolean;
    wrap?: boolean | "break-all";
    lineClamp?: boolean;
    linesCount?: number;
    minWidth?: string;
    maxWidth?: string;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLSpanElement> | undefined;
}) => {
    const currentText = useMemo(() => (text?.length > 0 ? text : "-"), [text]);
    const translate = useTranslate();

    const appToast = useAppToast();

    const copy = useCallback(() => {
        navigator.clipboard.writeText(currentText);

        appToast("success", "", translate("app.ui.textField.copied"));
    }, [currentText]); // eslint-disable-line react-hooks/exhaustive-deps

    // const textStyle = () => {
    //     if (wrap === true) {
    //         return "overflow-hidden ellipsis max-w-[500px]";
    //     } else if (wrap === "break-all") {
    //         return "overflow-hidden break-all max-w-[500px]";
    //     }

    //     return "truncate max-w-[500px]";
    // };

    // Experiemental
    const textStyle = () => {
        if (wrap === true) {
            return "overflow-hidden ellipsis";
        } else if (wrap === "break-all") {
            return "overflow-hidden break-all";
        }

        return "truncate";
    };

    return (
        <div className="text-neutral-90 dark:text-neutral-0">
            {label && <small className={cn("text-neutral-60", labelSize)}>{label}</small>}
            {(type === "text" || type === "link") && (
                <p className={cn("flex flex-row items-center gap-2 leading-5", className)}>
                    {copyValue && text?.length > 0 && (
                        <span>
                            <Copy
                                className={cn(
                                    "h-4 w-4 cursor-pointer",
                                    (type === "link" || onClick) &&
                                        "text-green-50 hover:text-green-40 dark:text-green-40 dark:hover:text-green-50"
                                )}
                                onClick={copy}
                            />
                        </span>
                    )}
                    <span
                        className={cn(
                            textStyle(),
                            "block cursor-default",
                            onClick &&
                                "cursor-pointer !text-green-50 underline transition-all duration-300 hover:!text-green-40 dark:!text-green-40 dark:hover:!text-green-50"
                        )}
                        onClick={onClick}
                        style={{
                            ...(lineClamp
                                ? {
                                      display: "-webkit-box",
                                      overflow: "hidden",
                                      WebkitLineClamp: linesCount,
                                      WebkitBoxOrient: "vertical",
                                      wordBreak: "break-all",
                                      textWrap: "wrap",
                                      maxWidth: maxWidth,
                                      minWidth: minWidth
                                  }
                                : {})
                        }}>
                        {type === "link" ? (
                            <a
                                href={link}
                                target="_blank"
                                className="block text-green-50 underline outline-none transition-colors hover:text-green-40 focus-visible:text-neutral-60 active:text-green-60 dark:text-green-40 dark:hover:text-green-50 dark:focus-visible:text-neutral-70 dark:active:text-green-20"
                                rel="noreferrer">
                                {currentText}
                            </a>
                        ) : (
                            currentText
                        )}
                    </span>
                </p>
            )}
        </div>
    );
};
