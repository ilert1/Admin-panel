import { MerchantsDataProvider } from "@/data";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { usePermissions } from "react-admin";

export const useFetchMerchants = () => {
    const { permissions } = usePermissions();
    const merchantsDataProvider = new MerchantsDataProvider();

    const {
        isLoading: isMerchantsLoading,
        isFetching: isMerchantsFetching,
        data: merchantData,
        error
    } = useQuery({
        queryKey: ["merchants", "getListWithoutPagination"],
        queryFn: async ({ signal }) => await merchantsDataProvider.getListWithoutPagination("merchant", signal),
        enabled: permissions === "admin",
        select: data => data?.data || []
    });

    const merchantsLoadingProcess = useMemo(
        () => isMerchantsLoading || isMerchantsFetching,
        [isMerchantsLoading, isMerchantsFetching]
    );

    return { merchantData, isMerchantsLoading, merchantsLoadingProcess, error };
};
