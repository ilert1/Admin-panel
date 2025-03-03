import { directionEndpointsDeleteLimitsEnigmaV1DirectionDirectionIdLimitsDelete } from "@/api/enigma/direction/direction";
import { toast } from "sonner";

export async function deleteLimits(directionId: string): Promise<{ data?: any; success: boolean }> {
    try {
        const { data } = await directionEndpointsDeleteLimitsEnigmaV1DirectionDirectionIdLimitsDelete(directionId, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        });

        if ("data" in data) {
            if (!data.success) {
                throw new Error(data.error?.error_message);
            }
            return { data, success: data.success };
        }

        throw new Error("Http error");
    } catch (error) {
        if (error instanceof Error)
            toast.error("Error", {
                dismissible: true,
                duration: 3000,
                description: error.message
            });
        return { success: false };
    }
}
