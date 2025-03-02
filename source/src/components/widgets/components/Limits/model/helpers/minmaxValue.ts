import { LimitValuesOutput } from "@/api/enigma/blowFishEnigmaAPIService.schemas";

export function getMinValue(values: LimitValuesOutput) {
    if (values.min) {
        return String(values.min.quantity / values.min.accuracy);
    }
    return "";
}
export function getMaxValue(values: LimitValuesOutput) {
    if (values.max) {
        return String(values.max.quantity / values.max.accuracy);
    }
    return "";
}
