import { directionEndpointsUpdateLimitsEnigmaV1DirectionDirectionIdLimitsPatch } from "@/api/enigma/direction/direction";
import { UpdateLimitsType } from "../types/limits";
import { toast } from "sonner";

export async function updateLimits(
    directionId: string,
    limits: UpdateLimitsType
): Promise<{ data?: any; success: boolean }> {
    try {
        const { data } = await directionEndpointsUpdateLimitsEnigmaV1DirectionDirectionIdLimitsPatch(
            directionId,
            {
                limits: {
                    payin: {
                        min: Number(limits.payInMin),
                        max: Number(limits.payInMax)
                    },
                    payout: {
                        min: Number(limits.payOutMin),
                        max: Number(limits.payOutMax)
                    },
                    reward: {
                        min: Number(limits.rewardMin),
                        max: Number(limits.rewardMax)
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
        console.log(error);

        if (error instanceof Error)
            toast.error("Error", {
                dismissible: true,
                duration: 3000,
                description: error.message
            });
        return { success: false };
    }
}
