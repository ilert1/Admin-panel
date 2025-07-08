import { MerchantsDataProvider } from "@/data";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { usePermissions } from "react-admin";

export const useMerchantsListWithoutPagination = (disabled?: boolean) => {
    const { permissions } = usePermissions();
    const merchantsDataProvider = new MerchantsDataProvider();

    const {
        data: merchantData,
        isLoading: isMerchantsLoading,
        isFetching: isMerchantsFetching
    } = useQuery({
        queryKey: ["merchants", "getListWithoutPagination"],
        queryFn: async ({ signal }) => await merchantsDataProvider.getListWithoutPagination("merchant", signal),
        enabled: permissions === "admin" && !disabled,
        select: data => data?.data || []
    });

    const merchantsLoadingProcess = useMemo(
        () => isMerchantsLoading || isMerchantsFetching,
        [isMerchantsLoading, isMerchantsFetching]
    );

    return { merchantData, isMerchantsLoading, merchantsLoadingProcess };
};
