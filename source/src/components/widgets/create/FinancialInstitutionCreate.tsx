import { useCreateController, CreateContextProvider, useTranslate, useRefresh } from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading } from "@/components/ui/loading";
import { useTheme } from "@/components/providers";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import {
    FinancialInstitutionType,
    FinancialInstitutionCreate as IFinancialInstitutionCreate
} from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectType,
    SelectValue
} from "@/components/ui/select";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { useGetPaymentTypes } from "@/hooks/useGetPaymentTypes";
import { PaymentTypeMultiSelect } from "../components/MultiSelectComponents/PaymentTypeMultiSelect";
import { FinancialInstitutionProvider } from "@/data/financialInstitution";
import { CurrenciesDataProvider } from "@/data";
import { useQuery } from "@tanstack/react-query";
import { CurrenciesMultiSelect } from "../components/MultiSelectComponents/CurrenciesMultiSelect";
import { useFetchFinancialInstitutionTypes } from "@/hooks/useFetchFinancialInstitutionTypes";
import { all as AllCountryCodes } from "iso-3166-1";
import { Country } from "iso-3166-1/dist/iso-3166";
import { PopoverSelect } from "../components/Selects/PopoverSelect";

export interface FinancialInstitutionCreateProps {
    onClose?: () => void;
}

export const FinancialInstitutionCreate = ({ onClose = () => {} }: FinancialInstitutionCreateProps) => {
    const financialInstitutionProvider = new FinancialInstitutionProvider();
    const currenciesDataProvider = new CurrenciesDataProvider();
    const controllerProps = useCreateController<IFinancialInstitutionCreate>();
    const { theme } = useTheme();
    const appToast = useAppToast();
    const refresh = useRefresh();
    const translate = useTranslate();

    const { allPaymentTypes, isLoadingAllPaymentTypes } = useGetPaymentTypes({});
    const [hasErrors, setHasErrors] = useState(false);
    const [hasValid, setHasValid] = useState(true);
    const [monacoEditorMounted, setMonacoEditorMounted] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const [currentCountryCodeName, setCurrentCountryCodeName] = useState("");
    const countryCodes: (Country & { name: string })[] = [
        {
            name: "AB - Abhazia",
            country: "Abhazia",
            alpha2: "AB",
            alpha3: "ABH",
            numeric: "895"
        },
        ...AllCountryCodes().map(code => ({ ...code, name: `${code.alpha2} - ${code.country}` }))
    ];

    const { isLoading: currenciesLoading, data: currencies } = useQuery({
        queryKey: ["currencies"],
        queryFn: async () => await currenciesDataProvider.getListWithoutPagination()
    });

    const { isLoading: financialInstitutionTypesLoading, data: financialInstitutionTypes } =
        useFetchFinancialInstitutionTypes();

    const formSchema = z.object({
        name: z.string().min(1, translate("resources.paymentSettings.financialInstitution.errors.name")).trim(),
        short_name: z
            .string()
            .min(1, translate("resources.paymentSettings.financialInstitution.errors.short_name"))
            .regex(
                /^[a-z0-9_.-]+$/,
                translate("resources.paymentSettings.financialInstitution.errors.short_name_regex")
            )
            .trim(),
        legal_name: z.string().trim().optional(),
        nspk_member_id: z.string().trim().optional(),
        currencies: z.array(z.string()).optional(),
        institution_type: z.nativeEnum(FinancialInstitutionType).optional(),
        country_code: z
            .string()
            .regex(/^\w{2}$/, translate("resources.paymentSettings.financialInstitution.errors.country_code"))
            .trim(),
        payment_types: z.array(z.string()).optional(),
        meta: z.string().trim().optional()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            country_code: "",
            short_name: "",
            legal_name: "",
            nspk_member_id: "",
            currencies: [],
            institution_type: undefined,
            payment_types: [],
            meta: "{}"
        }
    });

    const errorCombineMessage = (msg: string): string => {
        if (msg.includes("already exists")) {
            const msgMatch = msg.match(/Key \(([^)]+)\)=\(([^)]+)\)/);

            if (msgMatch?.length === 3) {
                return translate("resources.paymentSettings.financialInstitution.errors.alreadyExistWithField", {
                    value: msgMatch[2]
                });
            }

            return translate("resources.paymentSettings.financialInstitution.errors.alreadyExist");
        }

        return msg;
    };

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;

        let payment_types: string[] = [];
        const currencies: string[] = [];
        setSubmitButtonDisabled(true);

        if (data.payment_types) {
            payment_types = [...data.payment_types];
            delete data.payment_types;
        }

        if (data.currencies) {
            currencies.push(...data.currencies);
            delete data.currencies;
        }

        try {
            const { data: financialInstitutionData } = await financialInstitutionProvider.create(
                "financialInstitution",
                {
                    data: { ...data, meta: data.meta && data.meta.length !== 0 ? JSON.parse(data.meta) : {} }
                }
            );

            if (payment_types.length > 0) {
                await financialInstitutionProvider.addPaymentTypes({
                    id: financialInstitutionData.id,
                    data: {
                        codes: payment_types
                    },
                    previousData: undefined
                });
            }

            if (currencies.length > 0) {
                await financialInstitutionProvider.addCurrencies({
                    id: financialInstitutionData.id,
                    data: {
                        codes: currencies
                    },
                    previousData: undefined
                });
            }

            appToast("success", translate("app.ui.create.createSuccess"));

            refresh();
            onClose();
        } catch (error) {
            if (error instanceof Error) {
                appToast("error", errorCombineMessage(error.message));
            } else {
                appToast("error", translate("app.ui.create.createError"));
            }
        } finally {
            setSubmitButtonDisabled(false);
        }
    };

    if (controllerProps.isLoading || isLoadingAllPaymentTypes || theme.length === 0 || currenciesLoading)
        return (
            <div className="h-[400px]">
                <Loading />
            </div>
        );

    return (
        <CreateContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <div className="flex flex-col flex-wrap">
                        <div className="grid grid-cols-1 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                variant={InputTypes.GRAY}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                label={translate(
                                                    "resources.paymentSettings.financialInstitution.fields.name"
                                                )}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="short_name"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                variant={InputTypes.GRAY}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                label={translate(
                                                    "resources.paymentSettings.financialInstitution.fields.short_name"
                                                )}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="legal_name"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full p-2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            variant={InputTypes.GRAY}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            label={translate(
                                                "resources.paymentSettings.financialInstitution.fields.legal_name"
                                            )}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-3">
                            <FormField
                                control={form.control}
                                name="nspk_member_id"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                variant={InputTypes.GRAY}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                label={translate(
                                                    "resources.paymentSettings.financialInstitution.fields.nspk_member_id"
                                                )}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="country_code"
                                render={({ field, fieldState }) => {
                                    return (
                                        <FormItem className="w-full p-2">
                                            <Label>
                                                {translate(
                                                    "resources.paymentSettings.financialInstitution.fields.country_code"
                                                )}
                                            </Label>

                                            <PopoverSelect
                                                variants={countryCodes}
                                                value={currentCountryCodeName}
                                                idField="alpha2"
                                                setIdValue={field.onChange}
                                                placeholder={translate(
                                                    "resources.paymentSettings.financialInstitution.fields.countryCodePlaceholder"
                                                )}
                                                onChange={setCurrentCountryCodeName}
                                                variantKey="name"
                                                commandPlaceholder={translate(
                                                    "app.widgets.multiSelect.searchPlaceholder"
                                                )}
                                                notFoundMessage={translate(
                                                    "resources.paymentSettings.countryCodeNotFoundMessage"
                                                )}
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
                                name="institution_type"
                                render={({ field, fieldState }) => {
                                    return (
                                        <FormItem className="w-full p-2">
                                            <Label>
                                                {translate(
                                                    "resources.paymentSettings.financialInstitution.fields.institution_type"
                                                )}
                                            </Label>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <FormControl>
                                                    <SelectTrigger
                                                        disabled={financialInstitutionTypesLoading}
                                                        variant={SelectType.GRAY}
                                                        isError={fieldState.invalid}
                                                        errorMessage={<FormMessage />}>
                                                        <SelectValue placeholder={"Bank"} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {financialInstitutionTypes?.map(type => (
                                                            <SelectItem
                                                                key={type.value}
                                                                value={type.value}
                                                                variant={SelectType.GRAY}>
                                                                {type.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    );
                                }}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="currencies"
                                render={({ field }) => (
                                    <FormItem className="w-full p-2">
                                        <CurrenciesMultiSelect
                                            value={field.value}
                                            onChange={field.onChange}
                                            options={currencies?.data || []}
                                        />
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
                        </div>

                        <FormField
                            control={form.control}
                            name="meta"
                            render={({ field }) => {
                                return (
                                    <FormItem className="w-full p-2">
                                        <FormLabel>
                                            <span className="!text-note-1 !text-neutral-30">
                                                {translate(
                                                    "resources.paymentSettings.financialInstitution.fields.meta"
                                                )}
                                            </span>
                                        </FormLabel>

                                        <FormControl>
                                            <MonacoEditor
                                                onErrorsChange={setHasErrors}
                                                onValidChange={setHasValid}
                                                onMountEditor={() => setMonacoEditorMounted(true)}
                                                code={field.value ?? "{}"}
                                                setCode={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />

                        <div className="ml-auto mt-6 flex w-full flex-col space-x-0 p-2 sm:flex-row sm:space-x-2 md:w-2/5">
                            <Button
                                type="submit"
                                variant="default"
                                className="w-full sm:w-1/2"
                                disabled={
                                    hasErrors ||
                                    (!hasValid && form.watch("meta")?.length !== 0) ||
                                    !monacoEditorMounted ||
                                    submitButtonDisabled
                                }>
                                {translate("app.ui.actions.save")}
                            </Button>
                            <Button
                                type="button"
                                variant="outline_gray"
                                className="mt-4 w-full flex-1 sm:mt-0 sm:w-1/2"
                                onClick={onClose}>
                                {translate("app.ui.actions.cancel")}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </CreateContextProvider>
    );
};
