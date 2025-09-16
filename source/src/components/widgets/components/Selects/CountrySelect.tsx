import { IPopoverSelect, PopoverSelect } from "./PopoverSelect";
import { useTranslate } from "react-admin";
import { all as AllCountryCodes } from "iso-3166-1";
import { Country } from "iso-3166-1/dist/iso-3166";
import { useMemo } from "react";
import { hasFlag } from "country-flag-icons";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

export const countryCodes: (Country & { name: string })[] = [
    {
        name: "AB - Abhazia",
        country: "Abhazia",
        alpha2: "AB",
        alpha3: "ABH",
        numeric: "895"
    },
    ...AllCountryCodes().map(code => ({ ...code, name: `${code.alpha2} - ${code.country}` }))
];

export const CountrySelect = ({
    value,
    onChange,
    setIdValue,
    isError,
    style = "Grey",
    errorMessage,
    disabled,
    modal,
    placeholder,
    isLoading
}: IPopoverSelect) => {
    const translate = useTranslate();

    const countryCodesWithFlags = useMemo(() => {
        const renderName = (code: Country & { name: string }) => {
            if (hasFlag(code.alpha2)) {
                return `${getUnicodeFlagIcon(code.alpha2)} ${code.alpha2} - ${code.country}`;
            }

            return `${code.alpha2} - ${code.country}`;
        };

        return countryCodes.map(code => ({
            ...code,
            name: renderName(code)
        }));
    }, []);

    return (
        <PopoverSelect
            variants={countryCodesWithFlags}
            value={value}
            onChange={onChange}
            variantKey="name"
            idField="alpha2"
            setIdValue={setIdValue}
            commandPlaceholder={translate("app.widgets.multiSelect.searchPlaceholder")}
            notFoundMessage={translate("resources.paymentSettings.countryCodeNotFoundMessage")}
            isError={isError}
            style={style}
            errorMessage={errorMessage}
            disabled={disabled}
            placeholder={
                placeholder || translate("resources.paymentSettings.financialInstitution.fields.countryCodePlaceholder")
            }
            modal={modal}
            isLoading={isLoading}
            complexFiltering={true}
        />
    );
};
