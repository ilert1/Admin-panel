import { fetchUtils } from "react-admin";

export const API_URL = import.meta.env.VITE_ENIGMA_URL;

export enum FeesResource {
    DIRECTION = "direction",
    MERCHANT = "merchant",
    TERMINAL = "terminal"
}
interface FeesDataProviderProps {
    id: string;
    resource: FeesResource;
    providerName?: string;
}
const feesDataProvider = (props: FeesDataProviderProps) => {
    const { resource, providerName } = props;
    let { id } = props;

    const setId = (newId: string) => {
        id = newId;
    };

    const addFee = async (body: Directions.FeeCreate) => {
        const json = await fetchUtils.fetchJson(
            `${API_URL}/${
                resource === FeesResource.TERMINAL ? "provider/" + providerName + "/" : ""
            }${resource}/${id}/fee`,
            {
                method: "PUT",
                user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` },
                body: JSON.stringify(body)
            }
        );

        if (!json.json.success) {
            if (String(json.json.error).includes("Currency")) throw new Error("Wrong id");
        }

        return json.json.data;
    };

    const removeFee = async (fee_id: string) => {
        const json = await fetchUtils.fetchJson(
            `${API_URL}/${
                resource === FeesResource.TERMINAL ? "provider/" + providerName + "/" : ""
            }${resource}/${id}/fee/${fee_id}`,
            {
                method: "DELETE",
                user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
            }
        );
        // console.log(json);

        if (!json.json.success) {
            throw new Error("Wrong id or fee id");
        }

        return json.json.data;
    };

    return { addFee, removeFee, setId };
};

export default feesDataProvider;
