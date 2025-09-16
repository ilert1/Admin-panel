import { IPopoverSelect, PopoverSelect } from "./PopoverSelect";
import { useTranslate } from "react-admin";
import { all as AllCountryCodes } from "iso-3166-1";
import { Country } from "iso-3166-1/dist/iso-3166";

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
    isLoading,
    complexFiltering = true
}: IPopoverSelect) => {
    const translate = useTranslate();

    return (
        <PopoverSelect
            variants={countryCodes}
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
