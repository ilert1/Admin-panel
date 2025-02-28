import { Terminal } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { terminalEndpointsListTerminalsEnigmaV1ProviderProviderNameTerminalGet } from "@/api/enigma/terminal/terminal";
import { useState } from "react";
import { useTranslate } from "react-admin";
import { toast } from "sonner";

export const useGetTerminals = () => {
    const translate = useTranslate();
    const [terminals, setTerminals] = useState<Terminal[]>([]);

    const getTerminals = async (name: string | undefined) => {
        if (name) {
            try {
                const res = await terminalEndpointsListTerminalsEnigmaV1ProviderProviderNameTerminalGet(
                    name,
                    {
                        currentPage: 1,
                        pageSize: 1000
                    },
                    {
                        headers: {
                            authorization: `Bearer ${localStorage.getItem("access-token")}`
                        }
                    }
                );

                if ("data" in res.data && res.data.success) {
                    setTerminals(res.data.data.items);
                } else if ("data" in res.data && !res.data.success) {
                    throw new Error(res.data.error?.error_message);
                } else if ("detail" in res.data) {
                    throw new Error(res.data.detail?.[0].msg);
                }
            } catch (error) {
                setTerminals([]);
                if (error instanceof Error && error.message === "no_terminals") {
                    toast.error("Error", {
                        description: translate(`resources.direction.errors.${error.message}`),
                        dismissible: true,
                        duration: 3000
                    });
                }
            }
        }
    };

    return { terminals, getTerminals };
};
