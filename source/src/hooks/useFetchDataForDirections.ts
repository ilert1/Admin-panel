import { useDataProvider } from "react-admin";
import { useQuery } from "react-query";

export const useFetchDataForDirections = () => {
    const dataProvider = useDataProvider();

    const { data: currencies, isLoading: currenciesLoading } = useQuery(["currencies"], () =>
        dataProvider.getList("currency", {
            pagination: {
                perPage: 1000000,
                page: 1
            },
            sort: {
                field: "code",
                order: "ASC"
            },
            filter: undefined
        })
    );

    const { data: merchants, isLoading: merchantsLoading } = useQuery(["merchants"], () =>
        dataProvider.getList("merchant", {
            pagination: {
                perPage: 10000000,
                page: 1
            },
            sort: {
                field: "name",
                order: "ASC"
            },
            filter: undefined
        })
    );

    const { data: providers, isLoading: providersLoading } = useQuery(["providers"], () =>
        dataProvider.getList("provider", {
            pagination: {
                perPage: 10000000,
                page: 1
            },
            sort: {
                field: "name",
                order: "ASC"
            },
            filter: undefined
        })
    );

    return {
        currencies,
        merchants,
        providers,
        isLoading: currenciesLoading || merchantsLoading || providersLoading
    };
};
