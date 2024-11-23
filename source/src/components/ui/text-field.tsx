import { Copy } from "lucide-react";
import { useCallback, useMemo } from "react";
import { Link, useTranslate } from "react-admin";
import { toast } from "sonner";

export const TextField = ({
    text,
    label,
    link = "/",
    type = "text",
    copyValue = false,
    wrap = false,
    lineClamp = false,
    linesCount = 3,
    minWidth = "150px"
}: {
    text: string;
    label?: string | undefined;
    link?: string;
    type?: "text" | "link" | "internal-link";
    copyValue?: boolean;
    wrap?: boolean | "break-all";
    lineClamp?: boolean;
    linesCount?: number;
    minWidth?: string;
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

    const textStyle = () => {
        if (wrap === true) {
            return "overflow-hidden ellipsis max-w-[500px]";
        } else if (wrap === "break-all") {
            return "overflow-hidden break-all max-w-[500px]";
        }
        // if (wrap) {
        //     return "break-words whitespace-normal max-w-[500px]";
        // }

        return "truncate max-w-[500px]";
    };

    return (
        <div>
            {label && <small className="text-sm text-muted-foreground">{label}</small>}
            {type === "text" && (
                <p className="leading-5 flex flex-row gap-2">
                    {copyValue && text?.length > 0 && (
                        <span>
                            <Copy
                                className="h-4 w-4 cursor-pointer text-neutral-60 dark:text-neutral-40"
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
                        {currentText}
                    </span>
                </p>
            )}
            {type === "link" && (
                <a href="#" className="block hover:underline">
                    {text}
                </a>
            )}
            {type === "internal-link" && (
                <Link to={link} className="!text-card-foreground transition-colors hover:bg-muted/50">
                    <span className="font-medium">{text}</span>
                </Link>
            )}
        </div>
    );
};
