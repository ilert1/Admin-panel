import { directionEndpointsUpdateLimitsEnigmaV1DirectionDirectionIdLimitsPatch } from "@/api/enigma/direction/direction";
import { UpdateLimitsType } from "../types/limits";

export async function updateLimits(
    directionId: string,
    limits: UpdateLimitsType
): Promise<{ data?: any; success: boolean; errorMessage?: string }> {
    try {
        const { data } = await directionEndpointsUpdateLimitsEnigmaV1DirectionDirectionIdLimitsPatch(
            directionId,
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
