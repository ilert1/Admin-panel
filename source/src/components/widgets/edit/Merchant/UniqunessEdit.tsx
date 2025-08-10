import { useTranslate, useRefresh } from "react-admin";
import { useForm } from "react-hook-form";
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
import { useEffect, useState } from "react";
import { MerchantsDataProvider } from "@/data";

interface UniqunessEditProps {
    merchantId: string;
    directionName: UniqunessDirectionType;
    onOpenChange: (state: boolean) => void;
    prevData: UniquenessResponse;
}

const modes = ["percent", "absolute"];

export const UniqunessEdit = (props: UniqunessEditProps) => {
    const { merchantId, directionName, onOpenChange, prevData } = props;
    const translate = useTranslate();
    const refresh = useRefresh();
    const appToast = useAppToast();
    const dataProvider = new MerchantsDataProvider();

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const formSchema = z
        .object({
            mode: z.enum(modes as [string, ...string[]]),
            min: z.coerce.number().refine(val => /^-?\d+(\.\d{1,2})?$/.test(val.toString()), {
                message: "Можно максимум 2 знака после запятой"
            }),
            max: z.coerce.number().refine(val => /^-?\d+(\.\d{1,2})?$/.test(val.toString()), {
                message: "Можно максимум 2 знака после запятой"
            }),
            chance: z.coerce.number().refine(val => /^-?\d+(\.\d{1,2})?$/.test(val.toString()), {
                message: "Можно максимум 2 знака после запятой"
            })
        })
        .superRefine(({ max, min }, ctx) => {
            if (min > max) {
                ctx.addIssue({
                    code: "custom",
                    message: translate("resources.merchant.uniqueness.errors.minCantBeLess"),
                    path: ["min"]
                });
            }
        });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            mode: modes[0],
            min: 0,
            max: 0,
            chance: 0
        }
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;
        setSubmitButtonDisabled(true);
        try {
            dataProvider.updateMerchantUniqueness(merchantId, directionName, prevData.uniqueness, data);
            appToast("success", "resources.merchant.uniqueness.successMessage");
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
        } finally {
            refresh();
            setSubmitButtonDisabled(false);
            onOpenChange(false);
        }
    };

    useEffect(() => {
        if (!isLoadingFinancialInstitutionData && financialInstitutionData && isFetchedAfterMount) {
            const updatedValues = {
                name: financialInstitutionData.name || "",
                country_code: financialInstitutionData.country_code || "",
                legal_name: financialInstitutionData.legal_name || "",
                nspk_member_id: financialInstitutionData.nspk_member_id || "",
                bin: financialInstitutionData.bin || "",
                currencies: financialInstitutionData.currencies?.map(c => c.code) || [],
                institution_type: financialInstitutionData.institution_type || undefined,
                payment_types: financialInstitutionData.payment_types?.map(pt => pt.code) || [],
                meta: JSON.stringify(financialInstitutionData.meta, null, 2) || "{}"
            };

            setCurrentCountryCodeName(
                countryCodes.find(code => code.alpha2 === financialInstitutionData.country_code)?.name || ""
            );

            form.reset(updatedValues);
            setIsFinished(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [financialInstitutionData, isLoadingFinancialInstitutionData, isFetchedAfterMount]);

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <div className="flex flex-col flex-wrap gap-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="mode"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <Label>{translate("resources.direction.types.type")}</Label>
                                        <Select value={field.value} onValueChange={field.onChange}>
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
                                                            {mode}
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
                                                label={translate("resources.merchant.uniqueness.columns.chance")}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                value={field.value ?? ""}
                                                variant={InputTypes.GRAY}
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
                                                        let value = e.target.value;

                                                        value = value.replace(/[^0-9.-]/g, "");

                                                        if (value.includes("-")) {
                                                            value = value.replace(/-/g, "");
                                                            value = "-" + value;
                                                        }

                                                        const parts = value.split(".");
                                                        if (parts.length > 2) {
                                                            value = parts[0] + "." + parts[1];
                                                        }

                                                        if (parts.length === 2 && parts[1].length > 2) {
                                                            parts[1] = parts[1].slice(0, 2);
                                                            value = parts.join(".");
                                                        }

                                                        if (
                                                            /^-?0[0-9]+/.test(value) &&
                                                            !value.startsWith("0.") &&
                                                            !value.startsWith("-0.")
                                                        ) {
                                                            value = value.replace(/^(-?)0+/, "$1") || "0";
                                                        }

                                                        if (value === "." || value === "-.") {
                                                            value = value.replace(".", "0.");
                                                        }

                                                        field.onChange(value);
                                                    }}
                                                    value={field.value}
                                                    label={translate("resources.merchant.uniqueness.columns.min")}
                                                    labelSize="note-1"
                                                    error={fieldState.invalid}
                                                    errorMessage={<FormMessage />}
                                                    variant={InputTypes.GRAY}
                                                    borderColor="border-neutral-60"
                                                    className="max-w-[85%]"
                                                    inputMode="decimal"
                                                    percentage
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
                                                        let value = e.target.value;

                                                        value = value.replace(/[^0-9.-]/g, "");

                                                        if (value.includes("-")) {
                                                            value = value.replace(/-/g, "");
                                                            value = "-" + value;
                                                        }

                                                        const parts = value.split(".");
                                                        if (parts.length > 2) {
                                                            value = parts[0] + "." + parts[1];
                                                        }

                                                        if (parts.length === 2 && parts[1].length > 2) {
                                                            parts[1] = parts[1].slice(0, 2);
                                                            value = parts.join(".");
                                                        }

                                                        if (
                                                            /^-?0[0-9]+/.test(value) &&
                                                            !value.startsWith("0.") &&
                                                            !value.startsWith("-0.")
                                                        ) {
                                                            value = value.replace(/^(-?)0+/, "$1") || "0";
                                                        }

                                                        if (value === "." || value === "-.") {
                                                            value = value.replace(".", "0.");
                                                        }

                                                        field.onChange(value);
                                                    }}
                                                    value={field.value}
                                                    label={translate("resources.merchant.uniqueness.columns.min")}
                                                    labelSize="note-1"
                                                    error={fieldState.invalid}
                                                    errorMessage={<FormMessage />}
                                                    variant={InputTypes.GRAY}
                                                    borderColor="border-neutral-60"
                                                    className="max-w-[85%]"
                                                    inputMode="decimal"
                                                    percentage
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
                                variant="default"
                                className="flex-1"
                                disabled={submitButtonDisabled}>
                                {translate("app.ui.actions.save")}
                            </Button>
                            <Button
                                type="button"
                                variant="outline_gray"
                                className="flex-1"
                                onClick={() => onOpenChange(false)}>
                                {translate("app.ui.actions.cancel")}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </>
    );
};
