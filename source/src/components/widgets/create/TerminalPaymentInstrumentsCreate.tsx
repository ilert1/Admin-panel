import { useCreateController, CreateContextProvider, useTranslate, useRefresh, useListContext } from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import { useEffect, useMemo, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading } from "@/components/ui/loading";
import { useTheme } from "@/components/providers";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import {
    DirectionType,
    FinancialInstitutionCreate as IFinancialInstitutionCreate,
    TerminalPaymentInstrumentStatus
} from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { TerminalPaymentInstrumentsProvider } from "@/data/terminalPaymentInstruments";
import { ProvidersDataProvider, TerminalsDataProvider } from "@/data";
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { SystemPaymentInstrumentsProvider } from "@/data/systemPaymentInstruments";
import { PopoverSelect } from "../components/Selects/PopoverSelect";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectType,
    SelectValue
} from "@/components/ui/select";
import { ProviderSelect } from "../components/Selects/ProviderSelect";

export interface TerminalPaymentInstrumentsCreateProps {
    onClose?: () => void;
}

export const TerminalPaymentInstrumentsCreate = ({ onClose = () => {} }: TerminalPaymentInstrumentsCreateProps) => {
    const terminalPaymentInstrumentsProvider = new TerminalPaymentInstrumentsProvider();
    const systemPaymentInstrumentsProvider = new SystemPaymentInstrumentsProvider();
    const terminalsDataProvider = new TerminalsDataProvider();
    const providersDataProvider = new ProvidersDataProvider();
    const controllerProps = useCreateController<IFinancialInstitutionCreate>();

    const { filterValues } = useListContext();
    const { theme } = useTheme();
    const appToast = useAppToast();
    const refresh = useRefresh();
    const translate = useTranslate();
    const statuses = Object.keys(TerminalPaymentInstrumentStatus);

    const [systemPaymentInstrumentCode, setSystemPaymentInstrumentCode] = useState("");
    const [terminalValueName, setTerminalValueName] = useState("");
    const [providerName, setProviderName] = useState("");
    const [hasErrors, setHasErrors] = useState(false);
    const [hasValid, setHasValid] = useState(true);
    const [monacoEditorMounted, setMonacoEditorMounted] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const { isLoading: systemPaymentInstrumentsDataLoading, data: systemPaymentInstrumentsData } = useQuery({
        queryKey: ["systemPaymentInstruments"],
        queryFn: async () => await systemPaymentInstrumentsProvider.getListWithoutPagination()
    });

    const {
        data: providersData,
        isLoading: isProvidersLoading,
        isFetching: isProvidersFetching
    } = useQuery({
        queryKey: ["providers", "filter"],
        queryFn: () => providersDataProvider.getListWithoutPagination(),
        select: data => data.data
    });

    const {
        data: terminalsData,
        isLoading: isTerminalsLoading,
        isFetching: isTerminalsFetching
    } = useQuery({
        queryKey: ["terminals", "filter", providerName],
        queryFn: () => terminalsDataProvider.getListWithoutPagination(["provider"], [providerName]),
        enabled: !!providerName,
        select: data => data.data
    });

    const providersLoadingProcess = useMemo(
        () => isProvidersLoading || isProvidersFetching,
        [isProvidersFetching, isProvidersLoading]
    );

    const terminalsLoadingProcess = useMemo(
        () => isTerminalsLoading || isTerminalsFetching,
        [isTerminalsFetching, isTerminalsLoading]
    );

    const formSchema = z.object({
        provider_id: z
            .string()
            .min(1, translate("resources.paymentSettings.systemPaymentInstruments.errors.cantBeEmpty")),
        terminal_id: z
            .string()
            .min(1, translate("resources.paymentSettings.systemPaymentInstruments.errors.cantBeEmpty")),
        system_payment_instrument_code: z
            .string()
            .min(1, translate("resources.paymentSettings.systemPaymentInstruments.errors.cantBeEmpty")),
        status: z
            .enum(statuses as [string, ...string[]])
            .default(TerminalPaymentInstrumentStatus.ACTIVE)
            .transform(status => status as TerminalPaymentInstrumentStatus),
        direction: z.nativeEnum(DirectionType).default(DirectionType.deposit),
        terminal_payment_type_code: z.string().trim().optional(),
        terminal_currency_code: z.string().trim().optional(),
        terminal_financial_institution_code: z.string().trim().optional(),
        terminal_specific_parameters: z.string().trim().optional()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            provider_id: "",
            terminal_id: "",
            system_payment_instrument_code: "",
            status: TerminalPaymentInstrumentStatus.ACTIVE,
            direction: DirectionType.deposit,
            terminal_payment_type_code: "",
            terminal_currency_code: "",
            terminal_financial_institution_code: "",
            terminal_specific_parameters: "{}"
        }
    });

    const providerVal = form.watch("provider_id");
    useEffect(() => {
        if (providerVal && providersData && providersData?.length > 0) {
            const providerFromFilter = providersData.find(item => item.name === providerVal);

            if (providerFromFilter) {
                setProviderName(providerFromFilter.name);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [providersData, providerVal]);

    useEffect(() => {
        if (terminalsData) {
            const terminal = terminalsData?.find(terminal => terminal.terminal_id === filterValues?.terminalFilterId);

            setTerminalValueName(terminal?.verbose_name || "");
            form.setValue("terminal_id", terminal?.terminal_id || "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [terminalsData, providerVal]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setSubmitButtonDisabled(true);

        try {
            await terminalPaymentInstrumentsProvider.create("terminalPaymentInstruments", {
                data: {
                    ...data,
                    terminal_specific_parameters:
                        data.terminal_specific_parameters && data.terminal_specific_parameters.length !== 0
                            ? JSON.parse(data.terminal_specific_parameters)
                            : {}
                }
            });

            appToast("success", translate("app.ui.create.createSuccess"));

            refresh();
            onClose();
        } catch (error) {
            if (error instanceof Error) {
                appToast(
                    "error",
                    error.message.includes("already exists")
                        ? translate("resources.paymentSettings.terminalPaymentInstruments.errors.alreadyExist")
                        : error.message
                );
            } else {
                appToast("error", translate("app.ui.create.createError"));
            }
        } finally {
            setSubmitButtonDisabled(false);
        }
    };

    if (controllerProps.isLoading || theme.length === 0)
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
                                name="provider_id"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2">
                                        <Label>{translate("resources.terminals.selectHeader")}</Label>

                                        <ProviderSelect
                                            style="Grey"
                                            providers={providersData || []}
                                            value={field.value}
                                            onChange={field.onChange}
                                            disabled={providersLoadingProcess}
                                            isError={fieldState.invalid}
                                            errorMessage={fieldState.error?.message}
                                            modal
                                        />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="terminal_id"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2">
                                        <Label>
                                            {translate(
                                                "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_id"
                                            )}
                                        </Label>

                                        <PopoverSelect
                                            variants={terminalsData || []}
                                            value={terminalValueName}
                                            idField="terminal_id"
                                            setIdValue={field.onChange}
                                            onChange={setTerminalValueName}
                                            variantKey="verbose_name"
                                            placeholder={
                                                providerName
                                                    ? translate("resources.terminals.selectPlaceholder")
                                                    : translate("resources.direction.noTerminals")
                                            }
                                            commandPlaceholder={translate("app.widgets.multiSelect.searchPlaceholder")}
                                            notFoundMessage={translate("resources.terminals.notFoundMessage")}
                                            isError={fieldState.invalid}
                                            errorMessage={fieldState.error?.message}
                                            disabled={terminalsLoadingProcess || !providerName}
                                            modal
                                        />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="system_payment_instrument_code"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2 sm:col-span-2">
                                        <Label>
                                            {translate(
                                                "resources.paymentSettings.terminalPaymentInstruments.fields.system_payment_instrument_code"
                                            )}
                                        </Label>

                                        <PopoverSelect
                                            variants={systemPaymentInstrumentsData?.data || []}
                                            value={systemPaymentInstrumentCode}
                                            idField="code"
                                            commandPlaceholder={translate("app.widgets.multiSelect.searchPlaceholder")}
                                            setIdValue={field.onChange}
                                            onChange={setSystemPaymentInstrumentCode}
                                            variantKey="code"
                                            notFoundMessage={translate(
                                                "resources.paymentSettings.systemPaymentInstruments.notFoundMessage"
                                            )}
                                            isError={fieldState.invalid}
                                            errorMessage={fieldState.error?.message}
                                            disabled={systemPaymentInstrumentsDataLoading}
                                            modal
                                        />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2">
                                        <Label>
                                            {translate(
                                                "resources.paymentSettings.systemPaymentInstruments.fields.status"
                                            )}
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
                                                        <SelectItem
                                                            key={status}
                                                            value={status}
                                                            variant={SelectType.GRAY}>
                                                            {translate(
                                                                `resources.paymentSettings.systemPaymentInstruments.statuses.${status.toLowerCase()}`
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
                                name="direction"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2">
                                        <Label>
                                            {translate(
                                                "resources.paymentSettings.systemPaymentInstruments.fields.direction"
                                            )}
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
                                                    {Object.keys(DirectionType).map(direction => (
                                                        <SelectItem
                                                            key={direction}
                                                            value={direction}
                                                            variant={SelectType.GRAY}>
                                                            {translate(`resources.direction.types.${direction}`)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3">
                            <FormField
                                control={form.control}
                                name="terminal_payment_type_code"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                variant={InputTypes.GRAY}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                label={translate(
                                                    "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_payment_type_code"
                                                )}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="terminal_currency_code"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                variant={InputTypes.GRAY}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                label={translate(
                                                    "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_currency_code"
                                                )}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="terminal_financial_institution_code"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                variant={InputTypes.GRAY}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                label={translate(
                                                    "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_financial_institution_code"
                                                )}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="terminal_specific_parameters"
                            render={({ field }) => {
                                return (
                                    <FormItem className="w-full p-2">
                                        <FormLabel>
                                            <span className="!text-note-1 !text-neutral-30">
                                                {translate(
                                                    "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_specific_parameters"
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
                                    !monacoEditorMounted ||
                                    (!hasValid && form.watch("terminal_specific_parameters")?.length !== 0) ||
                                    submitButtonDisabled ||
                                    terminalsLoadingProcess ||
                                    providersLoadingProcess ||
                                    systemPaymentInstrumentsDataLoading
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
