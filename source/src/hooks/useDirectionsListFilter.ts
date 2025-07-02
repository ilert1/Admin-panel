import { debounce } from "lodash";
import { useState } from "react";
import { useListContext } from "react-admin";
import { useQuery } from "@tanstack/react-query";
import { ProvidersDataProvider } from "@/data";

const useDirectionsListFilter = () => {
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();
    const dataProvider = new ProvidersDataProvider();

    const [merchantId, setMerchantId] = useState(filterValues?.merchant || "");
    const [provider, setProvider] = useState(filterValues?.provider || "");

    const { data: providers, isLoading: providersLoading } = useQuery({
        queryKey: ["providers"],
        queryFn: () => dataProvider.getListWithoutPagination(),
        select: data => data.data
    });

    const onPropertySelected = debounce((value: string, type: "merchant" | "provider") => {
        if (value) {
            setFilters({ ...filterValues, [type]: value, sort: "name", asc: "ASC" }, displayedFilters, true);
        } else {
            Reflect.deleteProperty(filterValues, type);
            setFilters(filterValues, displayedFilters, true);
        }
        setPage(1);
    }, 300);

    const onAccountChanged = (merchant: string) => {
        setMerchantId(merchant);
        onPropertySelected(merchant, "merchant");
    };

    const onProviderChanged = (provider: string) => {
        setProvider(provider);
        onPropertySelected(provider, "provider");
    };

    const clearFilters = () => {
        setMerchantId("");
        setProvider("");
        setFilters({}, displayedFilters, true);
        setPage(1);
    };

    return {
        merchantId,
        onAccountChanged,
        clearFilters,
        provider,
        onProviderChanged,
        providers,
        providersLoading
    };
};

export default useDirectionsListFilter;
