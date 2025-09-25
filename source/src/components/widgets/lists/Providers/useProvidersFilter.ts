import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { useListContext, useTranslate } from "react-admin";
import { useProvidersListWithoutPagination } from "@/hooks";

const useProvidersFilter = () => {
    const translate = useTranslate();

    const { filterValues, setFilters, displayedFilters, setPage, total } = useListContext();
    const { providersData, providersLoadingProcess } = useProvidersListWithoutPagination();

    const [providerName, setProviderName] = useState("");

    useEffect(() => {
        if (providersData && filterValues?.id) {
            const foundProvider = providersData?.find(provider => provider.id === filterValues?.id)?.name;

            if (foundProvider) {
                setProviderName(foundProvider);
            } else {
                setFilters({}, displayedFilters, true);
                setProviderName("");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [providersData]);

    useEffect(() => {
        if (total === 0) {
            setFilters({}, displayedFilters, true);
            setProviderName("");
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

    const onProviderIdChanged = (provider: string) => {
        onPropertySelected(provider, "id");
    };

    const onProviderNameChanged = (provider: string) => {
        setProviderName(provider);
    };

    const clearFilters = () => {
        setProviderName("");
        setFilters({}, displayedFilters, true);
        setPage(1);
    };

    return {
        translate,
        providersData,
        providersLoadingProcess,
        onProviderIdChanged,
        providerName,
        onProviderNameChanged,
        clearFilters
    };
};

export default useProvidersFilter;
