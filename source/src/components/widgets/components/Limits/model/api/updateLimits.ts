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
                        min: { accuracy: 0, quantity: 100 },
                        max: { accuracy: 0, quantity: 12 }
                        // min: { accuracy: 0, quantity: Number(limits.payInMin) },
                        // max: { accuracy: 0, quantity: Number(limits.payInMax) }
                    },
                    payout: {
                        min: { accuracy: 0, quantity: 15 },
                        max: { accuracy: 0, quantity: 15 }
                        // min: { accuracy: 0, quantity: Number(limits.payOutMin) },
                        // max: { accuracy: 0, quantity: Number(limits.payOutMax) }
                    },
                    reward: {
                        min: { accuracy: 0, quantity: 15 },
                        max: { accuracy: 0, quantity: 15 }
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
