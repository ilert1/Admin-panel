import { Button } from "@/components/ui/Button";
import { useRefresh, useTranslate } from "react-admin";
import { useState } from "react";
import { ResourceType, UpdateLimitsType } from "../model/types/limits";
import { Limits } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { getMaxValue, getMinValue } from "../model/helpers/minmaxValue";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { z } from "zod";
import { updateDirectionLimits } from "../model/api/updateDirectionLimits";
import { updateTerminalLimits } from "../model/api/updateTerminalLimits";
import { LimitInputGroup } from "./LimitInputGroup";

interface EditLimitCardProps {
    id: string;
    limitsData: Limits;
    setEditClicked: (state: boolean) => void;
    resource: ResourceType;
}

export const EditLimitCard = (props: EditLimitCardProps) => {
    const translate = useTranslate();
    const { id, limitsData, setEditClicked, resource } = props;
    const refresh = useRefresh();

    const appToast = useAppToast();

    const limitSchema = z
        .object({
            payInMin: z.coerce
                .number()
                .min(
                    1,
                    translate("app.widgets.limits.errors.minTooSmallForOne", {
                        field: translate("app.widgets.limits.errors.ofDeposit")
                    })
                )
                .max(999999999.99),
            payOutMin: z.coerce
                .number()
                .min(
                    1,
                    translate("app.widgets.limits.errors.minTooSmallForOne", {
                        field: translate("app.widgets.limits.errors.ofPayment")
                    })
                )
                .max(999999999.99),
            rewardMin: z.coerce
                .number()
                .min(
                    0,
                    translate("app.widgets.limits.errors.minTooSmall", {
                        field: translate("app.widgets.limits.errors.ofReward")
                    })
                )
                .max(999999999.99)
                .refine(value => value === 0 || value >= 1, {
                    message: translate("app.widgets.limits.errors.minTooSmall", {
                        field: translate("app.widgets.limits.errors.ofReward")
                    }),
                    path: ["rewardMin"]
                }),
            payOutMax: z.coerce
                .number()
                .max(999999999.99)
                .refine(
                    value => value === 0 || value > 1,
                    translate("app.widgets.limits.errors.maxTooSmall", {
                        field: translate("app.widgets.limits.errors.ofDeposit")
                    })
                ),
            payInMax: z.coerce
                .number()
                .max(999999999.99)
                .refine(
                    value => value === 0 || value > 1,
                    translate("app.widgets.limits.errors.maxTooSmall", {
                        field: translate("app.widgets.limits.errors.ofPayment")
                    })
                ),
            rewardMax: z.coerce
                .number()
                .max(999999999.99)
                .refine(
                    value => value === 0 || value > 1,
                    translate("app.widgets.limits.errors.maxTooSmall", {
                        field: translate("app.widgets.limits.errors.ofReward")
                    })
                )
        })
        .refine(
            data => {
                if (data.payInMax === 0) {
                    return true;
                }
                return data.payInMin <= data.payInMax;
            },
            {
                message: translate("app.widgets.limits.errors.minGreaterThanMax"),
                path: ["payInMax"]
            }
        )
        .refine(
            data => {
                if (data.payOutMax === 0) {
                    return true;
                }
                return data.payOutMin <= data.payOutMax;
            },
            {
                message: translate("app.widgets.limits.errors.minGreaterThanMax"),
                path: ["payOutMax"]
            }
        )
        .refine(
            data => {
                if (data.rewardMax === 0) {
                    return true;
                }
                return data.rewardMin <= data.rewardMax;
            },
            {
                message: translate("app.widgets.limits.errors.minGreaterThanMax"),
                path: ["rewardMax"]
            }
        );

    const [limits, setLimits] = useState<UpdateLimitsType>({
        payInMin: getMinValue(limitsData.payin) ?? "1",
        payInMax: getMaxValue(limitsData.payin) ?? "0",

        payOutMin: getMinValue(limitsData.payout) ?? "1",
        payOutMax: getMaxValue(limitsData.payout) ?? "0",

        rewardMin: getMinValue(limitsData.reward) ?? "0",
        rewardMax: getMaxValue(limitsData.reward) ?? "0"
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async () => {
        const result = limitSchema.safeParse(limits);

        if (!result.success) {
            const newErrors: Record<string, string> = {};

            result.error.issues.forEach(issue => {
                appToast("error", issue.message);
                newErrors[issue.path[0] as string] = issue.message;
            });

            setErrors(newErrors);
            return;
        }
        let success = false;
        let errorMessage: string | undefined = "";

        if (resource === "direction") {
            ({ success, errorMessage } = await updateDirectionLimits(id, limits));
        } else {
            ({ success, errorMessage } = await updateTerminalLimits(id, limits));
        }

        setErrors({});

        if (success) appToast("success", translate("app.widgets.limits.updatedSuccessfully"));
        else if (errorMessage) appToast("error", errorMessage);

        refresh();
        setEditClicked(false);
    };

    const handleChange = (key: keyof typeof limits, value: string) => {
        const sanitizedValue = value
            .replace(/^0+(\d)/, "$1")
            .replace(/[^\d.]/g, "")
            .replace(/(\.\d{2})\d+/, "$1");

        if (/^(0|[1-9]\d*)(\.\d{0,2})?$/.test(sanitizedValue) || sanitizedValue === "") {
            const numValue = parseFloat(sanitizedValue) || 0;
            if (numValue <= 999999999.99) {
                setLimits(prev => ({
                    ...prev,
                    [key]: sanitizedValue === "" ? "0" : sanitizedValue
                }));
            }
        }
    };

    return (
        <div className="mb-4 flex flex-col gap-4 rounded-8 bg-muted p-4">
            <div className="flex flex-col gap-4 md:flex-row">
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
            <div className="flex flex-col justify-start gap-[10px] sm:flex-row">
                <Button onClick={handleSubmit}>{translate("app.ui.actions.save")}</Button>
                <Button variant="outline_gray" onClick={() => setEditClicked(false)}>
                    {translate("app.ui.actions.cancel")}
                </Button>
            </div>
        </div>
    );
};
