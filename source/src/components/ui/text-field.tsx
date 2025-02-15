import { Copy } from "lucide-react";
import { useCallback, useMemo } from "react";
import { Link, useTranslate } from "react-admin";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
    className = ""
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
    className?: string;
}) => {
    const currentText = useMemo(() => (text?.length > 0 ? text : "-"), [text]);
    const translate = useTranslate();

    const copy = useCallback(() => {
        navigator.clipboard.writeText(currentText);
        toast.success(translate("app.ui.textField.copied"), {
            dismissible: true,
            duration: 1000
        });
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
            return "overflow-hidden ellipsis block";
        } else if (wrap === "break-all") {
            return "overflow-hidden break-all block";
        }

        return "truncate block";
    };

    return (
        <div className="text-neutral-90 dark:text-neutral-0">
            {label && <small className={cn("text-neutral-60", labelSize)}>{label}</small>}
            {(type === "text" || type === "link") && (
                <p className={cn("leading-5 flex flex-row gap-2", className)}>
                    {copyValue && text?.length > 0 && (
                        <span>
                            <Copy
                                className={cn("h-4 w-4 cursor-pointer", type === "link" && "text-green-50")}
                                onClick={copy}
                            />
                        </span>
                    )}
                    <span
                        className={textStyle()}
                        style={{
                            ...(lineClamp
                                ? {
                                      display: "-webkit-box",
                                      overflow: "hidden",
                                      WebkitLineClamp: linesCount,
                                      WebkitBoxOrient: "vertical",
                                      wordBreak: "break-word",
                                      textWrap: "wrap",
                                      maxWidth: "100%",
                                      minWidth: minWidth
                                  }
                                : {})
                        }}>
                        {type === "link" ? (
                            <a href={link} target="_blank" className="block underline !text-green-50" rel="noreferrer">
                                {currentText}
                            </a>
                        ) : (
                            currentText
                        )}
                    </span>
                </p>
            )}
            {type === "internal-link" && (
                <Link to={link} className={cn("!text-card-foreground transition-colors hover:bg-muted/50", className)}>
                    <span className="font-medium">{text}</span>
                </Link>
            )}
        </div>
    );
};
