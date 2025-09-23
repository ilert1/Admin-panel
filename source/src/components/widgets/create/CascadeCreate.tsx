import { useCreateController, CreateContextProvider, useTranslate, useRefresh } from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading } from "@/components/ui/loading";
import { useTheme } from "@/components/providers";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { Label } from "@/components/ui/label";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectType,
    SelectValue
} from "@/components/ui/select";
import { CurrencySelect } from "../components/Selects/CurrencySelect";
import { useCurrenciesListWithoutPagination } from "@/hooks";
import { CascadesDataProvider } from "@/data";
import { PaymentTypeMultiSelect } from "../components/MultiSelectComponents/PaymentTypeMultiSelect";
import { useGetPaymentTypes } from "@/hooks/useGetPaymentTypes";
import { CASCADE_KIND, CASCADE_TYPE } from "@/data/cascades";
import { CountrySelect } from "../components/Selects/CountrySelect";
import { useSheets } from "@/components/providers/SheetProvider";
import { useErrorHandler } from "@/hooks/useErrorHandler";

export const CascadeCreate = ({ onClose = () => {} }: { onClose?: () => void }) => {
    const cascadesDataProvider = new CascadesDataProvider();
    const controllerProps = useCreateController();
    const { theme } = useTheme();
    const appToast = useAppToast();
    const translate = useTranslate();
    const refresh = useRefresh();
    const { openSheet } = useSheets();
    const { parseError } = useErrorHandler();

    const { currenciesData, isCurrenciesLoading, currenciesLoadingProcess } = useCurrenciesListWithoutPagination();
    const { allPaymentTypes, isLoadingAllPaymentTypes } = useGetPaymentTypes({});

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [hasErrors, setHasErrors] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [monacoEditorMounted, setMonacoEditorMounted] = useState(false);
    const [currentCountryCodeName, setCurrentCountryCodeName] = useState("");

    const formSchema = z.object({
        name: z.string().min(1, translate("resources.cascadeSettings.cascades.errors.name")).trim(),
        type: z.enum([CASCADE_TYPE[0], ...CASCADE_TYPE.slice(0)]).default(CASCADE_TYPE[0]),
        priority_policy: z.object({
            rank: z.coerce
                .number({ message: translate("resources.cascadeSettings.cascades.errors.rankRequired") })
                .int(translate("resources.cascadeSettings.cascades.errors.rankRequired"))
                .min(1, translate("resources.cascadeSettings.cascades.errors.rankMin"))
        }),
        src_currency_code: z
            .string()
            .min(1, translate("resources.cascadeSettings.cascades.errors.src_currency_code"))
            .trim(),
        dst_country_code: z
            .string()
            .regex(/^\w{2}$/, translate("resources.paymentSettings.financialInstitution.errors.country_code"))
            .trim()
            .optional()
            .or(z.literal("")),
        cascade_kind: z.enum([CASCADE_KIND[0], ...CASCADE_KIND.slice(0)]).default(CASCADE_KIND[0]),
        payment_types: z.array(z.string()).optional().default([]),
        description: z.string().trim().optional(),
        details: z.string().trim().optional()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: CASCADE_TYPE[0],
            priority_policy: {
                rank: undefined
            },
            src_currency_code: "",
            dst_country_code: "",
            cascade_kind: CASCADE_KIND[0],
            payment_types: [],
            description: "",
            details: "{}"
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;

        setSubmitButtonDisabled(true);

        try {
            const res = await cascadesDataProvider.create("cascades", {
                data: {
                    ...data,
                    dst_country_code: data.dst_country_code || null,
                    details: data.details && data.details.length !== 0 ? JSON.parse(data.details) : {}
                }
            });

            appToast(
                "success",
                <span>
                    {translate("resources.cascadeSettings.cascades.successCreate", { name: data.name })}
                    <Button
                        className="!pl-1"
                        variant="resourceLink"
                        onClick={() => openSheet("cascade", { id: res.data.id })}>
                        {translate("app.ui.actions.details")}
                    </Button>
                </span>,
                translate("app.ui.toast.success"),
                10000
            );

            refresh();
            onClose();
        } catch (error) {
            appToast(
                "error",
                parseError({
                    error,
                    alreadyExistText: translate("resources.cascadeSettings.cascades.errors.alreadyExist")
                })
            );
        } finally {
            setSubmitButtonDisabled(false);
        }
    };

    if (controllerProps.isLoading || isCurrenciesLoading || theme.length === 0)
        return (
            <div className="h-[300px]">
                <Loading />
            </div>
        );

    return (
        <CreateContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                    <div className="grid grid-cols-1 gap-4 p-2 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field, fieldState }) => (
                                <FormItem className="col-span-1 sm:col-span-2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            variant={InputTypes.GRAY}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            label={translate("resources.cascadeSettings.cascades.fields.name")}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field, fieldState }) => (
                                <FormItem className="col-span-1 sm:col-span-2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            variant={InputTypes.GRAY}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            label={translate("resources.cascadeSettings.cascades.fields.description")}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="src_currency_code"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <Label>
                                        {translate("resources.cascadeSettings.cascades.fields.src_currency_code")}
                                    </Label>
                                    <CurrencySelect
                                        currencies={currenciesData || []}
                                        value={field.value}
                                        onChange={field.onChange}
                                        isError={fieldState.invalid}
                                        errorMessage={fieldState.error?.message}
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
                            name="payment_types"
                            render={({ field }) => (
                                <FormItem className="col-span-1 sm:col-span-2">
                                    <FormControl>
                                        <PaymentTypeMultiSelect
                                            value={field.value}
                                            onChange={field.onChange}
                                            options={allPaymentTypes || []}
                                            isLoading={isLoadingAllPaymentTypes}
                                            disabled={submitButtonDisabled}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="col-span-1 grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-3">
                            <FormField
                                control={form.control}
                                name="priority_policy.rank"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                variant={InputTypes.GRAY}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                label={translate("resources.cascadeSettings.cascades.fields.rank")}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <Label>{translate("resources.cascadeSettings.cascades.fields.type")}</Label>
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
                                                    {CASCADE_TYPE.map(type => (
                                                        <SelectItem value={type} variant={SelectType.GRAY} key={type}>
                                                            {translate(
                                                                `resources.cascadeSettings.cascades.types.${type}`
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
                                name="cascade_kind"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <Label>
                                            {translate("resources.cascadeSettings.cascades.fields.cascade_kind")}
                                        </Label>
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
                                                    {CASCADE_KIND.map(kind => (
                                                        <SelectItem value={kind} variant={SelectType.GRAY} key={kind}>
                                                            {translate(
                                                                `resources.cascadeSettings.cascades.kinds.${kind}`
                                                            )}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="details"
                            render={({ field }) => {
                                return (
                                    <FormItem className="col-span-1 md:col-span-2">
                                        <Label>{translate("resources.cascadeSettings.cascades.fields.details")}</Label>
                                        <FormControl>
                                            <MonacoEditor
                                                onErrorsChange={setHasErrors}
                                                onValidChange={setIsValid}
                                                onMountEditor={() => setMonacoEditorMounted(true)}
                                                code={field.value ?? "{}"}
                                                setCode={field.onChange}
                                                allowEmptyValues
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                    </div>

                    <div className="ml-auto mt-4 flex w-full flex-col gap-3 space-x-0 p-2 sm:flex-row sm:gap-0 sm:space-x-2 md:mt-0 md:w-2/5">
                        <Button
                            type="submit"
                            variant="default"
                            className="flex-1"
                            disabled={
                                submitButtonDisabled ||
                                hasErrors ||
                                (!isValid && form.watch("details")?.length !== 0) ||
                                !monacoEditorMounted
                            }>
                            {translate("app.ui.actions.save")}
                        </Button>

                        <Button type="button" variant="outline_gray" className="flex-1" onClick={onClose}>
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </form>
            </Form>
        </CreateContextProvider>
    );
};
