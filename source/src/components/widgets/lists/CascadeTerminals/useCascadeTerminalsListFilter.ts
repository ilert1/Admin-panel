import { useProvidersListWithoutPagination, useTerminalsListWithoutPagination } from "@/hooks";
import { useCascadesListWithoutPagination } from "@/hooks/useCascadesListWithoutPagination";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { useListContext, useTranslate } from "react-admin";

const useCascadeTerminalsListFilter = () => {
    const translate = useTranslate();
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();
    const { cascadesData, isCascadesLoading } = useCascadesListWithoutPagination();
    const { providersData, providersLoadingProcess } = useProvidersListWithoutPagination();

    const [providerName, setProviderName] = useState(localStorage.getItem("providerFromCascadeTerminals") || "");
    const [terminalName, setTerminalName] = useState("");
    const [cascadeName, setCascadeName] = useState("");

    const { terminalsData, terminalsLoadingProcess } = useTerminalsListWithoutPagination(providerName);

    useEffect(() => {
        if (cascadesData) {
            const foundCascade = cascadesData?.find(cascade => cascade.id === filterValues?.cascade_id);
            setCascadeName(foundCascade?.name ?? "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cascadesData]);

    useEffect(() => {
        if (terminalsData) {
            const foundTerminal = terminalsData?.find(terminal => terminal.terminal_id === filterValues?.terminal_id);
            setTerminalName(foundTerminal?.verbose_name ?? "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [terminalsData]);

    const onPropertySelected = debounce((value: string, type: "cascade_id" | "terminal_id") => {
        if (value) {
            setFilters({ [type]: value }, displayedFilters, true);
        } else {
            Reflect.deleteProperty(filterValues, type);
            setFilters(filterValues, displayedFilters, true);
        }
        setPage(1);
    }, 300);

    const onCascadeIdChanged = (id: string) => {
        if (providerName && terminalName) {
            setProviderName("");
            setTerminalName("");
        }

        setCascadeName(id);
        onPropertySelected(id, "cascade_id");
    };

    const onProviderChanged = (provider: string) => {
        localStorage.setItem("providerFromCascadeTerminals", provider);
        setProviderName(provider);
    };

    const onTerminalIdChanged = (terminalId: string) => {
        if (cascadeName) {
            setCascadeName("");
        }

        onPropertySelected(terminalId, "terminal_id");
    };

    const onClearFilters = () => {
        setFilters({}, displayedFilters, true);
        setPage(1);
        setProviderName("");
        setTerminalName("");
        setCascadeName("");
        localStorage.setItem("providerFromCascadeTerminals", "");
    };

    return {
        translate,
        onClearFilters,
        cascadesData,
        isCascadesLoading,
        providersData,
        providersLoadingProcess,
        terminalsData,
        terminalsLoadingProcess,
        cascadeName,
        setCascadeName,
        onCascadeIdChanged,
        providerName,
        onProviderChanged,
        terminalName,
        setTerminalName,
        onTerminalIdChanged
    };
};

export default useCascadeTerminalsListFilter;
