import { Button } from "@/components/ui/Button";
import { useRefresh, useTranslate } from "react-admin";
import { useState } from "react";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { z } from "zod";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { TextField } from "@/components/ui/text-field";

interface EditTTLCardProps {
    id?: string;
    ttl: {
        depositMin: number;
        depositMax: number;
        withdrawMin: number;
        withdrawMax: number;
    };
    setEditClicked: (state: boolean) => void;
    onChange?: (value: { depositMin: number; depositMax: number; withdrawMin: number; withdrawMax: number }) => void;
}

export const EditTTLCard = (props: EditTTLCardProps) => {
    const translate = useTranslate();
    const { id, ttl, setEditClicked, onChange } = props;
    const refresh = useRefresh();

    const appToast = useAppToast();

    const [errors, setErrors] = useState<Record<string, string>>({});

    const limitSchema = z
        .object({
            depositMax: z.coerce
                .number()
                .min(
                    1,
                    translate("app.widgets.limits.errors.minTooSmallForOne", {
                        field: translate("app.widgets.limits.errors.ofDeposit")
                    })
                )
                .max(999999999.99),
            depositMin: z.coerce
                .number()
                .min(
                    1,
                    translate("app.widgets.limits.errors.minTooSmallForOne", {
                        field: translate("app.widgets.limits.errors.ofPayment")
                    })
                )
                .max(999999999.99),
            withdrawMax: z.coerce
                .number()
                .min(
                    1,
                    translate("app.widgets.limits.errors.minTooSmallForOne", {
                        field: translate("app.widgets.limits.errors.ofDeposit")
                    })
                )
                .max(999999999.99),
            withdrawMin: z.coerce
                .number()
                .min(
                    1,
                    translate("app.widgets.limits.errors.minTooSmallForOne", {
                        field: translate("app.widgets.limits.errors.ofPayment")
                    })
                )
                .max(999999999.99)
        })
        .refine(
            data => {
                if (data.withdrawMax === 0) {
                    return true;
                }
                return data.withdrawMin <= data.withdrawMax;
            },
            {
                message: translate("app.widgets.limits.errors.minGreaterThanMax"),
                path: ["withdrawMax"]
            }
        )
        .refine(
            data => {
                if (data.depositMax === 0) {
                    return true;
                }
                return data.depositMin <= data.depositMax;
            },
            {
                message: translate("app.widgets.limits.errors.minGreaterThanMax"),
                path: ["depositMax"]
            }
        );

    const [localTTL, setLocalTTL] = useState({
        depositMin: ttl.depositMin ?? 0,
        depositMax: ttl.depositMax ?? 0,
        withdrawMin: ttl.withdrawMin ?? 0,
        withdrawMax: ttl.withdrawMax ?? 0
    });

    // const handleSubmit = async () => {
    //     const result = limitSchema.safeParse(limits);

    //     if (!result.success) {
    //         const newErrors: Record<string, string> = {};
    //         result.error.issues.forEach(issue => {
    //             appToast("error", issue.message);
    //             newErrors[issue.path[0] as string] = issue.message;
    //         });

    //         setErrors(newErrors);
    //         return;
    //     }

    //     const { success, errorMessage } = await updateLimits(directionId, limits);
    //     setErrors({});

    //     if (success) appToast("success", translate("app.widgets.limits.updatedSuccessfully"));
    //     else if (errorMessage) appToast("error", errorMessage);

    //     refresh();
    //     setEditClicked(false);
    // };

    const handleSave = () => {
        const result = limitSchema.safeParse(localTTL);

        if (!result.success) {
            const newErrors: Record<string, string> = {};
            result.error.issues.forEach(issue => {
                appToast("error", issue.message);
                newErrors[issue.path[0] as string] = issue.message;
            });

            setErrors(newErrors);
            return;
        }
        try {
            if (id) {
                // Заглушка
            } else {
                onChange?.(localTTL);
            }
        } catch (error) {
            // Заглушка
        } finally {
            refresh();
            setEditClicked(false);
        }
    };

    const handleChange = (key: keyof typeof localTTL, value: string) => {
        value = value.replace(/[^0-9.]/g, "");

        const parts = value.split(".");
        if (parts.length > 2) {
            value = parts[0] + "." + parts[1];
        }

        if (parts.length === 2 && parts[1].length > 2) {
            parts[1] = parts[1].slice(0, 2);
            value = parts.join(".");
        }

        if (/^0[0-9]+/.test(value) && !value.startsWith("0.")) {
            value = value.replace(/^0+/, "") || "0";
        }

        if (value === "") {
            setLocalTTL(prev => ({
                ...prev,
                [key]: ""
            }));
            return;
        }

        if (value.endsWith(".") || value === "0.") {
            return;
        }

        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
            let finalValue = numericValue;

            if (numericValue > 100000) {
                finalValue = 100000;
            }
            if (numericValue < 0) {
                finalValue = 0;
            }

            setLocalTTL(prev => ({
                ...prev,
                [key]: finalValue
            }));
        }
    };

    return (
        <div className="mb-4 flex flex-col gap-6 rounded-8 bg-muted p-4 sm:gap-4">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-4">
                <div className="flex flex-1 flex-col gap-2 md:gap-4">
                    <TextField text={translate("app.widgets.limits.deposit")} className="text-display-5" />
                    <div className="flex flex-col gap-4">
                        <Input
                            variant={InputTypes.GRAY}
                            label={translate("resources.merchant.fields.minTTL")}
                            value={localTTL.depositMin}
                            onChange={e => handleChange("depositMin", e.target.value)}
                            inputMode="numeric"
                            tabIndex={0}
                            error={errors.depositMin}
                            disableErrorMessage
                        />
                        <Input
                            variant={InputTypes.GRAY}
                            label={translate("resources.merchant.fields.maxTTL")}
                            value={localTTL.depositMax}
                            tabIndex={0}
                            onChange={e => handleChange("depositMax", e.target.value)}
                            inputMode="numeric"
                            error={errors.depositMax}
                            disableErrorMessage
                        />
                    </div>
                </div>
                <div className="flex flex-1 flex-col gap-2 md:gap-4">
                    <TextField text={translate("app.widgets.limits.payment")} className="text-display-5" />
                    <div className="flex flex-col gap-4">
                        <Input
                            variant={InputTypes.GRAY}
                            label={translate("resources.merchant.fields.minTTL")}
                            value={localTTL.withdrawMin}
                            onChange={e => handleChange("withdrawMin", e.target.value)}
                            inputMode="numeric"
                            tabIndex={0}
                            error={errors.withdrawMin}
                            disableErrorMessage
                        />
                        <Input
                            variant={InputTypes.GRAY}
                            label={translate("resources.merchant.fields.maxTTL")}
                            value={localTTL.withdrawMax}
                            tabIndex={0}
                            onChange={e => handleChange("withdrawMax", e.target.value)}
                            inputMode="numeric"
                            error={errors.withdrawMax}
                            disableErrorMessage
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-end gap-[10px] sm:flex-row">
                <Button type="button" onClick={handleSave}>
                    {translate("app.ui.actions.save")}
                </Button>
                <Button variant="outline_gray" onClick={() => setEditClicked(false)}>
                    {translate("app.ui.actions.cancel")}
                </Button>
            </div>
        </div>
    );
};
