import { useMerchantsListWithoutPagination } from "@/hooks";
import { debounce } from "lodash";
import { ChangeEvent, useEffect, useState } from "react";
import { useListContext, useTranslate } from "react-admin";

export const useCascadeMerchantsListFilter = () => {
    const translate = useTranslate();
    const { merchantData, merchantsLoadingProcess } = useMerchantsListWithoutPagination();

    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();

    const [cascadeKind, setCascadeKind] = useState(filterValues?.cascade_kind || "");
    const [cascadeType, setCascadeType] = useState(filterValues?.cascade_type || "");
    const [currency, setCurrency] = useState(filterValues?.src_currency_code || "");
    const [merchantId, setMerchantId] = useState(filterValues?.merchant || "");
    const [merchantValue, setMerchantValue] = useState("");

    useEffect(() => {
        if (merchantData) {
            setMerchantValue(merchantData?.find(merchant => merchant.id === filterValues?.merchant)?.name || "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [merchantData]);

    const onPropertySelected = debounce(
        (value: string, type: "cascade_kind" | "src_currency_code" | "merchant" | "cascade_type") => {
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

    const onKindChanged = (e: string) => {
        setCascadeKind(e);
        onPropertySelected(e, "cascade_kind");
    };
    const onMerchantChanged = (merchant: string) => {
        setMerchantId(merchant);
        onPropertySelected(merchant, "merchant");
    };
    const onCurrencyChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setCurrency(e.target.value);
        onPropertySelected(e.target.value, "src_currency_code");
    };

    const onTypeChanged = (e: string) => {
        setCascadeType(e);
        onPropertySelected(e, "cascade_type");
    };

    const onClearFilters = () => {
        setFilters({}, displayedFilters, true);
        setPage(1);
        setCascadeKind("");
        setCurrency("");
        setMerchantId("");
        setMerchantValue("");
        setCascadeType("");
    };

    return {
        translate,
        cascadeKind,
        cascadeType,
        currency,
        onClearFilters,
        onKindChanged,
        onTypeChanged,
        onCurrencyChanged,
        merchantData,
        merchantsLoadingProcess,
        merchantValue,
        setMerchantValue,
        merchantId,
        onMerchantChanged
    };
};
