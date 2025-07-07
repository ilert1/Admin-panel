import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { useListContext } from "react-admin";
import { useFetchMerchants } from "../../../../hooks/useFetchMerchants";
import { useProvidersListWithoutPagination } from "@/hooks/useProvidersListWithoutPagination";

const useDirectionsListFilter = () => {
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();
    const { merchantData, merchantsLoadingProcess } = useFetchMerchants();
    const { providersData, providersLoadingProcess } = useProvidersListWithoutPagination();

    const [merchantId, setMerchantId] = useState(filterValues?.merchant || "");
    const [merchantValue, setMerchantValue] = useState("");
    const [provider, setProvider] = useState(filterValues?.provider || "");

    useEffect(() => {
        if (merchantData) {
            setMerchantValue(merchantData?.find(merchant => merchant.id === filterValues?.merchant)?.name || "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [merchantData]);

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
        providersData,
        providersLoadingProcess
    };
};

export default useDirectionsListFilter;
