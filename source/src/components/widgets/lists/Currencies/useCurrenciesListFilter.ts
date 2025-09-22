import { useCurrenciesListWithoutPagination } from "@/hooks";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { useListContext, useTranslate } from "react-admin";

const useCurrenciesListFilter = () => {
    const translate = useTranslate();

    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();
    const { currenciesData, currenciesLoadingProcess } = useCurrenciesListWithoutPagination();

    const [currencyCode, setCurrencyCode] = useState("");

    useEffect(() => {
        if (currenciesData && filterValues?.code) {
            const foundCurrencyCode = currenciesData.find(currency => currency.code === filterValues?.code)?.code;

            if (foundCurrencyCode) {
                setCurrencyCode(foundCurrencyCode);
            } else {
                Reflect.deleteProperty(filterValues, "code");
                setFilters(filterValues, displayedFilters, true);
                setCurrencyCode("");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currenciesData]);

    const onPropertySelected = debounce((value: string, type: "code") => {
        if (value) {
            setFilters({ ...filterValues, [type]: value }, displayedFilters, true);
        } else {
            Reflect.deleteProperty(filterValues, type);
            setFilters(filterValues, displayedFilters, true);
        }
        setPage(1);
    }, 300);

    const onCurrencyCodeChanged = (code: string) => {
        setCurrencyCode(code);
        onPropertySelected(code, "code");
    };

    const onClearFilters = () => {
        setFilters({}, displayedFilters, true);
        setPage(1);
        setCurrencyCode("");
    };

    return {
        translate,
        currenciesData,
        currenciesLoadingProcess,
        currencyCode,
        onCurrencyCodeChanged,
        onClearFilters
    };
};

export default useCurrenciesListFilter;
