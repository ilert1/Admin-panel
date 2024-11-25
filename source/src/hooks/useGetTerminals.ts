import { useState } from "react";
import { fetchUtils, useTranslate } from "react-admin";
import { toast } from "sonner";

const ENIGMA_URL = import.meta.env.VITE_ENIGMA_URL;

export const useGetTerminals = () => {
    const translate = useTranslate();
    const [terminals, setTerminals] = useState<Directions.Terminal[]>([]);

    const getTerminals = async (name: string) => {
        try {
            const url = `${ENIGMA_URL}/provider/${name}/terminal`;
            const { json } = await fetchUtils.fetchJson(url, {
                user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
            });
            if (!json.success) {
                throw new Error("");
            }
            if (json.data.length === 0) {
                throw new Error("no_terminals");
            }
            setTerminals(json.data);
        } catch (error: any) {
            setTerminals([]);
            let message = "terminalError";
            if (error.message === "no_terminals") {
                message = "noTerminalsError";
            }
            toast.error("Error", {
                description: translate(`resources.direction.errors.${message}`),
                dismissible: true,
                duration: 3000
            });
        }
    };

    return { terminals, getTerminals };
};
