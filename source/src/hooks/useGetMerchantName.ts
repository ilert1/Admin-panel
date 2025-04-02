import { useFetchMerchants } from "./useFetchMerchants";

export const useGetMerchantIdByName = () => {
    const { isLoading: isLoadingMerchants, merchantsList } = useFetchMerchants();

    const getMerchantId = (merchantName: string) => {
        const merch = merchantsList.find(el => el.name === merchantName);
        return merch?.id ?? "";
    };

    return { isLoadingMerchants, getMerchantId };
};
