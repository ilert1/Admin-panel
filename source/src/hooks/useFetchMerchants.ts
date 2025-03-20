import { useState, useEffect } from "react";

import { MerchantsDataProvider } from "@/data";
import { Merchant } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useQuery } from "@tanstack/react-query";
import { useDataProvider } from "react-admin";

export const useFetchMerchants = () => {
    const dataProvider = useDataProvider();
    const {
        isLoading,
        data: merchantData,
        error
    } = useQuery({
        queryKey: ["merchant", "getList", "MerchantSelectFilter"],
        queryFn: async ({ signal }) =>
            await dataProvider.getList<Merchant>("merchant", {
                pagination: { perPage: 10000, page: 1 },
                filter: { sort: "name", asc: "ASC" },
                signal
            }),
        select: data => data?.data
    });

    return { merchantsList: merchantData || [], isLoading, error };
};
