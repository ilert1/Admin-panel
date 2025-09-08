import { useCurrenciesListWithoutPagination, useMerchantsListWithoutPagination } from "@/hooks";
import { useCascadesListWithoutPagination } from "@/hooks/useCascadesListWithoutPagination";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { useListContext, useTranslate } from "react-admin";

const useCascadesListFilter = () => {
    const translate = useTranslate();
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();
    const { cascadesData, isCascadesLoading } = useCascadesListWithoutPagination();
    const { currenciesData, currenciesLoadingProcess } = useCurrenciesListWithoutPagination();
    const { merchantData, merchantsLoadingProcess } = useMerchantsListWithoutPagination();

    const [name, setName] = useState(filterValues?.name || "");
    const [type, setType] = useState(filterValues?.type || "");
    const [cascadeKind, setCascadeKind] = useState(filterValues?.cascade_kind || "");
    const [state, setState] = useState(filterValues?.state || "");
    const [srcCurrencyCode, setSrcCurrencyCode] = useState(filterValues?.src_currency_code || "");
    const [merchantValue, setMerchantValue] = useState("");

    useEffect(() => {
        if (merchantData) {
            setMerchantValue(merchantData?.find(merchant => merchant.id === filterValues?.merchant)?.name || "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [merchantData]);

    const onPropertySelected = debounce(
        (value: string, type: "name" | "type" | "cascade_kind" | "state" | "src_currency_code" | "merchant") => {
            if (value) {
                setFilters({ ...filterValues, [type]: value }, displayedFilters, true);
            } else {
                Reflect.deleteProperty(filterValues, type);
                setFilters(filterValues, displayedFilters, true);
            }
            setPage(1);
        },
        300
    );

    const onNameChanged = (name: string) => {
        setName(name);
        onPropertySelected(name, "name");
    };

    const onTypeChanged = (type: string) => {
        setType(type);
        onPropertySelected(type, "type");
    };

    const onCascadeKindChanged = (kind: string) => {
        setCascadeKind(kind);
        onPropertySelected(kind, "cascade_kind");
    };

    const onStateChanged = (state: string) => {
        setState(state);
        onPropertySelected(state, "state");
    };

    const onSrcCurrencyCodeChanged = (currency: string) => {
        setSrcCurrencyCode(currency);
        onPropertySelected(currency, "src_currency_code");
    };

    const onMerchantIdChanged = (merchant: string) => {
        onPropertySelected(merchant, "merchant");
    };

    const onClearFilters = () => {
        setFilters({}, displayedFilters, true);
        setPage(1);
        setName("");
        setType("");
        setCascadeKind("");
        setState("");
        setSrcCurrencyCode("");
        setMerchantValue("");
    };

    return {
        translate,
        cascadesData,
        isCascadesLoading,
        name,
        onNameChanged,
        type,
        onTypeChanged,
        cascadeKind,
        onCascadeKindChanged,
        state,
        onStateChanged,
        currenciesData,
        currenciesLoadingProcess,
        srcCurrencyCode,
        onSrcCurrencyCodeChanged,
        merchantData,
        merchantsLoadingProcess,
        merchantValue,
        setMerchantValue,
        onMerchantIdChanged,
        onClearFilters
    };
};

export default useCascadesListFilter;
