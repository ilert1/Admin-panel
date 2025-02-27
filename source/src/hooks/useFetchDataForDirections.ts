import { useState, useEffect } from "react";
import { usePermissions } from "react-admin";
import { CurrenciesDataProvider, MerchantsDataProvider, ProvidersDataProvider } from "@/data";
import { Merchant } from "@/api/enigma/blowFishEnigmaAPIService.schemas";

export const useFetchDataForDirections = () => {
    const [currencies, setCurrencies] = useState<{ data: Currencies.Currency[]; total: number }>({
        data: [],
        total: 0
    });
    const [merchants, setMerchants] = useState<{ data: Merchant[]; total: number }>({ data: [], total: 0 });
    const [providers, setProviders] = useState<{ data: Provider[]; total: number }>({ data: [], total: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const { permissions } = usePermissions();
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (permissions !== "admin") {
                setIsLoading(false);
                return;
            }
            try {
                const currenciesDataProvider = new CurrenciesDataProvider();
                const merchantsDataProvider = new MerchantsDataProvider();
                const providersDataProvider = new ProvidersDataProvider();

                const currenciesData = await currenciesDataProvider.getListWithoutPagination("currency");
                const merchantsData = await merchantsDataProvider.getListWithoutPagination();
                const providersData = await providersDataProvider.getListWithoutPagination("provider");

                setCurrencies(currenciesData);
                setMerchants(merchantsData);
                setProviders(providersData);
            } catch (error) {
                setError(error as Error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { currencies, merchants, providers, isLoading, error };
};
