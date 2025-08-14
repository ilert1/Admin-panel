import { useTranslate, useRefresh } from "react-admin";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectType,
    SelectValue
} from "@/components/ui/select";
import { ChangeEvent, useEffect, useState } from "react";
import { MerchantsDataProvider } from "@/data";
import { UniqunessActivityButton } from "../../show/Merchant/UniqunessActivityButton";
import { LoadingBlock } from "@/components/ui/loading";
import { useQuery } from "@tanstack/react-query";
import { ConfirmCloseDialog } from "../../show/Mapping/ConfirmCloseDialog";

interface UniqunessCreateProps {
    merchantId: string;
    onOpenChange: (state: boolean) => void;
    confirmCloseDialogOpen: boolean;
    isSomethingEdited: boolean;
    setIsSomethingEdited: (state: boolean) => void;
    saveClicked: boolean;
    setSaveClicked: (state: boolean) => void;
    setConfirmDialogOpen: (state: boolean) => void;
}

const modes = ["percent", "absolute"];

const safeNumber = (value: any, defaultValue: number = 0): number => {
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
};

const UNIQUENESS_WITHDRAW_DISABLED = import.meta.env.VITE_UNIQUENESS_WITHDRAW_DISABLED
    ? import.meta.env.VITE_UNIQUENESS_WITHDRAW_DISABLED === "true"
    : true;

export const UniqunessCreate = (props: UniqunessCreateProps) => {
    const {
        merchantId,
        onOpenChange,
        confirmCloseDialogOpen,
        isSomethingEdited,
        setIsSomethingEdited,
        saveClicked,
        setSaveClicked,
        setConfirmDialogOpen
    } = props;
    const translate = useTranslate();
    const refresh = useRefresh();
    const appToast = useAppToast();
    const dataProvider = new MerchantsDataProvider();
    console.log(UNIQUENESS_WITHDRAW_DISABLED);

    const {
        data: uniquenessData,
        isLoading,
        isFetchedAfterMount
    } = useQuery({
        queryKey: ["merchantUniqueness", merchantId],
        queryFn: async () => {
            try {
                const res = await dataProvider.getMerchantUniqueness(merchantId);
                return res ?? null;
            } catch (error) {
                appToast("error", translate("resources.withdraw.errors.serverError"));
                onOpenChange(false);
            }
        },
        enabled: !!merchantId,
        select: data => data?.[0] ?? null
    });

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const [activityState, setActivityState] = useState(uniquenessData?.uniqueness?.deposit?.enable ?? false);
    const [activityState2, setActivityState2] = useState(uniquenessData?.uniqueness?.withdraw?.enable ?? false);

    const formSchema = z
        .object({
            mode: z.enum(modes as [string, ...string[]]),
            min: z.coerce.number().default(0),
            max: z.coerce.number().default(0),
            chance: z.coerce.number().default(0),
            mode2: z.enum(modes as [string, ...string[]]),
            min2: z.coerce.number().default(0),
            max2: z.coerce.number().default(0),
            chance2: z.coerce.number().default(0)
        })
        .superRefine(({ max, min, min2, max2 }, ctx) => {
            if (min > max) {
                ctx.addIssue({
                    code: "custom",
                    message: translate("resources.merchant.uniqueness.errors.minCantBeLess"),
                    path: ["min"]
                });
            }
            if (min2 > max2) {
                ctx.addIssue({
                    code: "custom",
                    message: translate("resources.merchant.uniqueness.errors.minCantBeLess"),
                    path: ["min2"]
                });
            }
        });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            mode: uniquenessData?.uniqueness?.deposit?.mode ?? modes[0],
            min: safeNumber(uniquenessData?.uniqueness?.deposit?.min) ?? 0,
            max: safeNumber(uniquenessData?.uniqueness?.deposit?.max) ?? 0,
            chance: uniquenessData?.uniqueness?.deposit?.chance ?? 0,
            mode2: uniquenessData?.uniqueness?.withdraw?.mode ?? modes[0],
            min2: safeNumber(uniquenessData?.uniqueness?.withdraw?.min) ?? 0,
            max2: safeNumber(uniquenessData?.uniqueness?.withdraw?.max) ?? 0,
            chance2: uniquenessData?.uniqueness?.withdraw?.chance ?? 0
        }
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setSaveClicked(true);
        if (submitButtonDisabled) return;
        setSubmitButtonDisabled(true);
        try {
            const formData = {
                deposit: {
                    mode: data.mode,
                    min: String(data.min),
                    max: String(data.max),
                    chance: data.chance,
                    enable: activityState
                },
                withdraw: {
                    mode: data.mode2,
                    min: String(data.min2),
                    max: String(data.max2),
                    chance: data.chance2,
                    enable: activityState2
                }
            };
            dataProvider.updateMerchantUniqueness(merchantId, formData);
            appToast("success", translate("resources.merchant.uniqueness.successMessage"));
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
            else appToast("error", translate("resources.merchant.uniqueness.errors.unexpectedError"));
        } finally {
            refresh();
            setSubmitButtonDisabled(false);
            onOpenChange(false);
            setIsSomethingEdited(false);
        }
    };

    useEffect(() => {
        if (!isLoading && uniquenessData && isFetchedAfterMount) {
            const updatedValues = {
                mode: uniquenessData?.uniqueness?.deposit?.mode ?? modes[0],
                min: safeNumber(uniquenessData?.uniqueness?.deposit?.min) ?? 0,
                max: safeNumber(uniquenessData?.uniqueness?.deposit?.max) ?? 0,
                chance: uniquenessData?.uniqueness?.deposit?.chance ?? 0,
                mode2: uniquenessData?.uniqueness?.withdraw?.mode ?? modes[0],
                min2: safeNumber(uniquenessData?.uniqueness?.withdraw?.min) ?? 0,
                max2: safeNumber(uniquenessData?.uniqueness?.withdraw?.max) ?? 0,
                chance2: uniquenessData?.uniqueness?.withdraw?.chance ?? 0
            };
            setActivityState(uniquenessData?.uniqueness?.deposit?.enable ?? false);
            setActivityState2(uniquenessData?.uniqueness?.withdraw?.enable ?? false);
            form.reset(updatedValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uniquenessData, isLoading, isFetchedAfterMount]);

    const defaultValues = form.getValues();
    useEffect(() => {
        const subscription = form.watch(values => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            const changed = Object.keys(values).some(key => values[key] !== defaultValues[key]);
            setIsSomethingEdited(changed);
        });

        return () => subscription.unsubscribe();
    }, [form.watch, defaultValues]);

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement>,
        mode: "mode" | "mode2",
        field: ControllerRenderProps<z.infer<typeof formSchema>>
    ) => {
        let value = e.target.value;

        const allowNegative =
            field.name === "max" || field.name === "min" || field.name === "min2" || field.name === "max2";

        value = value.replace(/[^0-9.-]/g, "");

        if (form.getValues(mode) === "percent") {
            if (!allowNegative) {
                value = value.replace(/-/g, "");
            } else {
                if (value.includes("-")) {
                    const minusCount = (value.match(/-/g) || []).length;
                    if (minusCount > 1 || (value.indexOf("-") !== 0 && value.includes("-"))) {
                        value = value.replace(/-/g, "");
                        if (value.length > 0) {
                            value = "-" + value;
                        }
                    }
                }
            }
        } else {
            if (!allowNegative) {
                value = value.replace(/-/g, "");
            } else {
                if (value.includes("-")) {
                    const minusCount = (value.match(/-/g) || []).length;
                    if (minusCount > 1 || (value.indexOf("-") !== 0 && value.includes("-"))) {
                        value = value.replace(/-/g, "");
                        if (value.length > 0) {
                            value = "-" + value;
                        }
                    }
                }
            }
        }

        const parts = value.split(".");
        if (parts.length > 2) {
            value = parts[0] + "." + parts[1];
        }
        if (parts.length === 2 && parts[1].length > 2) {
            parts[1] = parts[1].slice(0, 2);
            value = parts.join(".");
        }

        if (/^-?0[0-9]+/.test(value) && !value.startsWith("0.") && !value.startsWith("-0.")) {
            value = value.replace(/^(-?)0+/, "$1") || "0";
        }

        if (value === "." || value === "-.") {
            value = value.replace(".", "0.");
        }

        e.target.value = value;

        if (value === "" || (value === "-" && !allowNegative)) {
            form.setValue(field.name, "");
            return;
        }

        if (value.endsWith(".") || value === "0." || value === "-0." || value === "-") {
            form.setValue(field.name, value);
            return;
        }

        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
            let finalValue = numericValue;

            if (form.getValues(mode) === "percent") {
                if (numericValue > 100) {
                    finalValue = 100;
                    e.target.value = "100";
                }
                if (numericValue < -100) {
                    finalValue = -100;
                    e.target.value = "-100";
                }
                if (!allowNegative && numericValue < 0) {
                    finalValue = 0;
                    e.target.value = "0";
                }
            }
            if (form.getValues(mode) === "absolute") {
                if (numericValue > 100000) {
                    finalValue = 100000;
                    e.target.value = "100000";
                }
                if (numericValue < -100000) {
                    finalValue = -100000;
                    e.target.value = "-100000";
                }
                if (!allowNegative && numericValue < 0) {
                    finalValue = 0;
                    e.target.value = "0";
                }
            }

            form.setValue(field.name, finalValue);
        }
    };

    const handleOnlyPercentInputChange = (
        e: ChangeEvent<HTMLInputElement>,
        field: ControllerRenderProps<z.infer<typeof formSchema>>
    ) => {
        let value = e.target.value;

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

        if (value === ".") {
            value = "0.";
        }

        e.target.value = value;

        if (value === "") {
            form.setValue(field.name, "");
            return;
        }

        if (value.endsWith(".") || value === "0.") {
            form.setValue(field.name, value);
            return;
        }

        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
            let finalValue = numericValue;

            if (numericValue > 100) {
                finalValue = 100;
                e.target.value = "100";
            }
            if (numericValue < 0) {
                finalValue = 0;
                e.target.value = "0";
            }

            form.setValue(field.name, finalValue);
        }
    };

    const onCloseFn = () => {
        setIsSomethingEdited(false);
        setSaveClicked(false);
        onOpenChange(false);
    };

    const onSave = () => {
        onSubmit(form.getValues());
    };

    if (isLoading || !uniquenessData) {
        return (
            <div className="h-[350px]">
                <LoadingBlock />
            </div>
        );
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <div className="flex flex-col flex-wrap gap-6">
                        <div className="flex justify-between">
                            <h3 className="text-display-3 text-neutral-90 dark:text-neutral-30">
                                {translate("resources.merchant.uniqueness.deposit")}
                            </h3>
                            <UniqunessActivityButton
                                id={merchantId}
                                directionName="deposit"
                                activityState={activityState}
                                setActivityState={setActivityState}
                                setIsSomethingEdited={setIsSomethingEdited}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="mode"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <Label>{translate("resources.merchant.uniqueness.columns.mode")}</Label>
                                        <Select
                                            value={field.value}
                                            onValueChange={e => {
                                                form.setValue("min", 0);
                                                form.setValue("max", 0);
                                                field.onChange(e);
                                            }}>
                                            <FormControl>
                                                <SelectTrigger
                                                    variant={SelectType.GRAY}
                                                    isError={fieldState.invalid}
                                                    errorMessage={<FormMessage />}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {modes.map(mode => (
                                                        <SelectItem value={mode} key={mode} variant={SelectType.GRAY}>
                                                            {translate(
                                                                "resources.merchant.uniqueness.columns.modes." + mode
                                                            )}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="chance"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                onChange={e => {
                                                    handleOnlyPercentInputChange(e, field);
                                                }}
                                                value={field.value}
                                                label={translate("resources.merchant.uniqueness.columns.chance")}
                                                labelSize="note-1"
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                variant={InputTypes.GRAY}
                                                className="max-w-[85%]"
                                                inputMode="decimal"
                                                percentage
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="min"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    onChange={e => {
                                                        handleInputChange(e, "mode", field);
                                                    }}
                                                    value={field.value}
                                                    label={
                                                        form.getValues("mode") === "percent"
                                                            ? translate("resources.merchant.uniqueness.columns.min")
                                                            : translate(
                                                                  "resources.merchant.uniqueness.columns.min"
                                                              ).split(",")[0]
                                                    }
                                                    labelSize="note-1"
                                                    error={fieldState.invalid}
                                                    errorMessage={<FormMessage />}
                                                    variant={InputTypes.GRAY}
                                                    className="max-w-[85%]"
                                                    inputMode="decimal"
                                                    percentage={form.getValues("mode") === "percent"}
                                                />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="max"
                                render={({ field, fieldState }) => (
                                    <FormItem className="">
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    onChange={e => {
                                                        handleInputChange(e, "mode", field);
                                                    }}
                                                    value={field.value}
                                                    label={
                                                        form.getValues("mode") === "percent"
                                                            ? translate("resources.merchant.uniqueness.columns.max")
                                                            : translate(
                                                                  "resources.merchant.uniqueness.columns.max"
                                                              ).split(",")[0]
                                                    }
                                                    labelSize="note-1"
                                                    error={fieldState.invalid}
                                                    errorMessage={<FormMessage />}
                                                    variant={InputTypes.GRAY}
                                                    className="max-w-[85%]"
                                                    inputMode="decimal"
                                                    percentage={form.getValues("mode") === "percent"}
                                                />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="mt-5 flex justify-between border-t-[1px] border-neutral-90 pt-5 dark:border-neutral-100 md:mt-10 md:pt-10">
                            <h3 className="text-display-3 text-neutral-90 dark:text-neutral-30">
                                {translate("resources.merchant.uniqueness.withdraw") +
                                    " " +
                                    (UNIQUENESS_WITHDRAW_DISABLED
                                        ? "(" + translate("resources.merchant.uniqueness.disabled") + ")"
                                        : "")}
                            </h3>
                            <UniqunessActivityButton
                                id={merchantId}
                                directionName="withdraw"
                                activityState={activityState2}
                                setActivityState={setActivityState2}
                                setIsSomethingEdited={setIsSomethingEdited}
                                disabled={UNIQUENESS_WITHDRAW_DISABLED}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="mode2"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <Label>{translate("resources.merchant.uniqueness.columns.mode")}</Label>
                                        <Select
                                            value={field.value}
                                            onValueChange={e => {
                                                form.setValue("min2", 0);
                                                form.setValue("max2", 0);
                                                field.onChange(e);
                                            }}>
                                            <FormControl>
                                                <SelectTrigger
                                                    variant={SelectType.GRAY}
                                                    isError={fieldState.invalid}
                                                    disabled={UNIQUENESS_WITHDRAW_DISABLED}
                                                    errorMessage={<FormMessage />}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {modes.map(mode => (
                                                        <SelectItem value={mode} key={mode} variant={SelectType.GRAY}>
                                                            {translate(
                                                                "resources.merchant.uniqueness.columns.modes." + mode
                                                            )}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="chance2"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                onChange={e => {
                                                    handleOnlyPercentInputChange(e, field);
                                                }}
                                                value={field.value}
                                                label={translate("resources.merchant.uniqueness.columns.chance")}
                                                labelSize="note-1"
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                variant={InputTypes.GRAY}
                                                className="max-w-[85%]"
                                                inputMode="decimal"
                                                percentage
                                                disabled={UNIQUENESS_WITHDRAW_DISABLED}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="min2"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    onChange={e => {
                                                        handleInputChange(e, "mode2", field);
                                                    }}
                                                    value={field.value}
                                                    label={
                                                        form.getValues("mode2") === "percent"
                                                            ? translate("resources.merchant.uniqueness.columns.min")
                                                            : translate(
                                                                  "resources.merchant.uniqueness.columns.min"
                                                              ).split(",")[0]
                                                    }
                                                    labelSize="note-1"
                                                    error={fieldState.invalid}
                                                    errorMessage={<FormMessage />}
                                                    variant={InputTypes.GRAY}
                                                    className="max-w-[85%]"
                                                    inputMode="decimal"
                                                    percentage={form.getValues("mode2") === "percent"}
                                                    disabled={UNIQUENESS_WITHDRAW_DISABLED}
                                                />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="max2"
                                render={({ field, fieldState }) => (
                                    <FormItem className="">
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    onChange={e => {
                                                        handleInputChange(e, "mode2", field);
                                                    }}
                                                    value={field.value}
                                                    label={
                                                        form.getValues("mode2") === "percent"
                                                            ? translate("resources.merchant.uniqueness.columns.max")
                                                            : translate(
                                                                  "resources.merchant.uniqueness.columns.max"
                                                              ).split(",")[0]
                                                    }
                                                    labelSize="note-1"
                                                    error={fieldState.invalid}
                                                    errorMessage={<FormMessage />}
                                                    variant={InputTypes.GRAY}
                                                    className="max-w-[85%]"
                                                    inputMode="decimal"
                                                    percentage={form.getValues("mode2") === "percent"}
                                                    disabled={UNIQUENESS_WITHDRAW_DISABLED}
                                                />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="ml-auto flex w-full flex-col gap-3 space-x-0 sm:flex-row sm:gap-0 sm:space-x-2 md:w-2/5">
                            <Button
                                onClick={form.handleSubmit(onSubmit)}
                                type="submit"
                                variant="default"
                                className="flex-1"
                                disabled={submitButtonDisabled}>
                                {translate("app.ui.actions.save")}
                            </Button>
                            <Button
                                type="button"
                                variant="outline_gray"
                                className="flex-1"
                                onClick={e => {
                                    e.preventDefault();
                                    if (!saveClicked && isSomethingEdited) {
                                        setConfirmDialogOpen(true);
                                    } else {
                                        setSaveClicked(false);
                                        onOpenChange(false);
                                    }
                                }}>
                                {translate("app.ui.actions.cancel")}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
            <ConfirmCloseDialog
                open={confirmCloseDialogOpen}
                onOpenChange={setConfirmDialogOpen}
                onSave={onSave}
                onClose={onCloseFn}
            />
        </>
    );
};
