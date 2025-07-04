import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useListContext, useTranslate } from "react-admin";
import { MerchantsDataProvider } from "@/data";
import { useQuery } from "@tanstack/react-query";

const useMerchantFilter = () => {
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();
    const translate = useTranslate();
    const merchantsDataProvider = new MerchantsDataProvider();

    const {
        data: merchantData,
        isFetching: isMerchantsFetching,
        isLoading: isMerchantsLoading
    } = useQuery({
        queryKey: ["merchants", "getListWithoutPagination"],
        queryFn: async ({ signal }) => await merchantsDataProvider.getListWithoutPagination("merchant", signal),
        select: data => data?.data
    });

    const [merchantId, setMerchantId] = useState(filterValues?.id || "");
    const [merchantValue, setMerchantValue] = useState("");

    useEffect(() => {
        if (merchantData) {
            setMerchantValue(merchantData?.find(merchant => merchant.id === filterValues?.id)?.name || "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [merchantData]);

    const merchantsLoadingProcess = useMemo(
        () => isMerchantsLoading || isMerchantsFetching,
        [isMerchantsLoading, isMerchantsFetching]
    );

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
