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
import { MerchantSettingsActivityButton } from "../../show/Merchant/MerchantSettingsActivityButton";
import { LoadingBlock } from "@/components/ui/loading";
import { useQuery } from "@tanstack/react-query";
import { ConfirmCloseDialog } from "../../show/Mapping/ConfirmCloseDialog";
import { Textarea } from "@/components/ui/textarea";

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

export const MerchantSettings = (props: UniqunessCreateProps) => {
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

    const {
        data: uniquenessData,
        isLoading,
        isFetchedAfterMount
    } = useQuery({
        queryKey: ["merchantUniqueness", merchantId],
        queryFn: async () => {
            try {
                const res = await dataProvider.getMerchantSettings(merchantId);
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

    const formSchema = z
        .object({
            // antifraud: z.boolean(),
            // antifraoud_attempts: z.coerce
            //     .number({ message: translate("resources.merchant.settings.errors.antifraoudAttemptsNan") })
            //     .gte(0, translate("resources.merchant.settings.errors.antifraoudAttemptsMin"))
            //     .lte(100000, translate("resources.merchant.settings.errors.antifraoudAttemptsMax"))
            //     .default(0),
            public_key: z.string().trim().optional(),
            uniqueness: z.boolean(),
            mode: z.enum(modes as [string, ...string[]]),
            min: z.coerce.number().default(0),
            max: z.coerce.number().default(0),
            chance: z.coerce.number().default(0)
        })
        .superRefine(({ max, min }, ctx) => {
            if (min > max) {
                ctx.addIssue({
                    code: "custom",
                    message: translate("resources.merchant.settings.errors.minCantBeLess"),
                    path: ["min"]
                });
            }
        });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            // antifraud: uniquenessData?.antifraud ?? true,
            // antifraoud_attempts: uniquenessData?.antifraoud_attempts ?? 0,
            public_key: uniquenessData?.public_key ?? "",
            uniqueness: uniquenessData?.uniqueness?.deposit?.enable ?? false,
            mode: uniquenessData?.uniqueness?.deposit?.mode ?? modes[0],
            min: uniquenessData?.uniqueness?.deposit?.min ?? 0,
            max: uniquenessData?.uniqueness?.deposit?.max ?? 0,
            chance: uniquenessData?.uniqueness?.deposit?.chance ?? 0
        }
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setSaveClicked(true);
        if (submitButtonDisabled) return;
        setSubmitButtonDisabled(true);
        try {
            const formData = {
                // antifraud: data.antifraud,
                // antifraoud_attempts: data.antifraoud_attempts,
                public_key: data.public_key ?? "",
                uniqueness: {
                    deposit: {
                        mode: data.mode,
                        min: data.min,
                        max: data.max,
                        chance: data.chance,
                        enable: data.uniqueness
                    }
                }
            };
            dataProvider.updateMerchantSettings(merchantId, formData);
            appToast("success", translate("resources.merchant.settings.successMessage"));
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
            else appToast("error", translate("resources.merchant.settings.errors.unexpectedError"));
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
                antifraud: uniquenessData?.antifraud ?? true,
                antifraoud_attempts: uniquenessData?.antifraoud_attempts ?? 0,
                public_key: uniquenessData?.public_key ?? "",
                uniqueness: uniquenessData?.uniqueness?.deposit?.enable ?? false,
                mode: uniquenessData?.uniqueness?.deposit?.mode ?? modes[0],
                min: uniquenessData?.uniqueness?.deposit?.min ?? 0,
                max: uniquenessData?.uniqueness?.deposit?.max ?? 0,
                chance: uniquenessData?.uniqueness?.deposit?.chance ?? 0
            };

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.watch, defaultValues]);

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement>,
        field: ControllerRenderProps<z.infer<typeof formSchema>>
    ) => {
        let value = e.target.value;

        const allowNegative = field.name === "max" || field.name === "min";

        value = value.replace(/[^0-9-]/g, "");

        if (!allowNegative) {
            value = value.replace(/-/g, "");
        } else {
            if (value.includes("-")) {
                const minusCount = (value.match(/-/g) || []).length;
                if (minusCount > 1 || value.indexOf("-") !== 0) {
                    value = value.replace(/-/g, "");
                    if (value.length > 0) {
                        value = "-" + value;
                    }
                }
            }
        }

        if (/^-?0[0-9]+/.test(value)) {
            value = value.replace(/^(-?)0+/, "$1") || "0";
        }

        e.target.value = value;

        if (value === "" || (value === "-" && !allowNegative)) {
            form.setValue(field.name, "");
            return;
        }

        if (value === "-") {
            form.setValue(field.name, value);
            return;
        }

        const numericValue = parseInt(value, 10);
        if (!isNaN(numericValue)) {
            let finalValue = numericValue;

            if (form.getValues("mode") === "percent") {
                if (numericValue > 100) finalValue = 100;
                if (numericValue < -100) finalValue = -100;
                if (!allowNegative && numericValue < 0) finalValue = 0;
            }
            if (form.getValues("mode") === "absolute") {
                if (numericValue > 100000) finalValue = 100000;
                if (numericValue < -100000) finalValue = -100000;
                if (!allowNegative && numericValue < 0) finalValue = 0;
            }

            e.target.value = String(finalValue);
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
            <div className="h-[250px]">
                <LoadingBlock />
            </div>
        );
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <div className="flex flex-col flex-wrap gap-4">
                        <FormField
                            control={form.control}
                            name="public_key"
                            render={({ field }) => {
                                return (
                                    <FormItem className="mb-2">
                                        <Label>{translate("resources.merchant.settings.public_key")}</Label>

                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                value={field.value ?? ""}
                                                spellCheck={false}
                                                className="!mt-0 h-36 w-full resize-none overflow-auto rounded text-title-1 outline-none dark:bg-muted"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />

                        {/* <FormField
                            control={form.control}
                            name="antifraud"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2">
                                    <FormControl>
                                        <>
                                            <p className="text-display-4 text-neutral-90 dark:text-neutral-30">
                                                {translate("resources.merchant.settings.antifraud")}
                                            </p>

                                            <MerchantSettingsActivityButton
                                                id={merchantId}
                                                activityState={field.value}
                                                setActivityState={field.onChange}
                                                setIsSomethingEdited={setIsSomethingEdited}
                                            />
                                        </>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="antifraoud_attempts"
                            render={({ field, fieldState }) => (
                                <FormItem className="mb-2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            onChange={field.onChange}
                                            value={field.value}
                                            label={translate("resources.merchant.settings.antifraoud_attempts")}
                                            labelSize="note-1"
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            variant={InputTypes.GRAY}
                                            className="max-w-[85%]"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        /> */}

                        <FormField
                            control={form.control}
                            name="uniqueness"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between">
                                    <FormControl>
                                        <>
                                            <p className="text-display-4 text-neutral-90 dark:text-neutral-30">
                                                {translate("resources.merchant.settings.uniqueness")}
                                            </p>

                                            <MerchantSettingsActivityButton
                                                id={merchantId}
                                                activityState={field.value}
                                                setActivityState={field.onChange}
                                                setIsSomethingEdited={setIsSomethingEdited}
                                            />
                                        </>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="mode"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <Label>{translate("resources.merchant.settings.columns.mode")}</Label>
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
                                                                "resources.merchant.settings.columns.modes." + mode
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
                                                label={translate("resources.merchant.settings.columns.chance")}
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
                                                        handleInputChange(e, field);
                                                    }}
                                                    value={field.value}
                                                    label={
                                                        form.getValues("mode") === "percent"
                                                            ? translate("resources.merchant.settings.columns.min")
                                                            : translate(
                                                                  "resources.merchant.settings.columns.min"
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
                                                        handleInputChange(e, field);
                                                    }}
                                                    value={field.value}
                                                    label={
                                                        form.getValues("mode") === "percent"
                                                            ? translate("resources.merchant.settings.columns.max")
                                                            : translate(
                                                                  "resources.merchant.settings.columns.max"
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

                        <div className="ml-auto mt-2 flex w-full flex-col gap-3 space-x-0 sm:flex-row sm:gap-0 sm:space-x-2 md:w-2/5">
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
