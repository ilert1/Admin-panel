import { useRefresh, useTranslate } from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/loading";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { usePreventFocus } from "@/hooks";
import { Label } from "@/components/ui/label";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useQuery } from "@tanstack/react-query";
import { TerminalPaymentInstrumentsProvider } from "@/data/terminalPaymentInstruments";
import { DirectionType, TerminalPaymentInstrumentStatus } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectType,
    SelectValue
} from "@/components/ui/select";

export interface TerminalPaymentInstrumentsEditProps {
    id: string;
    onClose: () => void;
}

export const TerminalPaymentInstrumentsEdit = ({ id, onClose = () => {} }: TerminalPaymentInstrumentsEditProps) => {
    const terminalPaymentInstrumentsProvider = new TerminalPaymentInstrumentsProvider();
    const statuses = Object.keys(TerminalPaymentInstrumentStatus);

    const {
        data: terminalPaymentInstrumentsData,
        isLoading: isLoadingTerminalPaymentInstrumentsData,
        isFetchedAfterMount
    } = useQuery({
        queryKey: ["terminalPaymentInstrument", id],
        queryFn: ({ signal }) =>
            terminalPaymentInstrumentsProvider.getOne("terminalPaymentInstrumentsEdit", { id: id ?? "", signal }),
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
            terminal_payment_type_code: "",
            terminal_currency_code: "",
            terminal_financial_institution_code: "",
            terminal_specific_parameters: "{}"
        }
    });

    useEffect(() => {
        if (!isLoadingTerminalPaymentInstrumentsData && terminalPaymentInstrumentsData && isFetchedAfterMount) {
            const updatedValues = {
                terminal_id: terminalPaymentInstrumentsData.terminal_id || "",
                system_payment_instrument_code: terminalPaymentInstrumentsData.system_payment_instrument_code || "",
                terminal_payment_type_code: terminalPaymentInstrumentsData.terminal_payment_type_code || "",
                terminal_currency_code: terminalPaymentInstrumentsData.terminal_currency_code || "",
                status: terminalPaymentInstrumentsData.status || TerminalPaymentInstrumentStatus.INACTIVE,
                direction: terminalPaymentInstrumentsData.direction || DirectionType.deposit,
                terminal_financial_institution_code:
                    terminalPaymentInstrumentsData.terminal_financial_institution_code || "",
                terminal_specific_parameters:
                    JSON.stringify(terminalPaymentInstrumentsData.terminal_specific_parameters, null, 2) || "{}"
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

    usePreventFocus({ dependencies: [terminalPaymentInstrumentsData] });

    if (isLoadingTerminalPaymentInstrumentsData || !terminalPaymentInstrumentsData || !isFinished)
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
                        <div className="w-full p-2">
                            <Input
                                value={terminalPaymentInstrumentsData.terminal.provider}
                                variant={InputTypes.GRAY}
                                label={translate("resources.terminals.selectHeader")}
                                disabled
                            />
                        </div>

                        <div className="w-full p-2">
                            <Input
                                value={terminalPaymentInstrumentsData.terminal.verbose_name}
                                variant={InputTypes.GRAY}
                                label={translate(
                                    "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_id"
                                )}
                                disabled
                            />
                        </div>

                        <div className="w-full p-2 sm:col-span-2">
                            <Input
                                value={terminalPaymentInstrumentsData.system_payment_instrument_code}
                                variant={InputTypes.GRAY}
                                label={translate(
                                    "resources.paymentSettings.terminalPaymentInstruments.fields.system_payment_instrument_code"
                                )}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3">
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
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2">
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
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full p-2">
                                    <Label>
                                        {translate("resources.paymentSettings.systemPaymentInstruments.fields.status")}
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
                    </div>

                    <FormField
                        control={form.control}
                        name="terminal_specific_parameters"
                        render={({ field }) => {
                            return (
                                <FormItem className="w-full p-2">
                                    <Label>
                                        {translate(
                                            "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_specific_parameters"
                                        )}
                                    </Label>

                                    <FormControl>
                                        <MonacoEditor
                                            onErrorsChange={setHasErrors}
                                            onValidChange={setHasValid}
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

                    <div className="ml-auto mt-6 flex w-full flex-col space-x-0 p-2 sm:flex-row sm:space-x-2 md:w-2/5">
                        <Button
                            disabled={
                                hasErrors ||
                                (!hasValid && form.watch("terminal_specific_parameters")?.length !== 0) ||
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
