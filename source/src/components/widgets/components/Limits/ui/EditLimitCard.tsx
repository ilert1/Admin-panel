import { Button } from "@/components/ui/Button";
import { useRefresh, useTranslate } from "react-admin";
import { useState } from "react";
import { UpdateLimitsType } from "../model/types/limits";
import { updateLimits } from "../model/api/updateLimits";
import { LimitInputGroup } from "./LimitInputGroup";
import { Limits } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { getMaxValue, getMinValue } from "../model/helpers/minmaxValue";
import { useAppToast } from "@/components/ui/toast/useAppToast";

interface EditLimitCardProps {
    directionId: string;
    limitsData: Limits;
    setEditClicked: (state: boolean) => void;
}

export const EditLimitCard = (props: EditLimitCardProps) => {
    const translate = useTranslate();
    const { directionId, limitsData, setEditClicked } = props;
    const refresh = useRefresh();

    const appToast = useAppToast();
    
    const [limits, setLimits] = useState<UpdateLimitsType>({
        payInMin: getMinValue(limitsData.payin) ?? "1",
        payInMax: getMaxValue(limitsData.payin) ?? "0",

        payOutMin: getMinValue(limitsData.payout) ?? "1",
        payOutMax: getMaxValue(limitsData.payout) ?? "0",

        rewardMin: getMinValue(limitsData.reward) ?? "0",
        rewardMax: getMaxValue(limitsData.reward) ?? "0"
    });
    
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        setErrors({});
        const errorMessages: Record<string, string> = {
            payInMin: translate("app.widgets.limits.deposit"),
            payInMax: translate("app.widgets.limits.deposit"),
            payOutMin: translate("app.widgets.limits.payment"),
            payOutMax: translate("app.widgets.limits.payment"),
            rewardMin: translate("app.widgets.limits.reward"),
            rewardMax: translate("app.widgets.limits.reward")
        };

        const keys: (keyof UpdateLimitsType)[] = [
            "payInMin",
            "payInMax",
            "payOutMin",
            "payOutMax",
            "rewardMin",
            "rewardMax"
        ];
        
        for (const key of keys) {
            const minKey = key.includes("Min") ? key : (key.replace("Max", "Min") as keyof UpdateLimitsType);
            const maxKey = key.includes("Max") ? key : (key.replace("Min", "Max") as keyof UpdateLimitsType);

            const minValue = parseFloat(limits[minKey]) || 0;
            const maxValue = parseFloat(limits[maxKey]) || 0;

            if(key === 'rewardMin' && minValue > maxValue && minValue !== 0 && maxValue !== 0){
                setErrors({ [maxKey]: translate("app.widgets.limits.errors.minGreaterThanMax") });
                appToast("error", translate("app.widgets.limits.errors.minGreaterThanMax"), errorMessages[minKey]);
                return false;
            } else if (minValue > maxValue && minValue !== 1 && maxValue !== 0) {
                setErrors({ [maxKey]: translate("app.widgets.limits.errors.minGreaterThanMax") });
                appToast("error", translate("app.widgets.limits.errors.minGreaterThanMax"), errorMessages[minKey]);
                return false;
            }
            
            if((key === "rewardMin" && minValue > 0 && minValue < 1 && minValue !== 0)){
                setErrors({ [minKey]: translate("app.widgets.limits.errors.minTooSmall") });
                appToast("error", translate("app.widgets.limits.errors.minTooSmall"), errorMessages[minKey]);
                return false;
            } else if((key === "payOutMin" || key === "payInMin") && minValue < 1){                
                setErrors({ [minKey]: translate("app.widgets.limits.errors.minTooSmall") });
                appToast("error", translate("app.widgets.limits.errors.minTooSmallForOne"), errorMessages[minKey]);
                return false;
            }

            if (maxValue > 0 && maxValue < 1 && maxValue !== 0) {
                setErrors({ [maxKey]: translate("app.widgets.limits.errors.maxTooSmall") });
                appToast("error", translate("app.widgets.limits.errors.maxTooSmall"), errorMessages[maxKey]);
                return false;
            }

            if (maxValue > 10000000) {
                setErrors({ [maxKey]: translate("app.widgets.limits.errors.maxTooLarge") });
                appToast("error", translate("app.widgets.limits.errors.maxTooLarge"), errorMessages[maxKey]);
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        
        const { success, errorMessage } = await updateLimits(directionId, limits);
        setErrors({});

        if (success) appToast("success", translate("app.widgets.limits.updatedSuccessfully"));
        else if (errorMessage) appToast("error", errorMessage);

        refresh();
        setEditClicked(false);
    };
    const handleChange = (key: keyof typeof limits, value: string) => {
        const sanitizedValue = value.replace(/^0+(\d)/, "$1");

        if (/^(0|[1-9]\d*)(\.\d*)?$/.test(sanitizedValue) || sanitizedValue === "") {
                setLimits(prev => ({
                    ...prev,
                    [key]: sanitizedValue === "" ? "0" : sanitizedValue
                }));
        }
    };
    return (

        <div className="flex flex-col gap-4 bg-muted mb-4 p-4 rounded-8">
            <div className="flex md:flex-row flex-col gap-4">
                <LimitInputGroup
                    label={translate("app.widgets.limits.deposit")}
                    minValue={limits.payInMin}
                    maxValue={limits.payInMax}
                    errorMin={errors["payInMin"]}
                    errorMax={errors["payInMax"]}
                    onMinChange={value => handleChange("payInMin", value)}
                    onMaxChange={value => handleChange("payInMax", value)}
                />

                <LimitInputGroup
                    label={translate("app.widgets.limits.payment")}
                    minValue={limits.payOutMin}
                    maxValue={limits.payOutMax}
                    errorMin={errors["payOutMin"]}
                    errorMax={errors["payOutMax"]}
                    onMinChange={value => handleChange("payOutMin", value)}
                    onMaxChange={value => handleChange("payOutMax", value)}
                />

                <LimitInputGroup
                    label={translate("app.widgets.limits.reward")}
                    minValue={limits.rewardMin}
                    maxValue={limits.rewardMax}
                    errorMin={errors["rewardMin"]}
                    errorMax={errors["rewardMax"]}
                    onMinChange={value => handleChange("rewardMin", value)}
                    onMaxChange={value => handleChange("rewardMax", value)}
                />
            </div>
            <div className="flex sm:flex-row flex-col justify-start gap-[10px]">
                <Button onClick={handleSubmit}>{translate("app.ui.actions.save")}</Button>
                <Button variant="outline_gray" onClick={() => setEditClicked(false)}>
                    {translate("app.ui.actions.cancel")}
                </Button>
            </div>
        </div>
    );
};
