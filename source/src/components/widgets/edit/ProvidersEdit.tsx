import { useEditController, EditContextProvider, useTranslate, useDataProvider } from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { usePreventFocus } from "@/hooks";

export interface ProviderEditParams {
    id?: string;
    onClose?: () => void;
}

export const ProvidersEdit = ({ id, onClose = () => {} }: ProviderEditParams) => {
    const dataProvider = useDataProvider();
    const controllerProps = useEditController({ resource: "provider", id, mutationMode: "pessimistic" });

    const translate = useTranslate();

    const [hasErrors, setHasErrors] = useState(false);
    const [isValid, setIsValid] = useState(false);
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
            await dataProvider.update("provider", {
                id,
                data,
                previousData: undefined
            });
            onClose();
        } catch (error) {
            toast.error("Error", {
                description: translate("resources.currency.errors.alreadyInUse"),
                dismissible: true,
                duration: 3000
            });

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
                            render={({ field }) => (
                                <FormItem className="w-full sm:w-1/2 p-2">
                                    <FormLabel>
                                        <span className="!text-note-1 !text-neutral-30">
                                            {translate("resources.provider.fields._name")}
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input {...field} disabled variant={InputTypes.GRAY} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="fields_json_schema"
                            render={({ field }) => (
                                <FormItem className="w-full sm:w-1/2 p-2">
                                    <FormLabel>
                                        <span className="!text-note-1 !text-neutral-30">
                                            {translate("resources.provider.fields.json_schema")}
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input {...field} variant={InputTypes.GRAY} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="methods"
                            render={({ field }) => (
                                <FormItem className="w-full p-2">
                                    <FormLabel>
                                        <span className="!text-note-1 !text-neutral-30">
                                            {translate("resources.provider.fields.code")}
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <MonacoEditor
                                            height="144px"
                                            width="100%"
                                            onErrorsChange={setHasErrors}
                                            onValidChange={setIsValid}
                                            code={field.value}
                                            setCode={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="w-full md:w-2/5 p-2 ml-auto flex flex-col sm:flex-row space-x-0 sm:space-x-2 mt-6">
                            <Button
                                disabled={hasErrors && isValid && submitButtonDisabled}
                                type="submit"
                                variant="default"
                                className="flex-1">
                                {translate("app.ui.actions.save")}
                            </Button>
                            <Button
                                type="button"
                                variant="outline_gray"
                                className="flex-1 mt-4 sm:mt-0 w-full sm:w-1/2"
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
