import { useRefresh, useTranslate } from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/loading";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { usePreventFocus } from "@/hooks";
import { Label } from "@/components/ui/label";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { PaymentTypeMultiSelect } from "../components/MultiSelectComponents/PaymentTypeMultiSelect";
import { useGetPaymentTypes } from "@/hooks/useGetPaymentTypes";
import { useQuery } from "@tanstack/react-query";
import { FinancialInstitutionProvider } from "@/data/financialInstitution";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectType,
    SelectValue
} from "@/components/ui/select";
import { CurrenciesMultiSelect } from "../components/MultiSelectComponents/CurrenciesMultiSelect";
import { CurrenciesDataProvider } from "@/data";
import { FinancialInstitutionType } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useFetchFinancialInstitutionTypes } from "@/hooks/useFetchFinancialInstitutionTypes";
import { all as AllCountryCodes } from "iso-3166-1";
import { Country } from "iso-3166-1/dist/iso-3166";
import { PopoverSelect } from "../components/Selects/PopoverSelect";

export interface FinancialInstitutionProps {
    id: string;
    onClose: () => void;
}

export const FinancialInstitutionEdit = ({ id, onClose = () => {} }: FinancialInstitutionProps) => {
    const financialInstitutionProvider = new FinancialInstitutionProvider();
    const currenciesDataProvider = new CurrenciesDataProvider();

    const {
        data: financialInstitutionData,
        isLoading: isLoadingFinancialInstitutionData,
        isFetchedAfterMount
    } = useQuery({
        queryKey: ["financialInstitution", id],
        queryFn: () => financialInstitutionProvider.getOne("financialInstitution", { id: id ?? "" }),
        enabled: true,
        select: data => data.data
    });
    const refresh = useRefresh();
    const translate = useTranslate();
    const appToast = useAppToast();

    const [monacoEditorMounted, setMonacoEditorMounted] = useState(false);
    const [hasErrors, setHasErrors] = useState(false);
    const [hasValid, setHasValid] = useState(true);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const { allPaymentTypes, isLoadingAllPaymentTypes } = useGetPaymentTypes({});

    const { isLoading: currenciesLoading, data: currencies } = useQuery({
        queryKey: ["currencies", "getListWithoutPagination"],
        queryFn: async ({ signal }) => await currenciesDataProvider.getListWithoutPagination("currency", signal)
    });

    const { isLoading: financialInstitutionTypesLoading, data: financialInstitutionTypes } =
        useFetchFinancialInstitutionTypes();

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

    const formSchema = z.object({
        name: z.string().min(1, translate("resources.paymentSettings.financialInstitution.errors.name")).trim(),
        legal_name: z.string().trim().optional(),
        nspk_member_id: z
            .string()
            .max(20, translate("resources.paymentSettings.financialInstitution.errors.nspk_member_id_max"))
            .trim()
            .optional(),
        institution_type: z.nativeEnum(FinancialInstitutionType).optional(),
        currencies: z.array(z.string()).optional(),
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
            legal_name: "",
            nspk_member_id: "",
            institution_type: undefined,
            currencies: [],
            payment_types: [],
            meta: "{}"
        }
    });

    useEffect(() => {
        if (!isLoadingFinancialInstitutionData && financialInstitutionData && isFetchedAfterMount) {
            const updatedValues = {
                name: financialInstitutionData.name || "",
                country_code: financialInstitutionData.country_code || "",
                legal_name: financialInstitutionData.legal_name || "",
                nspk_member_id: financialInstitutionData.nspk_member_id || "",
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
        setSubmitButtonDisabled(true);

        let payment_types: string[] = [];
        let oldPaymentTypes: Set<string> = new Set();

        if (financialInstitutionData?.payment_types) {
            oldPaymentTypes = new Set(financialInstitutionData?.payment_types?.map(pt => pt.code));
        }

        if (data.payment_types) {
            payment_types = [...data.payment_types];
            delete data.payment_types;
        }

        const paymentsToDelete = oldPaymentTypes.difference(new Set(payment_types));

        let currenciesList: string[] = [];
        let oldCurrencies: Set<string> = new Set();

        if (financialInstitutionData?.currencies) {
            oldCurrencies = new Set(financialInstitutionData?.currencies?.map(pt => pt.code));
        }

        if (data.currencies) {
            currenciesList = [...data.currencies];
            delete data.currencies;
        }

        const currenciesToDelete = oldCurrencies.difference(new Set(currenciesList));

        try {
            await financialInstitutionProvider.update("financialInstitution", {
                id,
                data: { ...data, meta: data.meta && data.meta.length !== 0 ? JSON.parse(data.meta) : {} },
                previousData: undefined
            });

            await Promise.all(
                [...paymentsToDelete].map(payment =>
                    financialInstitutionProvider.removePaymentType({
                        id,
                        data: { code: payment },
                        previousData: undefined
                    })
                )
            );

            await financialInstitutionProvider.addPaymentTypes({
                id,
                data: {
                    codes: payment_types
                },
                previousData: undefined
            });

            await Promise.all(
                [...currenciesToDelete].map(currency =>
                    financialInstitutionProvider.removeCurrency({
                        id,
                        data: { code: currency },
                        previousData: undefined
                    })
                )
            );

            await financialInstitutionProvider.addCurrencies({
                id,
                data: {
                    codes: currenciesList
                },
                previousData: undefined
            });

            appToast("success", translate("app.ui.edit.editSuccess"));

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

    usePreventFocus({ dependencies: [financialInstitutionData] });

    if (
        isLoadingFinancialInstitutionData ||
        !financialInstitutionData ||
        isLoadingAllPaymentTypes ||
        !isFinished ||
        currenciesLoading
    )
        return (
            <div className="h-[400px]">
                <Loading />
            </div>
        );

    return (
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
                    </div>

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
                                            commandPlaceholder={translate("app.widgets.multiSelect.searchPlaceholder")}
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
                                            {translate("resources.paymentSettings.financialInstitution.fields.meta")}
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
                            disabled={
                                hasErrors ||
                                (!hasValid && form.watch("meta")?.length !== 0) ||
                                !monacoEditorMounted ||
                                submitButtonDisabled
                            }
                            type="submit"
                            variant="default"
                            className="flex-1">
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
    );
};
