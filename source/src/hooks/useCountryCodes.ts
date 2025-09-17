import { all as AllCountryCodes } from "iso-3166-1";
import { Country } from "iso-3166-1/dist/iso-3166";
import { hasFlag } from "country-flag-icons";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

export const useCountryCodes = () => {
    const countryCodes: (Country & { name: string })[] = [
        {
            name: "AB - Abhazia",
            country: "Abhazia",
            alpha2: "AB",
            alpha3: "ABH",
            numeric: "895"
        },
        ...AllCountryCodes().map(code => ({ ...code, name: `${code.alpha2} - ${code.country}` }))
    ];

    const renderName = (code: Country & { name: string }) => {
        if (hasFlag(code.alpha2)) {
            return `${getUnicodeFlagIcon(code.alpha2)} ${code.alpha2} - ${code.country}`;
        }

        return `${code.alpha2} - ${code.country}`;
    };

    const countryCodesWithFlag = countryCodes.map(code => ({
        ...code,
        name: renderName(code)
    }));

    return { countryCodes, countryCodesWithFlag };
};
