import { useFetchMerchants } from "./useFetchMerchants";

export const useGetMerchantData = () => {
    const { isLoading: isLoadingMerchants, merchantsList } = useFetchMerchants();

    const getMerchantId = (id: string) => {
        const merch = merchantsList.find(el => el.id === id);
        return merch?.id ?? "";
    };

    const getMerchantIdAndName = (id: string) => {
        const merch = merchantsList.find(el => el.id === id);
        return { id: merch?.id, name: merch?.name };
    };

    return { isLoadingMerchants, getMerchantId, getMerchantIdAndName };
};
