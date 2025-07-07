import { ProvidersDataProvider } from "@/data";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useProvidersListWithoutPagination = (disabled?: boolean) => {
    const providersDataProvider = new ProvidersDataProvider();

    const {
        data: providersData,
        isLoading: isProvidersLoading,
        isFetching: isProvidersFetching
    } = useQuery({
        queryKey: ["providers", "getListWithoutPagination"],
        queryFn: async ({ signal }) => await providersDataProvider.getListWithoutPagination("provider", signal),
        enabled: !disabled,
        select: data => data?.data
    });

    const providersLoadingProcess = useMemo(
        () => isProvidersLoading || isProvidersFetching,
        [isProvidersFetching, isProvidersLoading]
    );

    return { providersData, isProvidersLoading, providersLoadingProcess };
};
