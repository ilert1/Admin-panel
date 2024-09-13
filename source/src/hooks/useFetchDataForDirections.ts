// import { CurrenciesDataProvider, DirectionsDataProvider, MerchantsDataProvider, ProvidersDataProvider } from "@/data";
// import { useDataProvider } from "react-admin";
// import { useQuery } from "react-query";

// export const useFetchDataForDirections = async () => {
//     const dataProvider = useDataProvider();

//     const currenciesDataProvider = new CurrenciesDataProvider();
//     const merchantsDataProvider = new MerchantsDataProvider();
//     const providersDataProvider = new ProvidersDataProvider();

//     const currencies = await directionsDataProvider.getListWithoutPagination("currency");
//     const merchants = await merchantsDataProvider.getListWithoutPagination("currency");
//     const providers = await providersDataProvider.getListWithoutPagination("currency");

//     const { data: merchants, isLoading: merchantsLoading } = useQuery(["merchants"], () =>
//         dataProvider.getList("merchant", {
//             pagination: {
//                 perPage: 10000000,
//                 page: 1
//             },
//             sort: {
//                 field: "name",
//                 order: "ASC"
//             },
//             filter: undefined
//         })
//     );

//     const { data: providers, isLoading: providersLoading } = useQuery(["providers"], () =>
//         dataProvider.getList("provider", {
//             pagination: {
//                 perPage: 10000000,
//                 page: 1
//             },
//             sort: {
//                 field: "name",
//                 order: "ASC"
//             },
//             filter: undefined
//         })
//     );

//     return {
//         currencies,
//         merchants,
//         providers,
//         isLoading: currenciesLoading || merchantsLoading || providersLoading
//     };
// };

import { useState, useEffect } from "react";
import { CurrenciesDataProvider, MerchantsDataProvider, ProvidersDataProvider } from "@/data";

export const useFetchDataForDirections = () => {
    const [currencies, setCurrencies] = useState<{ data: Currencies.Currency[]; total: any }>({ data: [], total: 0 });
    const [merchants, setMerchants] = useState<{ data: Merchant[]; total: any }>({ data: [], total: 0 });
    const [providers, setProviders] = useState<{ data: Provider[]; total: any }>({ data: [], total: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currenciesDataProvider = new CurrenciesDataProvider();
                const merchantsDataProvider = new MerchantsDataProvider();
                const providersDataProvider = new ProvidersDataProvider();

                const currenciesData = await currenciesDataProvider.getListWithoutPagination("currency");
                const merchantsData = await merchantsDataProvider.getListWithoutPagination("merchant");
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
    }, []);

    return { currencies, merchants, providers, isLoading, error };
};
