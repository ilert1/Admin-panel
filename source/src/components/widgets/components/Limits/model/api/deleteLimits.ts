import { directionEndpointsDeleteLimitsEnigmaV1DirectionDirectionIdLimitsDelete } from "@/api/enigma/direction/direction";

export async function deleteLimits(directionId: string) {
    try {
        const { data, status } = await directionEndpointsDeleteLimitsEnigmaV1DirectionDirectionIdLimitsDelete(
            directionId
        );
    } catch (error) {}
}
