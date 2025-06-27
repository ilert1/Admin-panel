import { CurrencyWithId } from "@/data/currencies";
import { Currency } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { IPopoverSelect, PopoverSelect } from "./PopoverSelect";
import { useTranslate } from "react-admin";

interface CurrencySelectProps extends IPopoverSelect {
    currencies: CurrencyWithId[] | Currency[];
}

export const CurrencySelect = ({
    value,
    onChange,
    currencies,
    isError,
    errorMessage,
    disabled = false,
    style = "Grey",
    placeholder,
    modal
}: CurrencySelectProps) => {
    const translate = useTranslate();

    return (
        <PopoverSelect
            commandPlaceholder={translate("app.widgets.multiSelect.searchPlaceholder")}
            variants={currencies}
            value={value}
            onChange={onChange}
            variantKey={"code"}
            notFoundMessage={translate("resources.currency.notFoundMessage")}
            isError={isError}
            errorMessage={errorMessage}
            disabled={disabled}
            style={style}
            placeholder={
                placeholder || translate("resources.paymentSettings.systemPaymentInstruments.placeholders.currencyCode")
            }
            modal={modal}
        />
    );
};
