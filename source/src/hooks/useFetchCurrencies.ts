import { useQueryWithAuth } from "@/hooks/useQueryWithAuth";

import { API_URL } from "@/data/base";

export const useFetchCurrencies = () => {
    const { isLoading, data } = useQueryWithAuth<{ data: Dictionaries.Currency[] }>({
        queryKey: ["currencies", "useFetchCurrencies"],
        queryFn: ({ signal }) =>
            fetch(`${API_URL}/dictionaries/curr`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access-token")}`
                },
                signal
            }).then(response => response.json())
    });

    return { isLoading, data };
};
