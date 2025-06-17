import { Button } from "@/components/ui/Button";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDataProvider, useRefresh, useTranslate } from "react-admin";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { CurrencySelect } from "../components/Selects/CurrencySelect";
import { PopoverSelect } from "../components/Selects/PopoverSelect";

interface SystemPaymentInstrumentCreateProps {
    onOpenChange: (state: boolean) => void;
}

export const SystemPaymentInstrumentCreate = (props: SystemPaymentInstrumentCreateProps) => {
    const { onOpenChange } = props;
    const translate = useTranslate();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();

    const appToast = useAppToast();

    const [financialInstitutionValueName, setFinancialInstitutionValueName] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [monacoEditorMounted, setMonacoEditorMounted] = useState(false);
    const [hasErrors, setHasErrors] = useState(false);
    const [paymentTypes, setPaymentTypes] = useState([]);

    const { data: currencies, isLoading: currenciesLoading } = useQuery({
        queryKey: ["currencies"],
        queryFn: () => dataProvider.getListWithoutPagination("currency"),
        select: data => data.data
    });

    const { data: financialInstitutions, isLoading: financialInstitutionsLoading } = useQuery({
        queryKey: ["financialInstitutions"],
        queryFn: () => dataProvider.getListWithoutPagination("financialInstitution"),
        select: data => data.data
    });

    const formSchema = z.object({
        payment_type_code: z
            .string()
            .min(1, translate("resources.paymentTools.systemPaymentInstruments.errors.cantBeEmpty")),
        currency_code: z
            .string()
            .min(1, translate("resources.paymentTools.systemPaymentInstruments.errors.cantBeEmpty")),
        financial_institution_id: z
            .string()
            .uuid()
            .min(1, translate("resources.paymentTools.systemPaymentInstruments.errors.cantBeEmpty")),
        description: z.string().optional(),
        meta: z.string().trim().optional()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            payment_type_code: "",
            currency_code: "",
            financial_institution_id: "",
            description: "",
            meta: "{}"
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (buttonDisabled) return;
        setButtonDisabled(true);

        try {
            await dataProvider.create("systemPaymentInstruments", {
                data: { ...data, meta: data.meta && data.meta.length !== 0 ? JSON.parse(data.meta) : {} }
            });

            appToast("success", translate("app.ui.toast.success"));
            refresh();
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
            else appToast("error", translate("app.ui.toast.error"));
        } finally {
            setButtonDisabled(false);
            onOpenChange(false);
        }
    };

    const finInstValue = form.watch("financial_institution_id");
    useEffect(() => {
        if (!finInstValue) {
            setPaymentTypes([]);
        } else if (financialInstitutions && finInstValue) {
            form.resetField("payment_type_code");
            const found = financialInstitutions?.find((item: { id: string }) => item.id === finInstValue).payment_types;
            setPaymentTypes(found);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [finInstValue, financialInstitutions]);

    if (currenciesLoading || financialInstitutionsLoading)
        return (
            <div className="h-[300px]">
                <Loading />
            </div>
        );

    const paymentsDisabled = !paymentTypes || paymentTypes.length === 0;
    const currenciesDisabled = !currencies || currencies.length === 0;
    const financialInstitutionsDisabled = !financialInstitutions || financialInstitutions.length === 0;

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <div className="flex flex-col flex-wrap gap-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="financial_institution_id"
                            render={({ field, fieldState }) => (
                                <FormItem className="">
                                    <Label>
                                        {translate(
                                            "resources.paymentTools.systemPaymentInstruments.fields.financial_institution_id"
                                        )}
                                    </Label>

                                    <PopoverSelect
                                        variants={financialInstitutions}
                                        value={financialInstitutionValueName}
                                        idField="id"
                                        setIdValue={e => field.onChange(e)}
                                        onChange={e => setFinancialInstitutionValueName(e)}
                                        variantKey="name"
                                        commandPlaceholder={translate("app.widgets.multiSelect.searchPlaceholder")}
                                        notFoundMessage={translate(
                                            "resources.paymentTools.financialInstitution.notFoundMessage"
                                        )}
                                        isError={fieldState.invalid}
                                        errorMessage={fieldState.error?.message}
                                        disabled={financialInstitutionsDisabled}
                                    />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="payment_type_code"
                            render={({ field, fieldState }) => (
                                <FormItem className="">
                                    <Label>
                                        {translate(
                                            "resources.paymentTools.systemPaymentInstruments.fields.payment_type_code"
                                        )}
                                    </Label>
                                    <PopoverSelect
                                        variants={paymentTypes}
                                        value={
                                            paymentsDisabled
                                                ? finInstValue
                                                    ? translate(
                                                          "resources.paymentTools.systemPaymentInstruments.noAvailablePaymentTypes"
                                                      )
                                                    : translate(
                                                          "resources.paymentTools.systemPaymentInstruments.chooseFinInstitution"
                                                      )
                                                : field.value
                                        }
                                        onChange={e => field.onChange(e)}
                                        variantKey={"code"}
                                        commandPlaceholder={translate("app.widgets.multiSelect.searchPlaceholder")}
                                        notFoundMessage={translate(
                                            "resources.paymentTools.paymentType.notFoundMessage"
                                        )}
                                        isError={fieldState.invalid}
                                        errorMessage={fieldState.error?.message}
                                        disabled={paymentsDisabled}
                                        iconForPaymentTypes
                                    />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="currency_code"
                            render={({ field, fieldState }) => (
                                <FormItem className="">
                                    <Label>
                                        {translate(
                                            "resources.paymentTools.systemPaymentInstruments.fields.currency_code"
                                        )}
                                    </Label>
                                    <CurrencySelect
                                        value={field.value}
                                        onChange={field.onChange}
                                        currencies={currencies}
                                        disabled={currenciesDisabled}
                                        isError={fieldState.invalid}
                                        errorMessage={<FormMessage />}
                                    />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field, fieldState }) => {
                                return (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                variant={InputTypes.GRAY}
                                                label={translate(
                                                    "resources.paymentTools.systemPaymentInstruments.fields.description"
                                                )}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                            />
                                        </FormControl>
                                    </FormItem>
                                );
                            }}
                        />

                        <FormField
                            control={form.control}
                            name="meta"
                            render={({ field }) => (
                                <FormItem className="col-span-1 p-2 sm:col-span-2">
                                    <Label className="!mb-0">
                                        {translate("resources.paymentTools.systemPaymentInstruments.fields.meta")}
                                    </Label>
                                    <FormControl>
                                        <MonacoEditor
                                            width="100%"
                                            onMountEditor={() => setMonacoEditorMounted(true)}
                                            onErrorsChange={setHasErrors}
                                            code={field.value ?? "{}"}
                                            setCode={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:self-end">
                        <Button
                            type="submit"
                            variant="default"
                            className="w-full sm:w-auto"
                            disabled={hasErrors || !monacoEditorMounted || buttonDisabled}>
                            {translate("app.ui.actions.save")}
                        </Button>
                        <Button
                            onClick={() => onOpenChange(false)}
                            variant="outline_gray"
                            type="button"
                            className="w-full rounded-4 border border-neutral-50 hover:border-neutral-100 sm:w-auto">
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </div>
            </form>
        </FormProvider>
    );
};
