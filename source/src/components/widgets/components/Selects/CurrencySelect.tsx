import { CurrencyWithId } from "@/data/currencies";
import { Currency } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { PopoverSelect } from "./PopoverSelect";

interface CurrencySelectProps {
    value: string;
    onChange: (value: string) => void;
    currencies: CurrencyWithId[] | Currency[];
    isError?: boolean;
    errorMessage?: string;
}

export const CurrencySelect = ({ value, onChange, currencies, isError, errorMessage }: CurrencySelectProps) => {
    return (
        <PopoverSelect
            variants={currencies}
            value={value}
            onChange={onChange}
            variantKey={"code"}
            notFoundMessage={"No currency found."}
            isError={isError}
            errorMessage={errorMessage}
        />
    );
};
