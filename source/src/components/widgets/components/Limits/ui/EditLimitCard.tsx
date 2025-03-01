import { Button } from "@/components/ui/Button";
import { useTranslate } from "react-admin";
import { useState } from "react";
import { UpdateLimitsType } from "../model/types/limits";
import { updateLimits } from "../model/api/updateLimits";
import { LimitInputGroup } from "./LimitInputGroup";

interface EditLimitCardProps {
    directionId: string;
    setEditClicked: (state: boolean) => void;
}

export const EditLimitCard = (props: EditLimitCardProps) => {
    const translate = useTranslate();
    const { directionId, setEditClicked } = props;

    const [limits, setLimits] = useState<UpdateLimitsType>({
        payInMin: "",
        payInMax: "",
        payOutMin: "",
        payOutMax: "",
        rewardMin: "",
        rewardMax: ""
    });

    const handleChange = (key: keyof typeof limits, value: string) => {
        if (/^\d*$/.test(value)) {
            setLimits(prev => ({ ...prev, [key]: value }));
        }
    };

    const handleSubmit = () => {
        updateLimits(directionId, limits);
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
