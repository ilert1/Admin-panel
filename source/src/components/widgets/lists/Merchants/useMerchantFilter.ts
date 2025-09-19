import { useMerchantsListWithoutPagination } from "@/hooks";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { useListContext, useTranslate } from "react-admin";

const useMerchantFilter = () => {
    const { filterValues, setFilters, displayedFilters, setPage, total } = useListContext();
    const { merchantData, merchantsLoadingProcess } = useMerchantsListWithoutPagination();
    const translate = useTranslate();

    const [merchantId, setMerchantId] = useState(filterValues?.id || "");
    const [merchantValue, setMerchantValue] = useState("");

    useEffect(() => {
        if (merchantData && filterValues?.id) {
            const foundMerchant = merchantData?.find(merchant => merchant.id === filterValues?.id)?.name;

            if (foundMerchant) {
                setMerchantValue(foundMerchant);
            } else {
                setFilters({}, displayedFilters, true);
                setMerchantValue("");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [merchantData]);

    useEffect(() => {
        if (total === 0) {
            setFilters({}, displayedFilters, true);
            setMerchantValue("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [total]);

    const onPropertySelected = debounce((value: string, type: "id") => {
        if (value) {
            setFilters({ ...filterValues, [type]: value, sort: "name", asc: "ASC" }, displayedFilters, true);
        } else {
            Reflect.deleteProperty(filterValues, type);
            setFilters(filterValues, displayedFilters, true);
        }
        setPage(1);
    }, 300);

    const onMerchantChanged = (merchant: string) => {
        setMerchantId(merchant);
        onPropertySelected(merchant, "id");
    };

    const clearFilters = () => {
        setMerchantId("");
        setMerchantValue("");
        setFilters({}, displayedFilters, true);
        setPage(1);
    };

    return {
        translate,
        merchantData,
        merchantsLoadingProcess,
        merchantId,
        onMerchantChanged,
        merchantValue,
        setMerchantValue,
        clearFilters
    };
};

export default useMerchantFilter;
