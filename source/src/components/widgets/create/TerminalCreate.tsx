import {
    useCreateController,
    useRefresh,
    CreateContextProvider,
    useTranslate,
    useDataProvider,
    useListContext
} from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import { useEffect, useMemo, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingBlock } from "@/components/ui/loading";
import { useTheme } from "@/components/providers";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TerminalWithId } from "@/data/terminals";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useSheets } from "@/components/providers/SheetProvider";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { TerminalCreate as ITerminalCreate } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { ProviderSelect } from "../components/Selects/ProviderSelect";
import { useQuery } from "@tanstack/react-query";
import { ProvidersDataProvider } from "@/data";

export interface TerminalCreateProps {
    onClose: () => void;
}

export const TerminalCreate = ({ onClose }: TerminalCreateProps) => {
    const refresh = useRefresh();
    const translate = useTranslate();
    const appToast = useAppToast();
    const { openSheet } = useSheets();
    const dataProvider = useDataProvider();
    const controllerProps = useCreateController<TerminalWithId>();
    const { theme } = useTheme();
    const { filterValues } = useListContext();

    const providersDataProvider = new ProvidersDataProvider();
    const [monacoEditorMounted, setMonacoEditorMounted] = useState(false);
    const [hasErrors, setHasErrors] = useState(false);
    const [hasValid, setHasValid] = useState(true);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const {
        data: providersData,
        isLoading: isProvidersLoading,
        isFetching: isProvidersFetching
    } = useQuery({
        queryKey: ["providers", "filter"],
        queryFn: async ({ signal }) => await providersDataProvider.getListWithoutPagination("provider", signal),
        select: data => data.data
    });

    const providersLoadingProcess = useMemo(
        () => isProvidersLoading || isProvidersFetching,
        [isProvidersFetching, isProvidersLoading]
    );

    const formSchema = z.object({
        provider: z.string().min(1, translate("resources.terminals.errors.provider")),
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
            .optional()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            provider: "",
            verbose_name: "",
            description: "",
            details: "{}",
            allocation_timeout_seconds: 2
        }
    });

    useEffect(() => {
        if (filterValues?.provider && providersData && providersData?.length > 0) {
            const providerFromFilter = providersData.find(item => item.id === filterValues.provider);

            if (providerFromFilter) {
                form.setValue("provider", filterValues.provider);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [providersData]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;

        setSubmitButtonDisabled(true);

        try {
            const res = await dataProvider.create<TerminalWithId>(`${data.provider}/terminal`, {
                data: {
                    verbose_name: data.verbose_name,
                    description: data.description,
                    details: data.details && data.details.length !== 0 ? JSON.parse(data.details) : {},
                    ...(data.allocation_timeout_seconds !== undefined && {
                        allocation_timeout_seconds: data.allocation_timeout_seconds
                    })
                } as ITerminalCreate
            });

            appToast(
                "success",
                <span>
                    {translate("resources.terminals.success.create", { name: data.verbose_name })}
                    <Button
                        className="!pl-1"
                        variant="resourceLink"
                        onClick={() => openSheet("terminal", { id: res.data.id, provider: data.provider })}>
                        {translate("app.ui.actions.details")}
                    </Button>
                </span>,
                translate("app.ui.toast.success"),
                10000
            );

            refresh();
            form.reset();
            onClose();
        } catch (error) {
            appToast("error", translate("resources.provider.errors.alreadyInUse"));
        } finally {
            setSubmitButtonDisabled(false);
        }
    };

    useEffect(() => {
        if (controllerProps.record) {
            form.reset({
                description: "",
                verbose_name: ""
            });
        }
    }, [form, controllerProps.record]);

    if (controllerProps.isLoading || theme.length === 0) return <LoadingBlock />;

    return (
        <CreateContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                    <div className="flex flex-wrap">
                        <div className="grid w-full gap-2 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="provider"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2 md:col-span-2">
                                        <Label>{translate("resources.direction.provider")}</Label>
                                        <ProviderSelect
                                            providers={providersData || []}
                                            value={field.value}
                                            onChange={field.onChange}
                                            isError={fieldState.invalid}
                                            errorMessage={fieldState.error?.message}
                                            disabled={providersLoadingProcess}
                                            modal
                                            isLoading={providersLoadingProcess}
                                        />
                                    </FormItem>
                                )}
                            />
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
                                                label={translate(
                                                    "resources.terminals.fields.allocation_timeout_seconds"
                                                )}
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
                                    <Label className="!mb-0">{translate("resources.terminals.fields.details")}</Label>
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
                        <div className="ml-auto mt-6 flex w-full flex-col space-x-0 p-2 sm:flex-row sm:space-x-2 md:w-2/5">
                            <Button
                                type="submit"
                                variant="default"
                                className="w-full sm:w-1/2"
                                disabled={
                                    hasErrors ||
                                    (!hasValid && form.watch("details")?.length !== 0) ||
                                    !monacoEditorMounted ||
                                    submitButtonDisabled
                                }>
                                {translate("app.ui.actions.save")}
                            </Button>
                            <Button
                                type="button"
                                variant="outline_gray"
                                className="mt-4 w-full flex-1 sm:mt-0 sm:w-1/2"
                                onClick={() => {
                                    form.reset();
                                    onClose();
                                }}>
                                {translate("app.ui.actions.cancel")}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </CreateContextProvider>
    );
};
