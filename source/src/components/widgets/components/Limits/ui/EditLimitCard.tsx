import { Button } from "@/components/ui/Button";
import { useRefresh, useTranslate } from "react-admin";
import { useState } from "react";
import { UpdateLimitsType } from "../model/types/limits";
import { updateLimits } from "../model/api/updateLimits";
import { LimitInputGroup } from "./LimitInputGroup";
import { Limits } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { getMaxValue, getMinValue } from "../model/helpers/minmaxValue";
import { toast } from "sonner";

interface EditLimitCardProps {
    directionId: string;
    limitsData: Limits;
    setEditClicked: (state: boolean) => void;
}

export const EditLimitCard = (props: EditLimitCardProps) => {
    const translate = useTranslate();
    const { directionId, limitsData, setEditClicked } = props;
    const refresh = useRefresh();

    const [limits, setLimits] = useState<UpdateLimitsType>({
        payInMin: getMinValue(limitsData.payin) ?? "",
        payInMax: getMaxValue(limitsData.payin) ?? "",

        payOutMin: getMinValue(limitsData.payout) ?? "",
        payOutMax: getMaxValue(limitsData.payout) ?? "",

        rewardMin: getMinValue(limitsData.reward) ?? "",
        rewardMax: getMaxValue(limitsData.reward) ?? ""
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
            const minKey = key.includes("Min") ? key : key.replace("Max", "Min");
            const maxKey = key.includes("Max") ? key : key.replace("Min", "Max");

            const minValue = parseFloat(limits[minKey]) || 0;
            const maxValue = parseFloat(limits[maxKey]) || 0;

            if (minValue > maxValue && minValue !== 0 && maxValue !== 0) {
                setErrors({ [maxKey]: translate("app.widgets.limits.errors.minGreaterThanMax") });
                toast.error(`${errorMessages[minKey]}`, {
                    description: translate("app.widgets.limits.errors.minGreaterThanMax")
                });
                return false;
            }

            if (minValue > 0 && minValue < 1 && minValue !== 0) {
                setErrors({ [minKey]: translate("app.widgets.limits.errors.minTooSmall") });

                toast.error(errorMessages[minKey], {
                    description: translate("app.widgets.limits.errors.minTooSmall")
                });
                return false;
            }

            if (maxValue > 0 && maxValue < 1 && maxValue !== 0) {
                setErrors({ [maxKey]: translate("app.widgets.limits.errors.maxTooSmall") });

                toast.error(errorMessages[maxKey], {
                    description: translate("app.widgets.limits.errors.maxTooSmall")
                });
                return false;
            }

            if (maxValue > 10000000) {
                setErrors({ [maxKey]: translate("app.widgets.limits.errors.maxTooLarge") });

                toast.error(errorMessages[maxKey], {
                    description: translate("app.widgets.limits.errors.maxTooLarge")
                });
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        const { success } = await updateLimits(directionId, limits);
        setErrors({});
        if (success)
            toast.success("Success", {
                dismissible: true,
                duration: 3000,
                description: translate("app.widgets.limits.updatedSuccessfully")
            });

        refresh();
        setEditClicked(false);
    };

    const handleChange = (key: keyof typeof limits, value: string) => {
        const sanitizedValue = value.replace(/^0+(\d)/, "$1");

        if (/^(0|[1-9]\d*)(\.\d*)?$/.test(sanitizedValue) || sanitizedValue === "") {
            setLimits(prev => ({
                ...prev,
                [key]: sanitizedValue
            }));
        }
    };

    return (
        <div className="flex flex-col gap-4 bg-muted p-4 rounded-8 mb-4">
            <div className="flex flex-col gap-4 md:gap-10 md:flex-row">
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
            <div className="flex flex-col sm:flex-row justify-start gap-[10px]">
                <Button onClick={handleSubmit}>{translate("app.ui.actions.save")}</Button>
                <Button variant="outline_gray" onClick={() => setEditClicked(false)}>
                    {translate("app.ui.actions.cancel")}
                </Button>
            </div>
        </div>
    );
};
