import {
    DirectionType,
    FinancialInstitution,
    SystemPaymentInstrumentStatus
} from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Button } from "@/components/ui/Button";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";
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
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { CurrencyWithId } from "@/data/currencies";
import { PaymentTypeWithId } from "@/data/payment_types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDataProvider, useRefresh, useTranslate } from "react-admin";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { CurrencySelect } from "../components/Selects/CurrencySelect";

interface SystemPaymentInstrumentCreateProps {
    onOpenChange: (state: boolean) => void;
}

export const SystemPaymentInstrumentCreate = (props: SystemPaymentInstrumentCreateProps) => {
    const { onOpenChange } = props;
    const translate = useTranslate();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();

    const appToast = useAppToast();

    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [monacoEditorMounted, setMonacoEditorMounted] = useState(false);
    const [hasErrors, setHasErrors] = useState(false);

    const directions = Object.keys(DirectionType);
    const statuses = Object.keys(SystemPaymentInstrumentStatus);

    const { data: paymentTypes, isLoading: paymentTypesLoading } = useQuery({
        queryKey: ["paymentTypes"],
        queryFn: () => dataProvider.getListWithoutPagination("payment_type"),
        select: data => data.data
    });

    const { data: currencies, isLoading: currenciesLoading } = useQuery({
        queryKey: ["currencies"],
        queryFn: () => dataProvider.getListWithoutPagination("currency"),
        select: data => data.data
    });

    const { data: financialInstitutions, isLoading: financialInstitutionsLoading } = useQuery({
        queryKey: ["financialInstitutions"],
        queryFn: ({ signal }) => dataProvider.getList("financialInstitution", { signal }),
        select: data => data.data
    });

    const formSchema = z.object({
        name: z
            .string()
            .min(1, translate("resources.paymentTools.systemPaymentInstruments.errors.cantBeEmpty"))
            .regex(/^[A-Za-z0-9_-]+$/, translate("resources.paymentTools.systemPaymentInstruments.errors.nameRegex"))
            .trim(),
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
        direction: z.enum(directions as [string, ...string[]]).default("universal"),
        status: z.enum(statuses as [string, ...string[]]).default("active"),
        description: z.string().optional(),
        meta: z.string()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            payment_type_code: "",
            currency_code: "",
            financial_institution_id: "",
            direction: DirectionType.universal,
            status: SystemPaymentInstrumentStatus.active,
            description: "",
            meta: "{}"
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (buttonDisabled) return;
        setButtonDisabled(true);
        data.meta = JSON.parse(data.meta);
        try {
            await dataProvider.create("systemPaymentInstruments", { data: data });
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

    if (paymentTypesLoading || currenciesLoading || financialInstitutionsLoading)
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
                            name="name"
                            render={({ field, fieldState }) => {
                                return (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                variant={InputTypes.GRAY}
                                                label={translate(
                                                    "resources.paymentTools.systemPaymentInstruments.fields.name"
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
                            name="payment_type_code"
                            render={({ field, fieldState }) => (
                                <FormItem className="">
                                    <Label>
                                        {translate(
                                            "resources.paymentTools.systemPaymentInstruments.fields.payment_type_code"
                                        )}
                                    </Label>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={paymentsDisabled}>
                                        <FormControl>
                                            <SelectTrigger
                                                variant={SelectType.GRAY}
                                                isError={fieldState.invalid}
                                                errorMessage={<FormMessage />}>
                                                <SelectValue
                                                    placeholder={
                                                        paymentsDisabled
                                                            ? translate("resources.direction.noTerminals")
                                                            : ""
                                                    }
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {!paymentsDisabled
                                                    ? paymentTypes.map((paymentType: PaymentTypeWithId) => (
                                                          <SelectItem
                                                              key={paymentType.code}
                                                              value={paymentType.code}
                                                              variant={SelectType.GRAY}>
                                                              {paymentType.code}
                                                          </SelectItem>
                                                      ))
                                                    : ""}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
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
                            name="financial_institution_id"
                            render={({ field, fieldState }) => (
                                <FormItem className="">
                                    <Label>
                                        {translate(
                                            "resources.paymentTools.systemPaymentInstruments.fields.financial_institution_id"
                                        )}
                                    </Label>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={paymentsDisabled}>
                                        <FormControl>
                                            <SelectTrigger
                                                variant={SelectType.GRAY}
                                                isError={fieldState.invalid}
                                                errorMessage={<FormMessage />}>
                                                <SelectValue
                                                    placeholder={
                                                        paymentsDisabled
                                                            ? translate("resources.direction.noTerminals")
                                                            : ""
                                                    }
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {!financialInstitutionsDisabled
                                                    ? financialInstitutions.map(
                                                          (financialInstitution: FinancialInstitution) => (
                                                              <SelectItem
                                                                  key={financialInstitution.id}
                                                                  value={financialInstitution.id}
                                                                  variant={SelectType.GRAY}>
                                                                  {financialInstitution.name}
                                                              </SelectItem>
                                                          )
                                                      )
                                                    : ""}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="direction"
                            render={({ field, fieldState }) => (
                                <FormItem className="">
                                    <Label>
                                        {translate("resources.paymentTools.systemPaymentInstruments.fields.direction")}
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
                                                {directions.map(direction => (
                                                    <SelectItem
                                                        key={direction}
                                                        value={direction}
                                                        variant={SelectType.GRAY}>
                                                        {direction}
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
                            name="status"
                            render={({ field, fieldState }) => (
                                <FormItem className="">
                                    <Label>
                                        {translate("resources.paymentTools.systemPaymentInstruments.fields.status")}
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
                                                {statuses.map(status => (
                                                    <SelectItem key={status} value={status} variant={SelectType.GRAY}>
                                                        {translate(
                                                            `resources.paymentTools.systemPaymentInstruments.statuses.${status}`
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
