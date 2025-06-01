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
    disabled = false
}: CurrencySelectProps) => {
    const translate = useTranslate();

    return (
        <PopoverSelect
            variants={currencies}
            value={value}
            onChange={onChange}
            variantKey={"code"}
            notFoundMessage={translate("resources.direction.noCurrencies")}
            isError={isError}
            errorMessage={errorMessage}
            disabled={disabled}
        />
    );
};
