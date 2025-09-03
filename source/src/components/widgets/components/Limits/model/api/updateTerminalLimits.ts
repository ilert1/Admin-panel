import { UpdateLimitsType } from "../types/limits";
import { terminalEndpointsUpdateTerminalEnigmaV1TerminalTerminalIdPut } from "@/api/enigma/terminal/terminal";

export async function updateTerminalLimits(
    terminalId: string,
    limits: UpdateLimitsType
): Promise<{ data?: any; success: boolean; errorMessage?: string }> {
    try {
        const { data } = await terminalEndpointsUpdateTerminalEnigmaV1TerminalTerminalIdPut(
            terminalId,
            {
                limits: {
                    payin: {
                        min: limits.payInMin,
                        max: limits.payInMax
                    },
                    payout: {
                        min: limits.payOutMin,
                        max: limits.payOutMax
                    },
                    reward: {
                        min: limits.rewardMin,
                        max: limits.rewardMax
                    }
                }
            },
            {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("access-token")}`
                }
            }
        );
        if ("data" in data) {
            if (!data.success) {
                throw new Error(data.error?.error_message);
            }

            return { data, success: data.success };
        }
        throw new Error("Http error");
    } catch (error) {
        let errorMessage;
        if (error instanceof Error) errorMessage = error.message;

        return { success: false, errorMessage };
    }
}
