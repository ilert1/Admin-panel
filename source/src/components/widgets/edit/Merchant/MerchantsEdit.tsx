import { useTranslate, useDataProvider, useRefresh } from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { Loading } from "@/components/ui/loading";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormItem, FormMessage, FormControl, FormField } from "@/components/ui/form";
import { useCurrenciesListWithoutPagination, useFetchDictionaries, usePreventFocus } from "@/hooks";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useGetPaymentTypes } from "@/hooks/useGetPaymentTypes";
import { MerchantsDataProvider } from "@/data";
import { useQuery } from "@tanstack/react-query";
import { PaymentTypeMultiSelect } from "../../components/MultiSelectComponents/PaymentTypeMultiSelect";
import { CurrenciesMultiSelect } from "../../components/MultiSelectComponents/CurrenciesMultiSelect";
import { MerchantSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";

interface MerchantEditProps {
    id?: string;
    onOpenChange: (state: boolean) => void;
}

export const MerchantEdit = ({ id = "", onOpenChange }: MerchantEditProps) => {
    const { currenciesData, currenciesLoadingProcess } = useCurrenciesListWithoutPagination();

    const data = useFetchDictionaries();
    const dataProvider = useDataProvider();
    const merchantsDataProvider = new MerchantsDataProvider();
    const [isFinished, setIsFinished] = useState(false);

    const appToast = useAppToast();

    const {
        data: merchant,
        isLoading: isLoadingMerchant,
        isFetchedAfterMount
    } = useQuery({
        queryKey: ["merchant", id],
        queryFn: ({ signal }) => dataProvider.getOne<MerchantSchema>("merchant", { id, signal }),
        enabled: true,
        select: data => data.data
    });

    const translate = useTranslate();
    const refresh = useRefresh();
    const { allPaymentTypes, isLoadingAllPaymentTypes } = useGetPaymentTypes({});

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const formSchema = z
        .object({
            id: z.string().min(1, translate("resources.merchant.errors.id")).trim(),
            name: z.string().min(1, translate("resources.merchant.errors.name")).trim(),
            description: z.string().trim().nullable(),
            keycloak_id: z
                .string()
                .nullable()
                .refine(value => value === null || !/\s/.test(value), {
                    message: translate("resources.merchant.errors.noSpaces")
                }),
            payment_types: z.array(z.string()).optional(),
            allowed_src_currencies: z.array(z.string()).optional(),
            minTTLDep: z.coerce
                .number()
                .min(0, translate("app.widgets.limits.errors.minTooSmallForOne"))
                .max(999999999.99),
            maxTTLDep: z.coerce
                .number()
                .min(0, translate("app.widgets.limits.errors.minTooSmallForOne"))
                .max(999999999.99),
            minTTLWith: z.coerce
                .number()
                .min(0, translate("app.widgets.limits.errors.minTooSmallForOne"))
                .max(999999999.99),
            maxTTLWith: z.coerce
                .number()
                .min(0, translate("app.widgets.limits.errors.minTooSmallForOne"))
                .max(999999999.99),
            maxConnectionTTL: z.coerce
                .number()
                .min(0, translate("app.widgets.limits.errors.minTooSmallForOne"))
                .max(600001)
        })
        .refine(
            data => {
                if (data.maxTTLDep === 0) {
                    return true;
                }

                return data.minTTLDep <= data.maxTTLDep;
            },
            {
                message: translate("app.widgets.ttl.errors.minGreaterThanMax"),
                path: ["maxTTLDep"]
            }
        )
        .refine(
            data => {
                if (data.maxTTLWith === 0) {
                    return true;
                }

                return data.minTTLWith <= data.maxTTLWith;
            },
            {
                message: translate("app.widgets.ttl.errors.minGreaterThanMax"),
                path: ["maxTTLWith"]
            }
        );

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: "",
            name: "",
            description: "",
            keycloak_id: "",
            payment_types: [],
            allowed_src_currencies: [],
            minTTLDep: 0,
            maxTTLDep: 0,
            minTTLWith: 0,
            maxTTLWith: 0,
            maxConnectionTTL: 0
        }
    });

    useEffect(() => {
        if (!isLoadingMerchant && merchant && isFetchedAfterMount) {
            const updatedValues = {
                id: merchant.id || "",
                name: merchant.name || "",
                description: merchant.description || "",
                keycloak_id: merchant.keycloak_id || "",
                payment_types: merchant?.payment_types?.map(pt => pt.code) || [],
                allowed_src_currencies:
                    (merchant?.allowed_src_currencies &&
                        merchant?.allowed_src_currencies?.length &&
                        merchant.allowed_src_currencies.map(el => el.code)) ||
                    [],
                minTTLDep: merchant?.settings?.deposit?.ttl?.min || 0,
                maxTTLDep: merchant?.settings?.deposit?.ttl?.max || 0,
                minTTLWith: merchant?.settings?.withdraw?.ttl?.min || 0,
                maxTTLWith: merchant?.settings?.withdraw?.ttl?.max || 0,
                maxConnectionTTL: merchant?.settings?.connection?.ttl?.max || 0
            };

            form.reset(updatedValues);
            setIsFinished(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [merchant, isLoadingMerchant, isFetchedAfterMount]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;
        setSubmitButtonDisabled(true);

        let payment_types: string[] = [];
        let oldPaymentTypes: Set<string> = new Set();

        if (merchant?.payment_types) {
            oldPaymentTypes = new Set(merchant?.payment_types?.map(pt => pt.code));
        }

        if (data.payment_types) {
            payment_types = [...data.payment_types];
            delete data.payment_types;
        }

        const paymentsToDelete = oldPaymentTypes.difference(new Set(payment_types));

        try {
            await dataProvider.update("merchant", {
                id,
                data: {
                    ...data,
                    settings: {
                        deposit: {
                            ttl: {
                                min: data.minTTLDep,
                                max: data.maxTTLDep
                            }
                        },
                        withdraw: {
                            ttl: {
                                min: data.minTTLWith,
                                max: data.maxTTLWith
                            }
                        },
                        connection: {
                            ttl: {
                                max: data.maxConnectionTTL
                            }
                        }
                    }
                },
                previousData: undefined
            });

            await Promise.all(
                [...paymentsToDelete].map(payment =>
                    merchantsDataProvider.removePaymentType({
                        id,
                        data: { code: payment },
                        previousData: undefined
                    })
                )
            );

            await merchantsDataProvider.addPaymentTypes({
                id,
                data: {
                    codes: payment_types
                },
                previousData: undefined
            });

            appToast("success", translate("app.ui.edit.editSuccess"));
            onOpenChange(false);
        } catch (error) {
            appToast("error", translate("resources.currency.errors.alreadyInUse"));
            setSubmitButtonDisabled(false);
        } finally {
            refresh();
        }
    };

    const handleChange = (
        key: "minTTLDep" | "maxTTLDep" | "minTTLWith" | "maxTTLWith" | "maxConnectionTTL",
        value: string
    ) => {
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
            form.resetField(key);
            return;
        }

        if (value.endsWith(".") || value === "0.") {
            return;
        }

        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
            let finalValue = numericValue;

            if (numericValue > 60000) {
                finalValue = 60000;
            }
            if (numericValue < 0) {
                finalValue = 0;
            }

            form.setValue(key, finalValue);
        }
    };

    usePreventFocus({ dependencies: [merchant] });

    if (isLoadingMerchant || !merchant || !data || isLoadingAllPaymentTypes || !isFinished)
        return (
            <div className="h-[200px]">
                <Loading />
            </div>
        );
    return (
        <>
            <Form {...form}>
                <form className="space-y-6">
                    <div className="flex flex-wrap">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full p-2 sm:w-1/2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            variant={InputTypes.GRAY}
                                            label={translate("resources.merchant.fields.name")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="id"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full p-2 sm:w-1/2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled
                                            variant={InputTypes.GRAY}
                                            label={translate("resources.merchant.fields.id")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full p-2 sm:w-1/2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value ?? ""}
                                            variant={InputTypes.GRAY}
                                            label={translate("resources.merchant.fields.descr")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="keycloak_id"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full p-2 sm:w-1/2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value ?? ""}
                                            variant={InputTypes.GRAY}
                                            label="Keycloak ID"
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="maxConnectionTTL"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full p-2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            label={translate("app.widgets.ttl.maxConnectionTTL")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            className=""
                                            value={field.value ?? ""}
                                            variant={InputTypes.GRAY}
                                            onChange={e => handleChange("maxConnectionTTL", e.target.value)}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="minTTLDep"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full p-2 sm:w-1/2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            label={translate("app.widgets.ttl.minTTLDep")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            className=""
                                            value={field.value ?? ""}
                                            variant={InputTypes.GRAY}
                                            onChange={e => handleChange("minTTLDep", e.target.value)}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="maxTTLDep"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full p-2 sm:w-1/2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            label={translate("app.widgets.ttl.maxTTLDep")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            className=""
                                            value={field.value ?? ""}
                                            variant={InputTypes.GRAY}
                                            onChange={e => handleChange("maxTTLDep", e.target.value)}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="minTTLWith"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full p-2 sm:w-1/2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            label={translate("app.widgets.ttl.minTTLWith")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            className=""
                                            value={field.value ?? ""}
                                            variant={InputTypes.GRAY}
                                            onChange={e => handleChange("minTTLWith", e.target.value)}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="maxTTLWith"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full p-2 sm:w-1/2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            label={translate("app.widgets.ttl.maxTTLWith")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            className=""
                                            value={field.value ?? ""}
                                            variant={InputTypes.GRAY}
                                            onChange={e => handleChange("maxTTLWith", e.target.value)}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="payment_types"
                            render={({ field }) => (
                                <FormItem className="w-full p-2">
                                    <FormControl>
                                        <PaymentTypeMultiSelect
                                            value={field.value}
                                            onChange={field.onChange}
                                            options={allPaymentTypes || []}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="allowed_src_currencies"
                            render={({ field }) => (
                                <FormItem className="w-full p-2">
                                    <CurrenciesMultiSelect
                                        labelValue={translate("resources.merchant.fields.currencies")}
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={currenciesData || []}
                                        isLoading={currenciesLoadingProcess}
                                    />
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>
            <div className="ml-auto flex w-full flex-col gap-3 space-x-0 p-2 sm:flex-row sm:gap-0 sm:space-x-2 md:w-2/5">
                <Button
                    onClick={form.handleSubmit(onSubmit)}
                    variant="default"
                    className="flex-1"
                    disabled={submitButtonDisabled}>
                    {translate("app.ui.actions.save")}
                </Button>
                <Button type="button" variant="outline_gray" className="flex-1" onClick={() => onOpenChange(false)}>
                    {translate("app.ui.actions.cancel")}
                </Button>
            </div>
        </>
    );
};
