import { CurrenciesDataProvider } from "@/data";
import { useQuery } from "@tanstack/react-query";

export const useFetchDicCurrencies = () => {
    const dataProvider = new CurrenciesDataProvider();

    const { isLoading, data } = useQuery<{ data: Dictionaries.Currency[] }>({
        queryKey: ["dictionaries", "currencies"],
        queryFn: async ({ signal }) => {
            return await dataProvider.fetchDicCurrencies(signal);
        }
    });

    return { isLoading, data };
};
