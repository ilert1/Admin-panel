import { useCreateController, CreateContextProvider, useTranslate, useRefresh } from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading } from "@/components/ui/loading";
import { useTheme } from "@/components/providers";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { ProvidersDataProvider } from "@/data/providers";
import { ProviderCreate as IProviderCreate } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { Label } from "@/components/ui/label";
import { useSheets } from "@/components/providers/SheetProvider";
import { PaymentTypeMultiSelect } from "../components/MultiSelectComponents/PaymentTypeMultiSelect";
import { useGetPaymentTypes } from "@/hooks/useGetPaymentTypes";

export interface ProviderCreateProps {
    onClose?: () => void;
}

export const ProviderCreate = ({ onClose = () => {} }: ProviderCreateProps) => {
    const providersDataProvider = new ProvidersDataProvider();
    const controllerProps = useCreateController<IProviderCreate>();
    const { theme } = useTheme();

    const appToast = useAppToast();

    const translate = useTranslate();
    const refresh = useRefresh();
    const { openSheet } = useSheets();
    const [hasErrors, setHasErrors] = useState(false);
    const [hasValid, setHasValid] = useState(true);
    const [monacoEditorMounted, setMonacoEditorMounted] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const { allPaymentTypes, isLoadingAllPaymentTypes } = useGetPaymentTypes({});

    const formSchema = z.object({
        name: z.string().min(1, translate("resources.provider.errors.name")).trim(),
        fields_json_schema: z.string().optional().default(""),
        methods: z.string().trim().optional(),
        payment_types: z.array(z.string()).optional().default([])
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            fields_json_schema: "",
            methods: "{}",
            payment_types: []
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;

        setSubmitButtonDisabled(true);

        try {
            const res = await providersDataProvider.create("provider", {
                data: {
                    ...data,
                    methods: data.methods && data.methods.length !== 0 ? JSON.parse(data.methods) : {}
                }
            });

            appToast(
                "success",
                <span>
                    {translate("resources.provider.successCreate", { name: data.name })}
                    <Button
                        className="!pl-1"
                        variant="resourceLink"
                        onClick={() => openSheet("provider", { id: res.data.id })}>
                        {translate("app.ui.actions.details")}
                    </Button>
                </span>,
                translate("app.ui.toast.success"),
                10000
            );

            refresh();
            onClose();
        } catch (error) {
            if (error instanceof Error) {
                appToast(
                    "error",
                    error.message.includes("already exist")
                        ? translate("resources.provider.errors.alreadyInUse")
                        : error.message
                );
            } else {
                appToast("error", translate("app.ui.create.createError"));
            }
        } finally {
            setSubmitButtonDisabled(false);
        }
    };

    if (controllerProps.isLoading || theme.length === 0) return <Loading />;

    return (
        <CreateContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-wrap">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full p-2 sm:w-1/2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            variant={InputTypes.GRAY}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            label={translate("resources.provider.fields._name")}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="fields_json_schema"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full p-2 sm:w-1/2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            variant={InputTypes.GRAY}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            label={translate("resources.provider.fields.json_schema")}
                                        />
                                    </FormControl>
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
                                            isLoading={isLoadingAllPaymentTypes}
                                            disabled={submitButtonDisabled}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="methods"
                            render={({ field }) => {
                                return (
                                    <FormItem className="w-full p-2">
                                        <Label>{translate("resources.provider.fields.methods")}</Label>
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
                                    (!hasValid && form.watch("methods")?.length !== 0) ||
                                    submitButtonDisabled
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
