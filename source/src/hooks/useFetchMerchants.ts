import { Merchant } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useQueryWithAuth } from "@/hooks/useQueryWithAuth";
import { useDataProvider, usePermissions } from "react-admin";

export const useFetchMerchants = () => {
    const { permissions } = usePermissions();

    const dataProvider = useDataProvider();
    const {
        isLoading,
        data: merchantData,
        error
    } = useQueryWithAuth({
        queryKey: ["merchant", "getList", "MerchantSelectFilter"],
        queryFn: async ({ signal }) =>
            await dataProvider.getList<Merchant>("merchant", {
                pagination: { perPage: 10000, page: 1 },
                filter: { sort: "name", asc: "ASC" },
                signal
            }),
        enabled: permissions === "admin",
        select: data => data?.data
    });

    return { merchantsList: merchantData || [], isLoading, error };
};
