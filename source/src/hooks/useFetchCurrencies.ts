import { API_URL } from "@/data/base";
import { useQuery } from "react-query";

export const useFetchCurrencies = () => {
    const { isLoading, data } = useQuery<{ data: Dictionaries.Currency[] }>("currencies", () =>
        fetch(`${API_URL}/dictionaries/curr`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        }).then(response => response.json())
    );

    return { isLoading, data };
};
