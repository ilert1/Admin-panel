import { useEditController, EditContextProvider, useTranslate, useDataProvider } from "react-admin";
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
import { ProviderWithId } from "@/data/providers";
import { useAppToast } from "@/components/ui/toast/useAppToast";

export interface ProviderEditParams {
    id?: string;
    onClose?: () => void;
}

export const ProvidersEdit = ({ id, onClose = () => {} }: ProviderEditParams) => {
    const dataProvider = useDataProvider();
    const controllerProps = useEditController<ProviderWithId>({
        resource: "provider",
        id,
        mutationMode: "pessimistic"
    });

    const translate = useTranslate();
    const appToast = useAppToast();

    const [monacoEditorMounted, setMonacoEditorMounted] = useState(false);
    const [hasErrors, setHasErrors] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const formSchema = z.object({
        name: z.string().min(1, translate("resources.provider.errors.name")).trim(),
        public_key: z.string().nullable(),
        fields_json_schema: z.string().optional().default(""),
        methods: z.string()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: controllerProps.record?.name || "",
            public_key: controllerProps.record?.public_key || "",
            fields_json_schema: controllerProps.record?.fields_json_schema || "",
            methods: JSON.stringify(controllerProps.record?.methods) || ""
        }
    });

    useEffect(() => {
        if (controllerProps.record) {
            form.reset({
                name: controllerProps.record.name || "",
                public_key: controllerProps.record.public_key || "",
                fields_json_schema: controllerProps.record.fields_json_schema || "",
                methods: JSON.stringify(controllerProps.record.methods, null, 2) || ""
            });
        }
    }, [form, controllerProps.record]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;
        setSubmitButtonDisabled(true);
        data.methods = JSON.parse(data.methods);
        try {
            await dataProvider.update<ProviderWithId>("provider", {
                id,
                data,
                previousData: undefined
            });
            onClose();
        } catch (error) {
            appToast("error", translate("resources.currency.errors.alreadyInUse"));

            setSubmitButtonDisabled(false);
        }
        onClose();
    };

    usePreventFocus({ dependencies: [controllerProps.record] });

    if (controllerProps.isLoading || !controllerProps.record) return <Loading />;
    return (
        <EditContextProvider value={controllerProps}>
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
        </EditContextProvider>
    );
};
