import { useListController } from "react-admin";

export const useGetCurrencies = () => {
    const { isLoading: isLoadingCurrencies, data: currencies } = useListController({
        resource: "currency",
        perPage: 100000,
        disableSyncWithLocation: true,
        queryOptions: {
            cacheTime: 1000 * 60 * 5,
            staleTime: 1000 * 60 * 10
        }
    });

    return { isLoadingCurrencies, currencies };
};
