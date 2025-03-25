import { useAbortableListController } from "./useAbortableListController";
import { CurrencyWithId } from "@/data/currencies";

export const useGetCurrencies = () => {
    const { isLoading: isLoadingCurrencies, data: currencies } = useAbortableListController<CurrencyWithId>({
        resource: "currency",
        perPage: 100000,
        disableSyncWithLocation: true,
        queryOptions: {
            staleTime: 1000 * 60 * 10
        }
    });

    return { isLoadingCurrencies, currencies };
};
