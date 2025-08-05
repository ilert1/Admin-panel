import { useProvidersListWithoutPagination } from "@/hooks";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { useListContext, useTranslate } from "react-admin";

const useProvidersFilter = () => {
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();
    const { providersData, providersLoadingProcess } = useProvidersListWithoutPagination();
    const translate = useTranslate();

    const [providerId, setProviderId] = useState(filterValues?.id || "");
    const [providerValue, setProviderValue] = useState("");

    useEffect(() => {
        if (providersData) {
            setProviderValue(providersData?.find(provider => provider.id === filterValues?.id)?.name || "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [providersData]);

    const onPropertySelected = debounce((value: string, type: "id") => {
        if (value) {
            setFilters({ ...filterValues, [type]: value, sort: "name", asc: "ASC" }, displayedFilters, true);
        } else {
            Reflect.deleteProperty(filterValues, type);
            setFilters(filterValues, displayedFilters, true);
        }
        setPage(1);
    }, 300);

    const onProviderChanged = (provider: string) => {
        setProviderId(provider);
        onPropertySelected(provider, "id");
    };

    const clearFilters = () => {
        setProviderId("");
        setProviderValue("");
        setFilters({}, displayedFilters, true);
        setPage(1);
    };

    return {
        translate,
        providersData,
        providersLoadingProcess,
        providerId,
        onProviderChanged,
        providerValue,
        setProviderValue,
        clearFilters
    };
};

export default useProvidersFilter;
