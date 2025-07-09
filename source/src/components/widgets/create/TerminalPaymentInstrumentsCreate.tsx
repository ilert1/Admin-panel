import { useCreateController, CreateContextProvider, useTranslate, useRefresh, useListContext } from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
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
import { useProvidersListWithoutPagination, useTerminalsListWithoutPagination } from "@/hooks";
import { FinancialInstitutionProvider } from "@/data/financialInstitution";

export interface TerminalPaymentInstrumentsCreateProps {
    onClose?: () => void;
}

enum createModeEnum {
    SPI = "spi",
    FI = "fi"
}

export const TerminalPaymentInstrumentsCreate = ({ onClose = () => {} }: TerminalPaymentInstrumentsCreateProps) => {
    const { filterValues } = useListContext();
    const { providersData, isProvidersLoading, providersLoadingProcess } = useProvidersListWithoutPagination();
    const { theme } = useTheme();
    const appToast = useAppToast();
    const refresh = useRefresh();
    const translate = useTranslate();

    const terminalPaymentInstrumentsProvider = new TerminalPaymentInstrumentsProvider();
    const systemPaymentInstrumentsProvider = new SystemPaymentInstrumentsProvider();
    const financialInstitutionProvider = new FinancialInstitutionProvider();
    const controllerProps = useCreateController<IFinancialInstitutionCreate>();

    const statuses = Object.keys(TerminalPaymentInstrumentStatus);

    const [systemPaymentInstrumentCode, setSystemPaymentInstrumentCode] = useState("");
    const [terminalValueName, setTerminalValueName] = useState("");
    const [providerName, setProviderName] = useState("");
    const [hasErrors, setHasErrors] = useState(false);
    const [hasValid, setHasValid] = useState(true);
    const [monacoEditorMounted, setMonacoEditorMounted] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [createMode, setCreateMode] = useState<createModeEnum>(createModeEnum.SPI);

    const { terminalsData, terminalsLoadingProcess } = useTerminalsListWithoutPagination(providerName);

    const { isLoading: systemPaymentInstrumentsDataLoading, data: systemPaymentInstrumentsData } = useQuery({
        queryKey: ["systemPaymentInstruments", "getListWithoutPagination"],
        queryFn: async ({ signal }) =>
            await systemPaymentInstrumentsProvider.getListWithoutPagination("systemPaymentInstruments", signal),
        enabled: createMode === createModeEnum.SPI,
        select: data => data?.data
    });

    const { isLoading: financialInstitutionsDataLoading, data: financialInstitutionsData } = useQuery({
        queryKey: ["financialInstitutions", "getListWithoutPagination"],
        queryFn: async ({ signal }) =>
            await financialInstitutionProvider.getListWithoutPagination("financialInstitution", signal),
        enabled: createMode === createModeEnum.FI,
        select: data => data?.data
    });

    const formSchema = z.object({
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

    useEffect(() => {
        if (filterValues?.provider && providersData && providersData?.length > 0) {
            const providerFromFilter = providersData.find(item => item.name === filterValues.provider);
            setProviderName(providerFromFilter?.name || "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [providersData]);

    useEffect(() => {
        if (filterValues?.terminalFilterId && terminalsData && terminalsData?.length > 0) {
            const terminal = terminalsData.find(terminal => terminal.terminal_id === filterValues.terminalFilterId);
            setTerminalValueName(terminal?.verbose_name || "");
            form.setValue("terminal_id", terminal?.terminal_id || "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [terminalsData]);

    const onChangeProviderName = (val: string) => {
        setProviderName(val);
        setTerminalValueName("");
        form.setValue("terminal_id", "");
    };

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setSubmitButtonDisabled(true);

        try {
            if (createMode === createModeEnum.SPI) {
                await terminalPaymentInstrumentsProvider.create("terminalPaymentInstruments", {
                    data: {
                        ...data,
                        terminal_specific_parameters:
                            data.terminal_specific_parameters && data.terminal_specific_parameters.length !== 0
                                ? JSON.parse(data.terminal_specific_parameters)
                                : {}
                    }
                });
            } else {
                await terminalPaymentInstrumentsProvider.createByFinancialInstitution(
                    "terminalPaymentInstruments",
                    data.terminal_id,
                    data.system_payment_instrument_code,
                    {
                        data: {
                            direction: data.direction,
                            status: data.status,
                            terminal_currency_code: data.terminal_currency_code,
                            terminal_financial_institution_code: data.terminal_financial_institution_code,
                            terminal_payment_type_code: data.terminal_payment_type_code,
                            terminal_specific_parameters:
                                data.terminal_specific_parameters && data.terminal_specific_parameters.length !== 0
                                    ? JSON.parse(data.terminal_specific_parameters)
                                    : {}
                        }
                    }
                );
            }

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
                            <div className="w-full p-2">
                                <Label>{translate("resources.terminals.selectHeader")}</Label>

                                <ProviderSelect
                                    style="Grey"
                                    providers={providersData || []}
                                    value={providerName}
                                    onChange={onChangeProviderName}
                                    disabled={providersLoadingProcess}
                                    isError={!providerName && form.getFieldState("terminal_id").invalid}
                                    errorMessage={translate(
                                        "resources.paymentSettings.systemPaymentInstruments.errors.cantBeEmpty"
                                    )}
                                    isLoading={isProvidersLoading}
                                    modal
                                />
                            </div>

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
                                            isLoading={terminalsLoadingProcess}
                                        />
                                    </FormItem>
                                )}
                            />

                            <div className="w-full p-2">
                                <Label>
                                    {translate("resources.paymentSettings.terminalPaymentInstruments.createMode.name")}
                                </Label>

                                <Select
                                    value={createMode}
                                    onValueChange={(value: createModeEnum) => {
                                        setSystemPaymentInstrumentCode("");
                                        form.setValue("system_payment_instrument_code", "");
                                        setCreateMode(value);
                                    }}>
                                    <FormControl>
                                        <SelectTrigger variant={SelectType.GRAY} errorMessage={<FormMessage />}>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value={createModeEnum.SPI} variant={SelectType.GRAY}>
                                                {translate(
                                                    `resources.paymentSettings.terminalPaymentInstruments.createMode.${createModeEnum.SPI}`
                                                )}
                                            </SelectItem>

                                            <SelectItem value={createModeEnum.FI} variant={SelectType.GRAY}>
                                                {translate(
                                                    `resources.paymentSettings.terminalPaymentInstruments.createMode.${createModeEnum.FI}`
                                                )}
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <FormField
                                control={form.control}
                                name="system_payment_instrument_code"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2">
                                        <Label>
                                            {createMode === createModeEnum.SPI
                                                ? translate(
                                                      "resources.paymentSettings.terminalPaymentInstruments.fields.system_payment_instrument_code"
                                                  )
                                                : translate("resources.paymentSettings.financialInstitution.show")}
                                        </Label>

                                        <PopoverSelect
                                            variants={
                                                createMode === createModeEnum.SPI
                                                    ? systemPaymentInstrumentsData || []
                                                    : financialInstitutionsData || []
                                            }
                                            value={systemPaymentInstrumentCode}
                                            idField="code"
                                            commandPlaceholder={translate("app.widgets.multiSelect.searchPlaceholder")}
                                            setIdValue={field.onChange}
                                            onChange={setSystemPaymentInstrumentCode}
                                            variantKey={createMode === createModeEnum.SPI ? "code" : "name"}
                                            notFoundMessage={
                                                createMode === createModeEnum.SPI
                                                    ? translate(
                                                          "resources.paymentSettings.systemPaymentInstruments.notFoundMessage"
                                                      )
                                                    : translate(
                                                          "resources.paymentSettings.financialInstitution.notFoundMessage"
                                                      )
                                            }
                                            isError={fieldState.invalid}
                                            errorMessage={fieldState.error?.message}
                                            disabled={
                                                systemPaymentInstrumentsDataLoading || financialInstitutionsDataLoading
                                            }
                                            modal
                                            isLoading={
                                                systemPaymentInstrumentsDataLoading || financialInstitutionsDataLoading
                                            }
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
                                                "resources.paymentSettings.terminalPaymentInstruments.fields.status"
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
                                            <Label>
                                                {translate(
                                                    "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_specific_parameters"
                                                )}
                                            </Label>
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
                                    systemPaymentInstrumentsDataLoading ||
                                    financialInstitutionsDataLoading
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
