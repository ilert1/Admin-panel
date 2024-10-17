/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { fetchUtils, ShowControllerResult } from "react-admin";
const API_URL = import.meta.env.VITE_ENIGMA_URL;

interface FetchMerchantDirectionsProps {
    context: ShowControllerResult<Directions.Direction>;
}

export const fetchMerchantDirections = async (props: FetchMerchantDirectionsProps): Promise<Directions.Direction[]> => {
    const { context } = props;
    const [data, setData] = useState<Directions.Direction[]>([]);

    try {
        const { json }: { json: { success: boolean; error?: string; data: Directions.Direction[] } } =
            await fetchUtils.fetchJson(`${API_URL}/direction/merchant/${context?.record?.merchant.id}`, {
                user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
            });

        if (!json.success) {
            throw new Error(json.error);
        }

        setData(json.data);
    } catch (error) {
        /* empty */
    }

    return data;
};
