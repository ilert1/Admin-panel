import { useTranslate, useDataProvider } from "react-admin";
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
import { ProvidersDataProvider, ProviderWithId } from "@/data/providers";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { PaymentTypeMultiSelect } from "../components/MultiSelectComponents/PaymentTypeMultiSelect";
import { useGetPaymentTypes } from "@/hooks/useGetPaymentTypes";
import { useQuery } from "@tanstack/react-query";

export interface ProviderEditParams {
    id?: string;
    onClose?: () => void;
}

export const ProvidersEdit = ({ id, onClose = () => {} }: ProviderEditParams) => {
    const dataProvider = useDataProvider();
    const providersDataProvider = new ProvidersDataProvider();

    const {
        data: provider,
        isLoading: isLoadingProvider,
        isFetchedAfterMount
    } = useQuery({
        queryKey: ["provider", id],
        queryFn: () => dataProvider.getOne<ProviderWithId>("provider", { id: id ?? "" }),
        enabled: true,
        select: data => data.data
    });

    const translate = useTranslate();
    const appToast = useAppToast();

    const [monacoEditorMounted, setMonacoEditorMounted] = useState(false);
    const [hasErrors, setHasErrors] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const { allPaymentTypes, isLoadingAllPaymentTypes } = useGetPaymentTypes({});

    const formSchema = z.object({
        name: z.string().min(1, translate("resources.provider.errors.name")).trim(),
        public_key: z.string().nullable(),
        fields_json_schema: z.string().optional().default(""),
        methods: z.string(),
        payment_types: z.array(z.string()).optional()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            public_key: "",
            fields_json_schema: "",
            methods: "",
            payment_types: []
        }
    });

    useEffect(() => {
        if (!isLoadingProvider && provider && isFetchedAfterMount) {
            const updatedValues = {
                name: provider.name || "",
                public_key: provider.public_key || "",
                fields_json_schema: provider.fields_json_schema || "",
                methods: JSON.stringify(provider.methods, null, 2) || "",
                payment_types: provider?.payment_types?.map(pt => pt.code) || []
            };

            form.reset(updatedValues);
            setIsFinished(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provider, isLoadingProvider, isFetchedAfterMount]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;
        setSubmitButtonDisabled(true);
        data.methods = JSON.parse(data.methods);

        let payment_types: string[] = [];
        let oldPaymentTypes: Set<string> = new Set();

        if (provider?.payment_types) {
            oldPaymentTypes = new Set(provider?.payment_types?.map(pt => pt.code));
        }

        if (data.payment_types) {
            payment_types = [...data.payment_types];
            delete data.payment_types;
        }

        const paymentsToDelete = oldPaymentTypes.difference(new Set(payment_types));

        try {
            await dataProvider.update<ProviderWithId>("provider", {
                id,
                data,
                previousData: undefined
            });

            paymentsToDelete.forEach(async payment => {
                await providersDataProvider.removePaymentType({
                    id,
                    data: { code: payment },
                    previousData: undefined
                });
            });

            await providersDataProvider.addPaymentTypes({
                id,
                data: {
                    codes: payment_types
                },
                previousData: undefined
            });

            appToast("success", translate("app.ui.edit.editSuccess"));
            onClose();
        } catch (error) {
            appToast("error", translate("resources.currency.errors.alreadyInUse"));

            setSubmitButtonDisabled(false);
        }
        onClose();
    };

    usePreventFocus({ dependencies: [provider] });

    if (isLoadingProvider || !provider || isLoadingAllPaymentTypes || !isFinished)
        return (
            <div className="h-[400px]">
                <Loading />
            </div>
        );
    return (
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
                                        disabled
                                        variant={InputTypes.GRAY}
                                        label={translate("resources.provider.fields._name")}
                                        error={fieldState.invalid}
                                        errorMessage={<FormMessage />}
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
                                        label={translate("resources.provider.fields.json_schema")}
                                        error={fieldState.invalid}
                                        errorMessage={<FormMessage />}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="methods"
                        render={({ field }) => (
                            <FormItem className="w-full p-2">
                                <Label className="!mb-0">{translate("resources.provider.fields.code")}</Label>
                                <FormControl>
                                    <MonacoEditor
                                        width="100%"
                                        onMountEditor={() => setMonacoEditorMounted(true)}
                                        onErrorsChange={setHasErrors}
                                        code={field.value}
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
                                        options={allPaymentTypes || []}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
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
