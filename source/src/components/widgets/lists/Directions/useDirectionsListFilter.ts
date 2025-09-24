import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { useListContext } from "react-admin";
import { useMerchantsListWithoutPagination, useProvidersListWithoutPagination } from "@/hooks";

const useDirectionsListFilter = () => {
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();
    const { merchantData, merchantsLoadingProcess } = useMerchantsListWithoutPagination();
    const { providersData, providersLoadingProcess } = useProvidersListWithoutPagination();

    const [merchantValue, setMerchantValue] = useState("");
    const [providerValue, setProviderValue] = useState("");

    useEffect(() => {
        if (merchantData && filterValues?.merchant) {
            const foundMerchant = merchantData.find(merchant => merchant.id === filterValues?.merchant)?.name;

            if (foundMerchant) {
                setMerchantValue(foundMerchant);
            } else {
                Reflect.deleteProperty(filterValues, "merchant");
                setFilters(filterValues, displayedFilters, true);
                setMerchantValue("");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [merchantData]);

    useEffect(() => {
        if (providersData && filterValues?.provider) {
            const foundProvider = providersData.find(provider => provider.name === filterValues?.provider)?.name;

            if (foundProvider) {
                setProviderValue(foundProvider);
            } else {
                Reflect.deleteProperty(filterValues, "provider");
                setFilters(filterValues, displayedFilters, true);
                setProviderValue("");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [providersData]);

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
        onPropertySelected(merchant, "merchant");
    };

    const onProviderChanged = (provider: string) => {
        setProviderValue(provider);
        onPropertySelected(provider, "provider");
    };

    const clearFilters = () => {
        setMerchantValue("");
        setProviderValue("");
        setFilters({}, displayedFilters, true);
        setPage(1);
    };

    return {
        merchantData,
        merchantsLoadingProcess,
        merchantValue,
        setMerchantValue,
        onMerchantChanged,
        clearFilters,
        providerValue,
        onProviderChanged,
        providersData,
        providersLoadingProcess
    };
};

export default useDirectionsListFilter;
