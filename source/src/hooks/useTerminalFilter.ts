import { useEffect, useMemo, useState } from "react";
import { useListContext, useTranslate } from "react-admin";
import { ProvidersDataProvider } from "@/data/providers";
import { debounce } from "lodash";
import { useQuery } from "@tanstack/react-query";
import { TerminalsDataProvider } from "@/data";

const useTerminalFilter = () => {
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();
    const providersDataProvider = new ProvidersDataProvider();
    const terminalsDataProvider = new TerminalsDataProvider();
    const translate = useTranslate();

    const [providerName, setProviderName] = useState(filterValues?.provider || "");
    const [terminalName, setTerminalName] = useState(filterValues?.verbose_name || "");

    const {
        data: providersData,
        isLoading: isProvidersLoading,
        isFetching: isProvidersFetching
    } = useQuery({
        queryKey: ["providers", "filter"],
        queryFn: () => providersDataProvider.getListWithoutPagination(),
        select: data => data.data
    });

    const {
        data: terminalsData,
        isLoading: isTerminalsLoading,
        isFetching: isTerminalsFetching,
        refetch: refetchTerminalsData
    } = useQuery({
        queryKey: ["terminals", "filter"],
        queryFn: () => {
            if (!providerName) {
                return terminalsDataProvider.getListWithoutPagination();
            }

            return terminalsDataProvider.getListWithoutPagination(["provider"], [providerName]);
        },
        select: data => data.data
    });

    useEffect(() => {
        refetchTerminalsData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [providerName]);

    const providersLoadingProcess = useMemo(
        () => isProvidersLoading || isProvidersFetching,
        [isProvidersFetching, isProvidersLoading]
    );

    const terminalsLoadingProcess = useMemo(
        () => isTerminalsLoading || isTerminalsFetching,
        [isTerminalsFetching, isTerminalsLoading]
    );

    const onPropertySelected = debounce((value: string, type: "verbose_name" | "provider") => {
        if (value) {
            setFilters({ ...filterValues, [type]: value }, displayedFilters, true);
        } else {
            Reflect.deleteProperty(filterValues, type);
            setFilters(filterValues, displayedFilters, true);
        }
        setPage(1);
    }, 300);

    const onProviderChanged = (provider: string) => {
        setProviderName(provider);
        onPropertySelected(provider, "provider");
    };

    const onTerminalChanged = (terminal: string) => {
        setTerminalName(terminal);
        onPropertySelected(terminal, "verbose_name");
    };

    const onClearFilters = () => {
        setFilters({}, displayedFilters, true);
        setPage(1);
        setProviderName("");
        setTerminalName("");
    };

    return {
        providerName,
        onProviderChanged,
        terminalName,
        onTerminalChanged,
        providersData,
        providersLoadingProcess,
        terminalsData,
        terminalsLoadingProcess,
        translate,
        onClearFilters
    };
};

export default useTerminalFilter;
