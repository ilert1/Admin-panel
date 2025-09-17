import { useMemo } from "react";

interface ICountryTextField {
    label?: string;
    text: string;
}

export const CountryTextField = ({ label, text }: ICountryTextField) => {
    const currentText = useMemo(() => (text?.length > 0 ? text : "-"), [text]);

    return (
        <div className="text-neutral-90 dark:text-neutral-0">
            {label && <p className="text-sm text-neutral-60">{label}</p>}

            <p className="block cursor-default flex-row items-center gap-2 truncate leading-5">{currentText}</p>
        </div>
    );
};
