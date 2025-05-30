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
import { FinancialInstitutionCreate as IFinancialInstitutionCreate } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { TerminalPaymentInstrumentsProvider } from "@/data/terminalPaymentInstruments";
import { TerminalsDataProvider } from "@/data";
import { useQuery } from "@tanstack/react-query";
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
import { SystemPaymentInstrumentsProvider } from "@/data/systemPaymentInstruments";

export interface TerminalPaymentInstrumentsCreateProps {
    onClose?: () => void;
}

export const TerminalPaymentInstrumentsCreate = ({ onClose = () => {} }: TerminalPaymentInstrumentsCreateProps) => {
    const terminalPaymentInstrumentsProvider = new TerminalPaymentInstrumentsProvider();
    const systemPaymentInstrumentsProvider = new SystemPaymentInstrumentsProvider();
    const terminalsDataProvider = new TerminalsDataProvider();
    const controllerProps = useCreateController<IFinancialInstitutionCreate>();

    const { theme } = useTheme();
    const appToast = useAppToast();
    const refresh = useRefresh();
    const translate = useTranslate();

    const [hasErrors, setHasErrors] = useState(false);
    const [monacoEditorMounted, setMonacoEditorMounted] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const { isLoading: systemPaymentInstrumentsDataLoading, data: systemPaymentInstrumentsData } = useQuery({
        queryKey: ["systemPaymentInstruments"],
        queryFn: async () => await systemPaymentInstrumentsProvider.getListWithoutPagination()
    });

    const { isLoading: terminalsDataLoading, data: terminalsData } = useQuery({
        queryKey: ["terminals"],
        queryFn: async () => await terminalsDataProvider.getListWithoutPagination()
    });

    const formSchema = z.object({
        terminal_id: z
            .string()
            .min(1, translate("resources.paymentTools.terminalPaymentInstruments.errors.terminal_id")),
        system_payment_instrument_id: z
            .string()
            .min(1, translate("resources.paymentTools.terminalPaymentInstruments.errors.system_payment_instrument_id")),
        terminal_payment_type_code: z.string().trim().optional(),
        terminal_currency_code: z.string().trim().optional(),
        terminal_financial_institution_code: z.string().trim().optional(),
        terminal_specific_parameters: z.string().trim().optional()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            terminal_id: "",
            system_payment_instrument_id: "",
            terminal_payment_type_code: "",
            terminal_currency_code: "",
            terminal_financial_institution_code: "",
            terminal_specific_parameters: ""
        }
    });

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
                appToast("error", error.message);
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
                                name="terminal_id"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2">
                                        <Label>
                                            {translate(
                                                "resources.paymentTools.terminalPaymentInstruments.fields.terminal_id"
                                            )}
                                        </Label>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            disabled={terminalsDataLoading}>
                                            <FormControl>
                                                <SelectTrigger
                                                    variant={SelectType.GRAY}
                                                    isError={fieldState.invalid}
                                                    errorMessage={<FormMessage />}>
                                                    <SelectValue
                                                        placeholder={translate(
                                                            "resources.paymentTools.terminalPaymentInstruments.fields.terminalToChoose"
                                                        )}
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {terminalsData && !terminalsDataLoading
                                                        ? terminalsData.data.map(terminal => (
                                                              <SelectItem
                                                                  key={terminal.terminal_id}
                                                                  value={terminal.terminal_id}
                                                                  variant={SelectType.GRAY}>
                                                                  {terminal.verbose_name}
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
                                name="system_payment_instrument_id"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2">
                                        <Label>
                                            {translate(
                                                "resources.paymentTools.terminalPaymentInstruments.fields.system_payment_instrument_id"
                                            )}
                                        </Label>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            disabled={systemPaymentInstrumentsDataLoading}>
                                            <FormControl>
                                                <SelectTrigger
                                                    variant={SelectType.GRAY}
                                                    isError={fieldState.invalid}
                                                    errorMessage={<FormMessage />}>
                                                    <SelectValue
                                                        placeholder={translate(
                                                            "resources.paymentTools.terminalPaymentInstruments.fields.systemPaymentInstrumentsToChoose"
                                                        )}
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {systemPaymentInstrumentsData &&
                                                    !systemPaymentInstrumentsDataLoading
                                                        ? systemPaymentInstrumentsData.data.map(paymentInstrument => (
                                                              <SelectItem
                                                                  key={paymentInstrument.id}
                                                                  value={paymentInstrument.id}
                                                                  variant={SelectType.GRAY}>
                                                                  {paymentInstrument.name}
                                                              </SelectItem>
                                                          ))
                                                        : ""}
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
                                                    "resources.paymentTools.terminalPaymentInstruments.fields.terminal_payment_type_code"
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
                                                    "resources.paymentTools.terminalPaymentInstruments.fields.terminal_currency_code"
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
                                                    "resources.paymentTools.terminalPaymentInstruments.fields.terminal_financial_institution_code"
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
                                                    "resources.paymentTools.terminalPaymentInstruments.fields.terminal_specific_parameters"
                                                )}
                                            </span>
                                        </FormLabel>

                                        <FormControl>
                                            <MonacoEditor
                                                onErrorsChange={setHasErrors}
                                                onMountEditor={() => setMonacoEditorMounted(true)}
                                                code={field.value || "{}"}
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
                                    submitButtonDisabled ||
                                    terminalsDataLoading ||
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
