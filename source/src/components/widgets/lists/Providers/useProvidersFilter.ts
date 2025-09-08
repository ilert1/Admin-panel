import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { useListContext, useTranslate } from "react-admin";
import { useProvidersListWithoutPagination } from "@/hooks";

const useProvidersFilter = () => {
    const translate = useTranslate();

    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();
    const { providersData, providersLoadingProcess } = useProvidersListWithoutPagination();

    const [providerId, setProviderId] = useState(filterValues?.id || "");
    const [providerName, setProviderName] = useState("");

    useEffect(() => {
        if (providersData) {
            setProviderName(providersData?.find(provider => provider.id === filterValues?.id)?.name || "");
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

    const onProviderIdChanged = (provider: string) => {
        setProviderId(provider);
        onPropertySelected(provider, "id");
    };

    const onProviderNameChanged = (provider: string) => {
        setProviderName(provider);
    };

    const clearFilters = () => {
        setProviderId("");
        setProviderName("");
        setFilters({}, displayedFilters, true);
        setPage(1);
    };

    return {
        translate,
        providersData,
        providersLoadingProcess,
        providerId,
        onProviderIdChanged,
        providerName,
        onProviderNameChanged,
        clearFilters
    };
};

export default useProvidersFilter;
