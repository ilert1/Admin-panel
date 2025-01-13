import { useState, useEffect } from "react";

import { MerchantsDataProvider } from "@/data";

export const useFetchMerchants = () => {
    const [merchants, setMerchants] = useState<{ data: Merchant[]; total: number }>({ data: [], total: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const merchantsDataProvider = new MerchantsDataProvider();
                const merchantsData = await merchantsDataProvider.getListWithoutPagination("merchant");

                setMerchants(merchantsData);
            } catch (error) {
                setError(error as Error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return { merchantsList: merchants.data, isLoading, error };
};
