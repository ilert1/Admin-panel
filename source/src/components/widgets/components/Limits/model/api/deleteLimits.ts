import { directionEndpointsDeleteLimitsEnigmaV1DirectionDirectionIdLimitsDelete } from "@/api/enigma/direction/direction";

export async function deleteLimits(
    directionId: string
): Promise<{ data?: any; success: boolean; errorMessage?: string }> {
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
        let errorMessage;
        if (error instanceof Error) errorMessage = error.message;

        return { success: false, errorMessage };
    }
}
