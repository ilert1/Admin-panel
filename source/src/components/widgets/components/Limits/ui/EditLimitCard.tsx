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

    const handleChange = (key: keyof typeof limits, value: string) => {
        const sanitizedValue = value.replace(/^0+(\d)/, "$1");

        if (/^(0|[1-9]\d*)(\.\d*)?$/.test(sanitizedValue) || sanitizedValue === "") {
            setLimits(prev => ({
                ...prev,
                [key]: sanitizedValue
            }));
        }
    };

    const handleSubmit = async () => {
        const { success } = await updateLimits(directionId, limits);

        if (success)
            toast.success("Success", {
                dismissible: true,
                duration: 3000,
                description: translate("app.widgets.limits.updatedSuccessfully")
            });
        refresh();
        setEditClicked(false);
    };

    return (
        <div className="flex flex-col gap-4 bg-muted p-4 rounded-8 mb-4">
            <div className="flex gap-10">
                <LimitInputGroup
                    label={translate("app.widgets.limits.deposit")}
                    minValue={limits.payInMin}
                    maxValue={limits.payInMax}
                    onMinChange={value => handleChange("payInMin", value)}
                    onMaxChange={value => handleChange("payInMax", value)}
                />

                <LimitInputGroup
                    label={translate("app.widgets.limits.payment")}
                    minValue={limits.payOutMin}
                    maxValue={limits.payOutMax}
                    onMinChange={value => handleChange("payOutMin", value)}
                    onMaxChange={value => handleChange("payOutMax", value)}
                />

                <LimitInputGroup
                    label={translate("app.widgets.limits.reward")}
                    minValue={limits.rewardMin}
                    maxValue={limits.rewardMax}
                    onMinChange={value => handleChange("rewardMin", value)}
                    onMaxChange={value => handleChange("rewardMax", value)}
                />
            </div>
            <div className="flex justify-start gap-[10px]">
                <Button onClick={handleSubmit}>{translate("app.ui.actions.save")}</Button>
                <Button variant="outline_gray" onClick={() => setEditClicked(false)}>
                    {translate("app.ui.actions.cancel")}
                </Button>
            </div>
        </div>
    );
};
