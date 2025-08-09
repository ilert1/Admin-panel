import { useTranslate, useDataProvider, useRefresh } from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/loading";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { usePreventFocus } from "@/hooks";
import { TerminalsDataProvider, TerminalWithId } from "@/data/terminals";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { ProviderBase, TerminalUpdate } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useGetPaymentTypes } from "@/hooks/useGetPaymentTypes";
import { PaymentTypeMultiSelect } from "../../components/MultiSelectComponents/PaymentTypeMultiSelect";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface ProviderEditParams {
    provider: ProviderBase;
    id: string;
    onClose: () => void;
}

export const TerminalsEdit: FC<ProviderEditParams> = ({ id, provider, onClose }) => {
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const refresh = useRefresh();
    const appToast = useAppToast();
    const terminalsDataProvider = new TerminalsDataProvider();
    const [monacoEditorMounted, setMonacoEditorMounted] = useState(false);
    const [hasErrors, setHasErrors] = useState(false);
    const [hasValid, setHasValid] = useState(true);
    const queryClient = useQueryClient();
    const [isFinished, setIsFinished] = useState(false);

    const {
        data: terminal,
        isLoading: isLoadingTerminal,
        isFetchedAfterMount
    } = useQuery({
        queryKey: ["terminal", id],
        queryFn: ({ signal }) => dataProvider.getOne<TerminalWithId>("terminals", { id, signal }),
        enabled: true,
        select: data => data.data
    });

    const { providerPaymentTypes, isLoadingProviderPaymentTypes } = useGetPaymentTypes({
        provider: provider.id as string
    });

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const formSchema = z.object({
        verbose_name: z.string().min(1, translate("resources.terminals.errors.verbose_name")).trim(),
        description: z.union([z.string().trim(), z.literal("")]),
        details: z.string().trim().optional(),
        allocation_timeout_seconds: z
            .literal("")
            .transform(() => undefined)
            .or(
                z.coerce
                    .number({ message: translate("resources.terminals.errors.allocation_timeout_seconds") })
                    .int({ message: translate("resources.terminals.errors.allocation_timeout_seconds") })
                    .min(0, translate("resources.terminals.errors.allocation_timeout_seconds_min"))
                    .max(120, translate("resources.terminals.errors.allocation_timeout_seconds_max"))
            )
            .optional(),
        payment_types: z.array(z.string()).optional()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            verbose_name: "",
            description: "",
            details: "{}",
            allocation_timeout_seconds: 2,
            payment_types: []
        }
    });

    useEffect(() => {
        if (!isLoadingTerminal && terminal && isFetchedAfterMount) {
            const updatedValues = {
                verbose_name: terminal.verbose_name || "",
                description: terminal.description || "",
                details: JSON.stringify(terminal.details, null, 2) || "{}",
                allocation_timeout_seconds: terminal?.allocation_timeout_seconds ?? 2,
                payment_types: terminal?.payment_types?.map(pt => pt.code) || []
            };

            form.reset(updatedValues);
            setIsFinished(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [terminal, isLoadingTerminal, isFetchedAfterMount]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;

        try {
            setSubmitButtonDisabled(true);

            let payment_types: string[] = [];
            let oldPaymentTypes: Set<string> = new Set();

            if (terminal?.payment_types) {
                oldPaymentTypes = new Set(terminal?.payment_types?.map(pt => pt.code));
            }

            if (data.payment_types) {
                payment_types = [...data.payment_types];
            }

            const paymentsToDelete = oldPaymentTypes.difference(new Set(payment_types));

            await dataProvider.update<TerminalWithId>("terminals", {
                id,
                data: {
                    ...data,
                    details: data.details && data.details.length !== 0 ? JSON.parse(data.details) : {},
                    allocation_timeout_seconds:
                        data.allocation_timeout_seconds !== undefined ? data.allocation_timeout_seconds : null
                } as TerminalUpdate,
                previousData: undefined
            });

            await Promise.all(
                [...paymentsToDelete].map(payment =>
                    terminalsDataProvider.removePaymentType({
                        id,
                        data: { code: payment },
                        previousData: undefined
                    })
                )
            );

            appToast("success", translate("app.ui.edit.editSuccess"));
        } catch (error) {
            if (error instanceof Error) {
                appToast(
                    "error",
                    error.message.includes("already exist")
                        ? translate("resources.provider.errors.alreadyInUse")
                        : error.message
                );
            } else {
                appToast("error", translate("app.ui.edit.editError"));
            }
        } finally {
            refresh();
            form.reset({});
            queryClient.invalidateQueries({ queryKey: ["terminal", id] });
            queryClient.cancelQueries({ queryKey: ["terminal", id] });
            setSubmitButtonDisabled(false);
            onClose();
        }
    };

    usePreventFocus({ dependencies: [terminal] });

    if (isLoadingTerminal || !terminal || isLoadingProviderPaymentTypes || !isFinished)
        return (
            <div className="h-[600px]">
                <Loading />
            </div>
        );

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <div className="flex flex-wrap">
                    <div className="grid w-full gap-2 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="verbose_name"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full p-2">
                                    <FormControl>
                                        <Input
                                            label={translate("resources.terminals.fields.verbose_name")}
                                            autoCorrect="off"
                                            autoCapitalize="none"
                                            spellCheck="false"
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            variant={InputTypes.GRAY}
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="allocation_timeout_seconds"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full p-2">
                                    <FormControl>
                                        <Input
                                            label={translate("resources.terminals.fields.allocation_timeout_seconds")}
                                            autoCorrect="off"
                                            autoCapitalize="none"
                                            spellCheck="false"
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            variant={InputTypes.GRAY}
                                            {...field}
                                            onChange={e => {
                                                const value = e.target.value.replace(/\D/, "");
                                                field.onChange(value);
                                            }}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="w-full p-2 sm:w-full">
                                <Label className="">{translate("resources.terminals.fields.description")}</Label>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        value={field.value ?? ""}
                                        placeholder={translate("resources.wallet.manage.fields.descr")}
                                        className="!mt-0 h-24 w-full resize-none overflow-auto rounded p-2 text-title-1 outline-none dark:bg-muted"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="details"
                        render={({ field }) => (
                            <FormItem className="w-full p-2">
                                <Label>{translate("resources.terminals.fields.details")}</Label>
                                <FormControl>
                                    <MonacoEditor
                                        width="100%"
                                        onMountEditor={() => setMonacoEditorMounted(true)}
                                        onErrorsChange={setHasErrors}
                                        onValidChange={setHasValid}
                                        code={field.value ?? "{}"}
                                        setCode={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
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
                                        options={providerPaymentTypes || []}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className="ml-auto mt-6 flex w-full flex-col space-x-0 p-2 sm:flex-row sm:space-x-2 md:w-2/5">
                        <Button
                            disabled={
                                hasErrors ||
                                (!hasValid && form.watch("details")?.length !== 0) ||
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
                            onClick={() => onClose()}>
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
};
