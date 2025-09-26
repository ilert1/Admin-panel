import { useEffect, useState } from "react";
import { useListContext, useTranslate } from "react-admin";
import { debounce } from "lodash";
import { useProvidersListWithoutPagination, useTerminalsListWithoutPagination } from "@/hooks";

const useTerminalFilter = () => {
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();
    const { providersData, providersLoadingProcess } = useProvidersListWithoutPagination();
    const translate = useTranslate();

    const [providerName, setProviderName] = useState(filterValues?.provider || "");
    const [terminalFilterName, setTerminalFilterName] = useState("");

    const { terminalsData, terminalsLoadingProcess } = useTerminalsListWithoutPagination(providerName);

    useEffect(() => {
        if (terminalsData && filterValues?.terminal_id) {
            const foundTerm = terminalsData?.find(terminal => terminal.terminal_id === filterValues?.terminal_id);

            if (foundTerm) {
                setTerminalFilterName(foundTerm?.verbose_name);
            } else {
                Reflect.deleteProperty(filterValues, "terminal_id");
                setFilters(filterValues, displayedFilters, true);
                setTerminalFilterName("");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [terminalsData]);

    useEffect(() => {
        if (providersData && filterValues?.provider) {
            const foundProvider = providersData?.find(provider => provider.name === filterValues?.provider);

            if (!foundProvider) {
                setFilters({}, displayedFilters, true);
                setTerminalFilterName("");
                setProviderName("");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [providersData]);

    const onPropertySelected = debounce((value: string, type: "terminal_id" | "provider") => {
        const { ...newFilterValues } = filterValues;

        if (type === "provider" && newFilterValues?.["terminal_id"]) {
            setTerminalFilterName("");
            delete newFilterValues["terminal_id"];
        }

        if (value) {
            setFilters({ ...newFilterValues, [type]: value }, displayedFilters, true);
        } else {
            Reflect.deleteProperty(newFilterValues, type);
            setFilters(newFilterValues, displayedFilters, true);
        }
        setPage(1);
    }, 300);

    const onProviderChanged = (provider: string) => {
        setProviderName(provider);
        onPropertySelected(provider, "provider");
    };

    const onTerminalIdFieldChanged = (terminalId: string) => {
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
