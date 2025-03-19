import { useQuery } from "@tanstack/react-query";

import { API_URL } from "@/data/base";

export const useFetchCurrencies = () => {
    const { isLoading, data } = useQuery<{ data: Dictionaries.Currency[] }>({
        queryKey: ["currencies"],
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
