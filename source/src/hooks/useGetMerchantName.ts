import { useFetchMerchants } from "./useFetchMerchants";

export const useGetMerchantIdByName = () => {
    const { isLoading: isLoadingMerchants, merchantsList } = useFetchMerchants();

    const getMerchantId = (id: string) => {
        const merch = merchantsList.find(el => el.id === id);
        return merch?.id ?? "";
    };

    return { isLoadingMerchants, getMerchantId };
};
