import { useCountryCodes } from "@/hooks";
import { IPopoverSelect, PopoverSelect } from "./PopoverSelect";
import { useTranslate } from "react-admin";

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
    const { countryCodesWithFlag } = useCountryCodes();

    return (
        <PopoverSelect
            variants={countryCodesWithFlag}
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
            // complexFiltering={true}
        />
    );
};
