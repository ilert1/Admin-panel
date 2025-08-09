import { useDataProvider } from "react-admin";
import { useQuery } from "@tanstack/react-query";

export function useFetchDictionaries(): Dictionaries.DataObject | undefined {
    const dataProvider = useDataProvider();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const { data } = useQuery<Dictionaries.DataObject>({
        queryKey: ["dictionaries"],
        enabled: Boolean(user?.name),
        queryFn: ({ signal }) => dataProvider.getDictionaries("dictionaries", signal),
        staleTime: 1000 * 60 * 10
    });

    return data;
}
