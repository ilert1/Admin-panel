import { debounce } from "lodash";
import { ChangeEvent, useState } from "react";
import { useListContext, useTranslate } from "react-admin";

const useCascadesListFilter = () => {
    const translate = useTranslate();
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();

    const [type, setType] = useState(filterValues?.type || "");
    const [currency, setCurrency] = useState(filterValues?.src_currency_code || "");

    const onPropertySelected = debounce((value: string, type: "type" | "src_currency_code") => {
        if (value) {
            setFilters({ ...filterValues, [type]: value }, displayedFilters, true);
        } else {
            Reflect.deleteProperty(filterValues, type);
            setFilters(filterValues, displayedFilters, true);
        }
        setPage(1);
    }, 300);

    const onTypeChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setType(e.target.value);
        onPropertySelected(e.target.value, "type");
    };

    const onCurrencyChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setCurrency(e.target.value);
        onPropertySelected(e.target.value, "src_currency_code");
    };

    const onClearFilters = () => {
        setFilters({}, displayedFilters, true);
        setPage(1);
        setType("");
        setCurrency("");
    };

    return {
        translate,
        type,
        currency,
        onClearFilters,
        onTypeChanged,
        onCurrencyChanged
    };
};

export default useCascadesListFilter;
