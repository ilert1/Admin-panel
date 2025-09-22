import {
    useCreateController,
    useRefresh,
    CreateContextProvider,
    useTranslate,
    useDataProvider,
    useListContext
} from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import { useCallback, useEffect, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingBlock } from "@/components/ui/loading";
import { useTheme } from "@/components/providers";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TerminalWithId } from "@/data/terminals";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useSheets } from "@/components/providers/SheetProvider";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { TerminalCreate as ITerminalCreate, PaymentTypeModel } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { ProviderSelect } from "../components/Selects/ProviderSelect";
import { useCurrenciesListWithoutPagination, useProvidersListWithoutPagination } from "@/hooks";
import { PaymentTypeMultiSelect } from "../components/MultiSelectComponents/PaymentTypeMultiSelect";
import { CurrencySelect } from "../components/Selects/CurrencySelect";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectType,
    SelectValue
} from "@/components/ui/select";
import { CountrySelect } from "../components/Selects/CountrySelect";

export interface TerminalCreateProps {
    onClose: () => void;
}

export const TerminalCreate = ({ onClose }: TerminalCreateProps) => {
    const { providersData, providersLoadingProcess } = useProvidersListWithoutPagination();
    const { currenciesData, currenciesLoadingProcess } = useCurrenciesListWithoutPagination();

    const refresh = useRefresh();
    const translate = useTranslate();
    const appToast = useAppToast();
    const { openSheet } = useSheets();

    const { theme } = useTheme();
    const { filterValues } = useListContext();
    const dataProvider = useDataProvider();
    const controllerProps = useCreateController<TerminalWithId>();

    const [monacoEditorMounted, setMonacoEditorMounted] = useState(false);
    const [hasErrors, setHasErrors] = useState(false);
    const [hasValid, setHasValid] = useState(true);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [availablePaymentTypes, setAvailablePaymentTypes] = useState<PaymentTypeModel[]>([]);
    const [currentCountryCodeName, setCurrentCountryCodeName] = useState("");

    const formSchema = z
        .object({
            provider: z
                .string()
                .min(1, translate("resources.terminals.errors.provider"))
                .refine(val => {
                    if (val) {
                        const foundProvider = providersData?.find(item => item.name === val);
                        if (foundProvider?.payment_types?.length === 0) {
                            return false;
                        }
                        return true;
                    }
                    return true;
                }, translate("resources.terminals.errors.providerHasNoPaymentTypes")),
            verbose_name: z.string().min(1, translate("resources.terminals.errors.verbose_name")).trim(),
            description: z.union([z.string().trim(), z.literal("")]),
            details: z.string().trim().optional(),
            allocation_timeout_seconds: z
                .literal("")
                .transform(() => undefined)
                .or(
                    z.coerce
                        .number({ message: translate("resources.terminals.errors.allocation_timeout_seconds") })
                        .int({ message: translate("resources.terminals.errors.allocation_timeout_seconds") })
                        .min(0, translate("resources.terminals.errors.allocation_timeout_seconds_min"))
                        .max(120, translate("resources.terminals.errors.allocation_timeout_seconds_max"))
                )
                .optional(),
            payment_types: z.array(z.string()).optional().default([]),
            src_currency_code: z.string().min(1, translate("resources.direction.errors.src_curr")),
            dst_currency_code: z.string().min(1, translate("resources.direction.errors.dst_curr")),
            dst_country_code: z
                .string()
                .regex(/^\w{2}$/, translate("resources.paymentSettings.financialInstitution.errors.country_code"))
                .trim(),
            callback_url: z.string().optional().nullable().default(null),
            minTTL: z.coerce
                .number()
                .min(0, translate("app.widgets.limits.errors.minTooSmallForOne"))
                .max(999999999.99),
            maxTTL: z.coerce.number().min(0, translate("app.widgets.limits.errors.minTooSmallForOne")).max(999999999.99)
        })
        .refine(
            data => {
                if (data.maxTTL === 0) {
                    return true;
                }

                return data.minTTL <= data.maxTTL;
            },
            {
                message: translate("app.widgets.ttl.errors.minGreaterThanMax"),
                path: ["maxTTL"]
            }
        );

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            provider: "",
            verbose_name: "",
            description: "",
            details: "{}",
            allocation_timeout_seconds: 2,
            payment_types: [],
            src_currency_code: "",
            dst_currency_code: "",
            dst_country_code: "",
            maxTTL: 0,
            minTTL: 0,
            callback_url: ""
        }
    });

    useEffect(() => {
        if (filterValues?.provider && providersData && providersData?.length > 0) {
            const providerFromFilter = providersData.find(item => item.name === filterValues.provider);

            if (providerFromFilter) {
                form.setValue("provider", filterValues.provider);
                if (providerFromFilter?.payment_types?.length === 0) {
                    form.setError("provider", {
                        type: "",
                        message: translate("resources.terminals.errors.providerHasNoPaymentTypes")
                    });
                    return;
                } else if (providerFromFilter) {
                    form.clearErrors("provider");
                    setAvailablePaymentTypes(providerFromFilter?.payment_types || []);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [providersData]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;

        setSubmitButtonDisabled(true);

        try {
            const res = await dataProvider.create<TerminalWithId>("terminals", {
                data: {
                    ...data,
                    settings: { ttl: { min: data.minTTL, max: data.maxTTL } },
                    details: data.details && data.details.length !== 0 ? JSON.parse(data.details) : {},
                    ...(data.allocation_timeout_seconds !== undefined && {
                        allocation_timeout_seconds: data.allocation_timeout_seconds
                    })
                } as ITerminalCreate
            });

            appToast(
                "success",
                <span>
                    {translate("resources.terminals.success.create", { name: data.verbose_name })}
                    <Button
                        className="!pl-1"
                        variant="resourceLink"
                        onClick={() => openSheet("terminal", { id: res.data.id })}>
                        {translate("app.ui.actions.details")}
                    </Button>
                </span>,
                translate("app.ui.toast.success"),
                10000
            );

            refresh();
            form.reset();
            onClose();
        } catch (error) {
            if (error instanceof Error) {
                appToast(
                    "error",
                    error.message.includes("already exist")
                        ? translate("resources.provider.errors.alreadyInUse")
                        : error.message
                );
            } else {
                appToast("error", translate("app.ui.create.createError"));
            }
        } finally {
            setSubmitButtonDisabled(false);
        }
    };

    useEffect(() => {
        if (controllerProps.record) {
            form.reset({
                provider: "",
                verbose_name: "",
                description: "",
                details: "{}",
                allocation_timeout_seconds: 2,
                payment_types: [],
                src_currency_code: "",
                dst_currency_code: "",
                maxTTL: 0,
                minTTL: 0,
                callback_url: ""
            });
        }
    }, [form, controllerProps.record]);

    const val = form.watch("provider");

    useEffect(() => {
        if (val) {
            const foundProvider = providersData?.find(item => item.name === val);

            if (foundProvider?.payment_types?.length === 0) {
                form.setError("provider", {
                    type: "",
                    message: translate("resources.terminals.errors.providerHasNoPaymentTypes")
                });
                setAvailablePaymentTypes([]);
                form.resetField("payment_types");
                return;
            } else if (val) {
                form.clearErrors("provider");
                setAvailablePaymentTypes(foundProvider?.payment_types || []);
            }
        } else {
            form.clearErrors("provider");
            setAvailablePaymentTypes([]);
            form.resetField("payment_types");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [providersData, val]);

    const handleChange = useCallback(
        (key: "minTTL" | "maxTTL", value: string) => {
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

                if (numericValue > 100000) {
                    finalValue = 100000;
                }
                if (numericValue < 0) {
                    finalValue = 0;
                }

                form.setValue(key, finalValue);
            }
        },
        [form]
    );

    if (controllerProps.isLoading || theme.length === 0) return <LoadingBlock />;

    return (
        <CreateContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                    <div className="flex flex-wrap">
                        <div className="flex w-full flex-col gap-2">
                            <div className="grid w-full gap-x-4 gap-y-2 sm:grid-cols-2 md:grid-cols-3">
                                <div className="col-span-2 md:col-span-1">
                                    <FormField
                                        control={form.control}
                                        name="provider"
                                        render={({ field, fieldState }) => (
                                            <FormItem className="w-full">
                                                <Label>{translate("resources.direction.provider")}</Label>
                                                <ProviderSelect
                                                    providers={providersData || []}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    isError={fieldState.invalid}
                                                    errorMessage={fieldState.error?.message}
                                                    disabled={providersLoadingProcess}
                                                    modal
                                                    isLoading={providersLoadingProcess}
                                                />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <FormField
                                        control={form.control}
                                        name="verbose_name"
                                        render={({ field, fieldState }) => (
                                            <FormItem className="w-full">
                                                <FormControl>
                                                    <Input
                                                        label={translate("resources.terminals.fields.verbose_name")}
                                                        autoCorrect="off"
                                                        autoCapitalize="none"
                                                        spellCheck="false"
                                                        error={fieldState.invalid}
                                                        errorMessage={<FormMessage />}
                                                        variant={InputTypes.GRAY}
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="src_currency_code"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <Label>{translate("resources.direction.sourceCurrency")}</Label>
                                            <CurrencySelect
                                                currencies={currenciesData || []}
                                                value={field.value}
                                                onChange={field.onChange}
                                                isError={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                disabled={currenciesLoadingProcess}
                                                modal
                                            />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="dst_currency_code"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <Label>{translate("resources.direction.destinationCurrency")}</Label>
                                            <CurrencySelect
                                                currencies={currenciesData || []}
                                                value={field.value}
                                                onChange={field.onChange}
                                                isError={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                disabled={currenciesLoadingProcess}
                                                modal
                                            />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="dst_country_code"
                                    render={({ field, fieldState }) => {
                                        return (
                                            <FormItem>
                                                <Label>{translate("resources.direction.destinationCountry")}</Label>

                                                <CountrySelect
                                                    value={currentCountryCodeName}
                                                    onChange={setCurrentCountryCodeName}
                                                    setIdValue={field.onChange}
                                                    isError={fieldState.invalid}
                                                    errorMessage={fieldState.error?.message}
                                                    modal
                                                />
                                            </FormItem>
                                        );
                                    }}
                                />

                                <FormField
                                    control={form.control}
                                    name="allocation_timeout_seconds"
                                    render={({ field, fieldState }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Input
                                                    label={translate(
                                                        "resources.terminals.fields.allocation_timeout_seconds"
                                                    )}
                                                    autoCorrect="off"
                                                    autoCapitalize="none"
                                                    spellCheck="false"
                                                    error={fieldState.invalid}
                                                    errorMessage={<FormMessage />}
                                                    variant={InputTypes.GRAY}
                                                    {...field}
                                                    onChange={e => {
                                                        const value = e.target.value.replace(/\D/, "");
                                                        field.onChange(value);
                                                    }}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="minTTL"
                                    render={({ field, fieldState }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    label={translate("app.widgets.ttl.minTTL")}
                                                    error={fieldState.invalid}
                                                    errorMessage={<FormMessage />}
                                                    className=""
                                                    value={field.value ?? ""}
                                                    variant={InputTypes.GRAY}
                                                    onChange={e => handleChange("minTTL", e.target.value)}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="maxTTL"
                                    render={({ field, fieldState }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    label={translate("app.widgets.ttl.maxTTL")}
                                                    error={fieldState.invalid}
                                                    errorMessage={<FormMessage />}
                                                    className=""
                                                    value={field.value ?? ""}
                                                    variant={InputTypes.GRAY}
                                                    onChange={e => handleChange("maxTTL", e.target.value)}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                <FormField
                                    control={form.control}
                                    name="payment_types"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2 w-full sm:col-span-1">
                                            <FormControl>
                                                <PaymentTypeMultiSelect
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    options={availablePaymentTypes || []}
                                                    disabled={submitButtonDisabled || !form.getValues("provider")}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="callback_url"
                                    render={({ field, fieldState }) => (
                                        <FormItem className="col-span-2 w-full sm:col-span-1">
                                            <FormControl>
                                                <Input
                                                    label={translate(
                                                        "resources.callbridge.mapping.fields.callback_url"
                                                    )}
                                                    autoCorrect="off"
                                                    autoCapitalize="none"
                                                    spellCheck="false"
                                                    error={fieldState.invalid}
                                                    errorMessage={<FormMessage />}
                                                    variant={InputTypes.GRAY}
                                                    {...field}
                                                    value={field.value || ""}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2 w-full sm:col-span-1">
                                            <Label className="">
                                                {translate("resources.terminals.fields.description")}
                                            </Label>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    placeholder={translate("resources.wallet.manage.fields.descr")}
                                                    className="!mt-0 h-48 w-full resize-none overflow-auto rounded p-2 text-title-1 outline-none dark:bg-muted"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="details"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2 w-full sm:col-span-1">
                                            <Label>{translate("resources.terminals.fields.details")}</Label>
                                            <FormControl>
                                                <MonacoEditor
                                                    width="100%"
                                                    onMountEditor={() => setMonacoEditorMounted(true)}
                                                    onErrorsChange={setHasErrors}
                                                    onValidChange={setHasValid}
                                                    code={field.value ?? "{}"}
                                                    setCode={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* <TTL
                                ttl={}
                                editClicked={editClicked}
                                setEditClicked={setEditClicked}
                            /> */}
                        </div>

                        <div className="ml-auto mt-6 flex w-full flex-col space-x-0 p-2 sm:flex-row sm:space-x-2 md:w-2/5">
                            <Button
                                type="submit"
                                variant="default"
                                className="w-full sm:w-1/2"
                                disabled={
                                    hasErrors ||
                                    (!hasValid && form.watch("details")?.length !== 0) ||
                                    !monacoEditorMounted ||
                                    submitButtonDisabled
                                }>
                                {translate("app.ui.actions.save")}
                            </Button>
                            <Button
                                type="button"
                                variant="outline_gray"
                                className="mt-4 w-full flex-1 sm:mt-0 sm:w-1/2"
                                onClick={() => {
                                    form.reset();
                                    onClose();
                                }}>
                                {translate("app.ui.actions.cancel")}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </CreateContextProvider>
    );
};
