import { Copy } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useTranslate } from "react-admin";
import { toast } from "sonner";

export const TextField = ({
    text,
    label,
    type = "text",
    copyValue = false
}: {
    text: string;
    label?: string | undefined;
    type?: "text" | "link";
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
            {type === "text" ? (
                <p className="leading-5 flex flex-row gap-2">
                    <span>{currentText}</span>
                    {copyValue && text?.length > 0 && (
                        <span>
                            <Copy className="h-4 w-4 cursor-pointer" onClick={copy} />
                        </span>
                    )}
                </p>
            ) : (
                <a href="#" className="block hover:underline">
                    {text}
                </a>
            )}
        </div>
    );
};
