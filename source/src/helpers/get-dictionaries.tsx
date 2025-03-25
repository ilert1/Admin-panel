import { useDataProvider } from "react-admin";
import { useQuery } from "@tanstack/react-query";

export default function fetchDictionaries(): Dictionaries.DataObject {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const dataProvider = useDataProvider();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data } = useQuery({
        queryKey: ["dictionaries"],
        queryFn: ({ signal }) => dataProvider.getDictionaries("dictionaries", signal),
        staleTime: 1000 * 60 * 10
    });

    return data;
}
