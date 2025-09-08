import { TerminalsDataProvider } from "@/data";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useTerminalsListWithoutPagination = (providerName?: string) => {
    const terminalsDataProvider = new TerminalsDataProvider();

    const {
        data: terminalsData,
        isLoading: isTerminalsLoading,
        isFetching: isTerminalsFetching
    } = useQuery({
        queryKey: ["terminals", "getListWithoutPagination", ...(providerName !== undefined ? [providerName] : [])],
        queryFn: ({ signal }) =>
            providerName
                ? terminalsDataProvider.getListWithoutPagination("terminals", ["provider"], [providerName], signal)
                : terminalsDataProvider.getListWithoutPagination("terminals", [], [], signal),
        enabled: providerName !== undefined ? !!providerName : true,
        select: data => data.data
    });

    const terminalsLoadingProcess = useMemo(
        () => isTerminalsLoading || isTerminalsFetching,
        [isTerminalsFetching, isTerminalsLoading]
    );

    return { terminalsData, isTerminalsLoading, terminalsLoadingProcess };
};
