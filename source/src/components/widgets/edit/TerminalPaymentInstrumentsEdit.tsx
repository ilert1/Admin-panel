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
import { useQuery } from "@tanstack/react-query";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectType,
    SelectValue
} from "@/components/ui/select";
import { TerminalPaymentInstrumentsProvider } from "@/data/terminalPaymentInstruments";
import { SystemPaymentInstrumentsProvider } from "@/data/systemPaymentInstruments";
import { TerminalsDataProvider } from "@/data";

export interface ProviderEditParams {
    id: string;
    onClose: () => void;
}

export const TerminalPaymentInstrumentsEdit = ({ id, onClose = () => {} }: ProviderEditParams) => {
    const terminalPaymentInstrumentsProvider = new TerminalPaymentInstrumentsProvider();
    const systemPaymentInstrumentsProvider = new SystemPaymentInstrumentsProvider();
    const terminalsDataProvider = new TerminalsDataProvider();

    const {
        data: terminalPaymentInstrumentsData,
        isLoading: isLoadingTerminalPaymentInstrumentsData,
        isFetchedAfterMount
    } = useQuery({
        queryKey: ["terminalPaymentInstrument", id],
        queryFn: () => terminalPaymentInstrumentsProvider.getOne("terminalPaymentInstrumentsEdit", { id: id ?? "" }),
        enabled: true,
        select: data => data.data
    });

    const { isLoading: systemPaymentInstrumentsDataLoading, data: systemPaymentInstrumentsData } = useQuery({
        queryKey: ["systemPaymentInstruments"],
        queryFn: async () => await systemPaymentInstrumentsProvider.getListWithoutPagination()
    });

    const { isLoading: terminalsDataLoading, data: terminalsData } = useQuery({
        queryKey: ["terminals"],
        queryFn: async () => await terminalsDataProvider.getListWithoutPagination()
    });

    const refresh = useRefresh();
    const translate = useTranslate();
    const appToast = useAppToast();

    const [monacoEditorMounted, setMonacoEditorMounted] = useState(false);
    const [hasErrors, setHasErrors] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

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

    useEffect(() => {
        if (!isLoadingTerminalPaymentInstrumentsData && terminalPaymentInstrumentsData && isFetchedAfterMount) {
            const updatedValues = {
                terminal_id: terminalPaymentInstrumentsData.terminal_id || "",
                system_payment_instrument_id: terminalPaymentInstrumentsData.system_payment_instrument_id || "",
                terminal_payment_type_code: terminalPaymentInstrumentsData.terminal_payment_type_code || "",
                terminal_currency_code: terminalPaymentInstrumentsData.terminal_currency_code || "",
                terminal_financial_institution_code:
                    terminalPaymentInstrumentsData.terminal_financial_institution_code || "",
                terminal_specific_parameters:
                    JSON.stringify(terminalPaymentInstrumentsData.terminal_specific_parameters, null, 2) || ""
            };

            form.reset(updatedValues);
            setIsFinished(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [terminalPaymentInstrumentsData, isLoadingTerminalPaymentInstrumentsData, isFetchedAfterMount]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;
        setSubmitButtonDisabled(true);

        try {
            await terminalPaymentInstrumentsProvider.update("terminalPaymentInstruments", {
                id,
                data: {
                    ...data,
                    terminal_specific_parameters:
                        data.terminal_specific_parameters && data.terminal_specific_parameters.length !== 0
                            ? JSON.parse(data.terminal_specific_parameters)
                            : {}
                },
                previousData: undefined
            });

            appToast("success", translate("app.ui.edit.editSuccess"));

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

    usePreventFocus({ dependencies: [terminalPaymentInstrumentsData] });

    if (isLoadingTerminalPaymentInstrumentsData || !terminalPaymentInstrumentsData || !isFinished)
        return (
            <div className="h-[400px]">
                <Loading />
            </div>
        );

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                                {systemPaymentInstrumentsData && !systemPaymentInstrumentsDataLoading
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
                            disabled={hasErrors || !monacoEditorMounted || submitButtonDisabled}
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
