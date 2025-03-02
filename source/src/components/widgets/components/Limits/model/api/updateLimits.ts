import { directionEndpointsUpdateLimitsEnigmaV1DirectionDirectionIdLimitsPatch } from "@/api/enigma/direction/direction";
import { UpdateLimitsType } from "../types/limits";
import { toast } from "sonner";

export async function updateLimits(directionId: string, limits: UpdateLimitsType) {
    limits;

    try {
        const { data, status } = await directionEndpointsUpdateLimitsEnigmaV1DirectionDirectionIdLimitsPatch(
            directionId,
            {
                limits: {
                    payin: {
                        min: 1,
                        max: 10.187632
                        // min: { accuracy: 0, quantity: Number(limits.payInMin) },
                        // max: { accuracy: 0, quantity: Number(limits.payInMax) }
                    },
                    payout: {
                        min: 105,
                        max: 1060.2
                        // min: { accuracy: 0, quantity: Number(limits.payOutMin) },
                        // max: { accuracy: 0, quantity: Number(limits.payOutMax) }
                    },
                    reward: {
                        min: 10.89,
                        max: 12.12
                        // min: { accuracy: 0, quantity: Number(limits.rewardMin) },
                        // max: { accuracy: 0, quantity: Number(limits.rewardMax) }
                    }
                }
            },
            {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("access-token")}`
                }
            }
        );
        console.log(data);
    } catch (error) {
        if (error instanceof Error)
            toast.error("Error", {
                dismissible: true,
                duration: 3000,
                description: error.message
            });
    }
}
