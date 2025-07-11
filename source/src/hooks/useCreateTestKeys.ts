import { providerEndpointsAddKeypairByIdEnigmaV1ProviderProviderIdAddKeypairPatch } from "@/api/enigma/provider/provider";
import { keyGenEndpointsGenerateRsaKeypairEnigmaV1PkiKeygenGet } from "@/api/enigma/rsakey-pair/rsakey-pair";
import { useEffect, useState } from "react";

export const useCreateTestKeys = (isModalOpen: boolean, isTest: boolean, name: string) => {
    const [isLoading, setIsLoading] = useState(true);
    const [privateKey, setPrivateKey] = useState("");
    const [publicKey, setPublicKey] = useState("");

    useEffect(() => {
        if (!isModalOpen) return;

        if (isTest) {
            const createTestKeys = async () => {
                setIsLoading(true);

                const res = await keyGenEndpointsGenerateRsaKeypairEnigmaV1PkiKeygenGet(
                    {},
                    {
                        headers: {
                            authorization: `Bearer ${localStorage.getItem("access-token")}`
                        }
                    }
                );

                if ("data" in res.data && res.data.success) {
                    setPrivateKey(res.data.data.private_key);
                    setPublicKey(res.data.data.public_key);
                } else if ("data" in res.data && !res.data.success) {
                    throw new Error(res.data.error?.error_message);
                } else if ("detail" in res.data) {
                    throw new Error(res.data.detail?.[0].msg);
                }

                setIsLoading(false);
            };

            createTestKeys();
        } else {
            const realKeysGen = async () => {
                try {
                    const res = await providerEndpointsAddKeypairByIdEnigmaV1ProviderProviderIdAddKeypairPatch(
                        name,
                        {},
                        {
                            headers: {
                                authorization: `Bearer ${localStorage.getItem("access-token")}`
                            }
                        }
                    );

                    if ("data" in res.data && res.data.success) {
                        setPrivateKey(res.data.data.keypair.private_key);
                        setPublicKey(res.data.data.keypair.public_key);
                    } else if ("data" in res.data && !res.data.success) {
                        throw new Error(res.data.error?.error_message);
                    } else if ("detail" in res.data) {
                        throw new Error(res.data.detail?.[0].msg);
                    }

                    setIsLoading(false);
                } catch (error) {
                    /* empty */
                }
            };

            realKeysGen();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModalOpen, isTest]);

    return { privateKey, publicKey, isLoading, setIsLoading };
};
