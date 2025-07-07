import { useFetchMerchants } from "./useFetchMerchants";

export const useGetMerchantData = () => {
    const { isMerchantsLoading, merchantData } = useFetchMerchants();

    const getMerchantId = (id: string) => {
        const merch = merchantData?.find(el => el.id === id);
        return merch?.id ?? "";
    };

    const getMerchantIdAndName = (id: string) => {
        const merch = merchantData?.find(el => el.id === id);
        return { id: merch?.id, name: merch?.name };
    };

    return { isMerchantsLoading, getMerchantId, getMerchantIdAndName };
};
