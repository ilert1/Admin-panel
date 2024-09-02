import { Copy } from "lucide-react";
import { useCallback, useMemo } from "react";
import { Link, useTranslate } from "react-admin";
import { toast } from "sonner";

export const TextField = ({
    text,
    label,
    link = "/",
    type = "text",
    copyValue = false
}: {
    text: string;
    label?: string | undefined;
    link?: string;
    type?: "text" | "link" | "internal-link";
    copyValue?: boolean;
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
                    <span className={copyValue && text?.length > 0 ? "truncate max-w-[500px]" : ""}>{currentText}</span>
                </p>
            )}
            {type === "link" && (
                <a href="#" className="block hover:underline">
                    {text}
                </a>
            )}
            {type === "internal-link" && (
                <Link to={link} className="!text-card-foreground transition-colors hover:bg-muted/50">
                    <p className="font-medium">{text}</p>
                </Link>
            )}
        </div>
    );
};
