import { LimitValuesOutput } from "@/api/enigma/blowFishEnigmaAPIService.schemas";

export function getMinValue(values: LimitValuesOutput) {
    if (values.min) {
        if(Object.hasOwn(values.min ,'quantity') &&  Object.hasOwn(values.min ,'accuracy')) {
            return String((values.min.quantity ?? 0) / (values.min.accuracy ?? 1));
        }
    }
    return "";
}

export function getMaxValue(values: LimitValuesOutput) {
    if (values.max) {
        if(Object.hasOwn(values.max ,'quantity') &&  Object.hasOwn(values.max ,'accuracy')) {
            return String(values.max.quantity ?? 0 / (values.max.accuracy ?? 1));
        }
    }
    return "";
}
