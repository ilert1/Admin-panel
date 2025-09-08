import { CurrenciesDataProvider } from "@/data";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useCurrenciesListWithoutPagination = (disabled?: boolean, staleTime?: number) => {
    const currenciesDataProvider = new CurrenciesDataProvider();

    const {
        data: currenciesData,
        isLoading: isCurrenciesLoading,
        isFetching: isCurrenciesFetching
    } = useQuery({
        queryKey: ["currencies", "getListWithoutPagination"],
        queryFn: async ({ signal }) => await currenciesDataProvider.getListWithoutPagination("currency", signal),
        enabled: !disabled,
        select: data => data?.data,
        staleTime: staleTime ? staleTime : 0
    });

    const currenciesLoadingProcess = useMemo(
        () => isCurrenciesLoading || isCurrenciesFetching,
        [isCurrenciesFetching, isCurrenciesLoading]
    );

    return { currenciesData, isCurrenciesLoading, currenciesLoadingProcess };
};
