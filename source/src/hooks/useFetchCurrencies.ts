import { CurrenciesDataProvider } from "@/data";
import { useQuery } from "@tanstack/react-query";

export const useFetchCurrencies = () => {
    const dataProvider = new CurrenciesDataProvider();

    const { isLoading, data } = useQuery<{ data: Dictionaries.Currency[] }>({
        queryKey: ["currencies", "useFetchCurrencies"],
        queryFn: async ({ signal }) => {
            return await dataProvider.fetchDicCurrencies(signal);
        }
    });

    return { isLoading, data };
};
