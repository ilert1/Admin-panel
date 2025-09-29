import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface ICountryTextField {
    label?: string;
    text: string;
    wrapText?: boolean;
}

export const CountryTextField = ({ label, text, wrapText = false }: ICountryTextField) => {
    const currentText = useMemo(() => (text?.length > 0 ? text : "-"), [text]);

    return (
        <div className="text-neutral-90 dark:text-neutral-0">
            {label && <p className="text-sm text-neutral-60">{label}</p>}

            <p
                className={cn(
                    "block cursor-default flex-row items-center gap-2 truncate leading-5",
                    wrapText && "whitespace-normal"
                )}>
                {currentText}
            </p>
        </div>
    );
};
