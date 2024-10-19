import { useDataProvider } from "react-admin";
import { useQuery } from "react-query";

export default function fetchDictionaries(): Dictionaries.DataObject {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const dataProvider = useDataProvider();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data } = useQuery(["dictionaries"], () => dataProvider.getDictionaries(), {
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10
    });
    return data;
}
