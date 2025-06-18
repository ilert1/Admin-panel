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
    const [terminalFilterId, setTerminalFilterId] = useState(filterValues?.terminal_id || "");
    const [terminalFilterName, setTerminalFilterName] = useState("");

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
        if (terminalsData) {
            setTerminalFilterName(
                terminalsData?.find(terminal => terminal.terminal_id === filterValues?.terminal_id)?.verbose_name || ""
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [terminalsData]);

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

    const onPropertySelected = debounce((value: string, type: "terminal_id" | "provider") => {
        if (value && type === "provider" && terminalFilterId && terminalFilterName) {
            setTerminalFilterId("");
            setTerminalFilterName("");
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { terminal_id, ...newFilterValues } = filterValues;
            setFilters({ ...newFilterValues, [type]: value }, displayedFilters, true);
        } else if (value) {
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

    const onTerminalIdFieldChanged = (terminalId: string) => {
        setTerminalFilterId(terminalId);
        onPropertySelected(terminalId, "terminal_id");
    };

    const onTerminalNameChanged = (terminal: string) => {
        setTerminalFilterName(terminal);
    };

    const onClearFilters = () => {
        setFilters({}, displayedFilters, true);
        setPage(1);
        setProviderName("");
        setTerminalFilterName("");
    };

    return {
        providerName,
        onProviderChanged,
        onTerminalIdFieldChanged,
        terminalFilterName,
        onTerminalNameChanged,
        providersData,
        providersLoadingProcess,
        terminalsData,
        terminalsLoadingProcess,
        translate,
        onClearFilters
    };
};

export default useTerminalFilter;
