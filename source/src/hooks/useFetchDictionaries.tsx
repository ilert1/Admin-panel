import { useDataProvider } from "react-admin";
import { useQuery } from "@tanstack/react-query";

export function useFetchDictionaries(): Dictionaries.DataObject | undefined {
    const dataProvider = useDataProvider();

    const { data } = useQuery<Dictionaries.DataObject>({
        queryKey: ["dictionaries"],
        queryFn: ({ signal }) => dataProvider.getDictionaries("dictionaries", signal),
        staleTime: 1000 * 60 * 10
    });

    return data;
}
