import { LimitValuesOutput } from "@/api/enigma/blowFishEnigmaAPIService.schemas";

export function getMinValue(values: LimitValuesOutput) {
    return values.min && "quantity" in values.min && "accuracy" in values.min
        ? String((values.min.quantity ?? 0) / (values.min.accuracy ?? 1))
        : "";
}

export function getMaxValue(values: LimitValuesOutput) {
    return values.max && "quantity" in values.max && "accuracy" in values.max
        ? String((values.max.quantity ?? 0) / (values.max.accuracy ?? 1))
        : "";
}
