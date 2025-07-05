import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useListContext } from "react-admin";
import { useQuery } from "@tanstack/react-query";
import { MerchantsDataProvider, ProvidersDataProvider } from "@/data";

const useDirectionsListFilter = () => {
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();
    const providersDataProvider = new ProvidersDataProvider();
    const merchantsDataProvider = new MerchantsDataProvider();

    const [merchantId, setMerchantId] = useState(filterValues?.merchant || "");
    const [merchantValue, setMerchantValue] = useState("");
    const [provider, setProvider] = useState(filterValues?.provider || "");

    const {
        data: merchantData,
        isFetching: isMerchantsFetching,
        isLoading: isMerchantsLoading
    } = useQuery({
        queryKey: ["merchants", "getListWithoutPagination"],
        queryFn: async ({ signal }) => await merchantsDataProvider.getListWithoutPagination("merchant", signal),
        select: data => data?.data
    });

    const { data: providers, isLoading: providersLoading } = useQuery({
        queryKey: ["providers"],
        queryFn: async ({ signal }) => await providersDataProvider.getListWithoutPagination("provider", signal),
        select: data => data.data
    });

    useEffect(() => {
        if (merchantData) {
            setMerchantValue(merchantData?.find(merchant => merchant.id === filterValues?.merchant)?.name || "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [merchantData]);

    const merchantsLoadingProcess = useMemo(
        () => isMerchantsLoading || isMerchantsFetching,
        [isMerchantsLoading, isMerchantsFetching]
    );

    const onPropertySelected = debounce((value: string, type: "merchant" | "provider") => {
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
        onPropertySelected(merchant, "merchant");
    };

    const onProviderChanged = (provider: string) => {
        setProvider(provider);
        onPropertySelected(provider, "provider");
    };

    const clearFilters = () => {
        setMerchantId("");
        setMerchantValue("");
        setProvider("");
        setFilters({}, displayedFilters, true);
        setPage(1);
    };

    return {
        merchantData,
        merchantsLoadingProcess,
        merchantValue,
        setMerchantValue,
        merchantId,
        onMerchantChanged,
        clearFilters,
        provider,
        onProviderChanged,
        providers,
        providersLoading
    };
};

export default useDirectionsListFilter;
