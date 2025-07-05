import { MerchantsDataProvider } from "@/data";
import { useQuery } from "@tanstack/react-query";
import { usePermissions } from "react-admin";

export const useFetchMerchants = () => {
    const { permissions } = usePermissions();
    const merchantsDataProvider = new MerchantsDataProvider();

    const {
        isLoading,
        data: merchantData,
        error
    } = useQuery({
        queryKey: ["merchants", "getListWithoutPagination"],
        queryFn: async ({ signal }) => await merchantsDataProvider.getListWithoutPagination("merchant", signal),
        enabled: permissions === "admin",
        select: data => data?.data || []
    });

    return { merchantsList: merchantData || [], isLoading, error };
};
