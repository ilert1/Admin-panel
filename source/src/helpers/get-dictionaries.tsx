import { useDataProvider } from "react-admin";
import { useQueryWithAuth } from "@/hooks/useQueryWithAuth";

export default function fetchDictionaries(): Dictionaries.DataObject | undefined {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const dataProvider = useDataProvider();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data } = useQueryWithAuth<Dictionaries.DataObject>({
        queryKey: ["dictionaries"],
        queryFn: ({ signal }) =>
            dataProvider.getDictionaries("dictionaries", signal) as Promise<Dictionaries.DataObject>,
        staleTime: 1000 * 60 * 10
    });

    return data;
}
