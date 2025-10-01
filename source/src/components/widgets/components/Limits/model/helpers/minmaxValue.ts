import { SourceSchemasLimitsLimitValues } from "@/api/enigma/blowFishEnigmaAPIService.schemas";

export function getMinValue(values: SourceSchemasLimitsLimitValues | undefined) {
    const min = values?.min;

    if (min && typeof min === "object" && "quantity" in min && "accuracy" in min) {
        return String((min.quantity ?? 0) / (min.accuracy ?? 1));
    }

    return "";
}

export function getMaxValue(values: SourceSchemasLimitsLimitValues | undefined) {
    const max = values?.max;

    if (max && typeof max === "object" && "quantity" in max && "accuracy" in max) {
        return String((max.quantity ?? 0) / (max.accuracy ?? 1));
    }

    return "";
}
