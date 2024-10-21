import { fetchUtils } from "react-admin";

export const API_URL = import.meta.env.VITE_ENIGMA_URL;

export enum FeesResource {
    DIRECTION = "direction",
    MERCHANT = "merchant"
}
interface FeesDataProviderProps {
    id: string;
    resource: FeesResource;
}
export const feesDataProvider = (props: FeesDataProviderProps) => {
    const { id, resource } = props;

    const addFee = (body: ) => {};

    const removeFee = async (fee_id: string) => {
        const json = await fetchUtils.fetchJson(`${API_URL}/${resource}/fee/${fee_id}`, {
            method: "DELETE",
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });
        if (!json.json.success) {
            throw new Error("Wrong id or fee id");
        }
    };

    return { addFee, removeFee };
};
