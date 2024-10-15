import { useEffect, useState } from "react";
import { fetchUtils } from "react-admin";

const API_URL = import.meta.env.VITE_ENIGMA_URL;

export const useCreateTestKeys = (isModalOpen: boolean, isTest: boolean, name: string) => {
    const [isLoading, setIsLoading] = useState(true);
    const [privateKey, setPrivateKey] = useState<string>("");
    const [publicKey, setPublicKey] = useState<string>("");

    useEffect(() => {
        if (!isModalOpen) return;
        if (isTest) {
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
        } else {
            const realKeysGen = async () => {
                try {
                    const { json } = await fetchUtils.fetchJson(`${API_URL}/provider/${name}`, {
                        method: "PATCH",
                        user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
                    });
                    console.log(json);
                    setPrivateKey(json.data.keypair.private_key);
                    setPublicKey(json.data.keypair.public_key);
                    setIsLoading(false);
                } catch (error) {
                    /* empty */
                }
            };
            realKeysGen();
        }
    }, [isModalOpen, isTest]);

    return { privateKey, publicKey, isLoading, setIsLoading };
};
