import { useMemo } from "react";
import { hasFlag } from "country-flag-icons";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

interface ICountryTextField {
    label?: string;
    text: string;
    countryCode?: string;
}

export const CountryTextField = ({ label, text, countryCode }: ICountryTextField) => {
    const currentText = useMemo(() => (text?.length > 0 ? text : "-"), [text]);
    const countryFlag = useMemo(
        () => (countryCode && hasFlag(countryCode) ? `${getUnicodeFlagIcon(countryCode)} ` : ""),
        [countryCode]
    );

    return (
        <div className="text-neutral-90 dark:text-neutral-0">
            {label && <p className="text-sm text-neutral-60">{label}</p>}

            <p className="block cursor-default flex-row items-center gap-2 truncate leading-5">
                {countryFlag}
                {currentText}
            </p>
        </div>
    );
};
