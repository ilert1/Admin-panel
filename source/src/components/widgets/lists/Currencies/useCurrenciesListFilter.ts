import { debounce } from "lodash";
import { ChangeEvent, useState } from "react";
import { useListContext, useTranslate } from "react-admin";

const useCurrenciesListFilter = () => {
    const translate = useTranslate();

    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();

    const [currencyCode, setCurrencyCode] = useState(filterValues?.code || "");

    const onPropertySelected = debounce((value: string, type: "code") => {
        if (value) {
            setFilters({ ...filterValues, [type]: value }, displayedFilters, true);
        } else {
            Reflect.deleteProperty(filterValues, type);
            setFilters(filterValues, displayedFilters, true);
        }
        setPage(1);
    }, 300);

    const onCurrencyCodeChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setCurrencyCode(e.target.value);
        onPropertySelected(e.target.value, "code");
    };

    const onClearFilters = () => {
        setFilters({}, displayedFilters, true);
        setPage(1);
        setCurrencyCode("");
    };

    return {
        translate,
        currencyCode,
        onCurrencyCodeChanged,
        onClearFilters
    };
};

export default useCurrenciesListFilter;
