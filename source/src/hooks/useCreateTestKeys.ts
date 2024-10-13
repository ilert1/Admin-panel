import { useEffect, useState } from "react";
import { fetchUtils } from "react-admin";

const API_URL = import.meta.env.VITE_ENIGMA_URL;

export const useCreateTestKeys = (isModalOpen: boolean) => {
    const [isLoading, setIsLoading] = useState(true);
    const [privateKey, setPrivateKey] = useState<string>("");
    const [publicKey, setPublicKey] = useState<string>("");

    useEffect(() => {
        if (!isModalOpen) return;
        const createTestKeys = async () => {
            setIsLoading(true);
            const { json } = await fetchUtils.fetchJson(`${API_URL}/pki/keygen`, {
                method: "POST",
                user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
            });
            setPrivateKey(json.data.private_key);
            setPublicKey(json.data.public_key);
            setIsLoading(false);
        };
        createTestKeys();
    }, [isModalOpen]);

    return { privateKey, publicKey, isLoading, setIsLoading };
};
