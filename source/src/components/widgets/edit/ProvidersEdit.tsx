import { useEditController, EditContextProvider, useTranslate, useRedirect, useDataProvider } from "react-admin";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loading, LoadingAlertDialog } from "@/components/ui/loading";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Editor } from "@monaco-editor/react";
import { useTheme } from "@/components/providers";
import { useToast } from "@/components/ui/use-toast";

export interface ProviderEditParams {
    id?: string;
    onClose?: () => void;
}

export const ProvidersEdit: FC<ProviderEditParams> = params => {
    const dataProvider = useDataProvider();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const { id, onClose = () => {} } = params;

    const { record, isLoading } = useEditController({ resource: "provider", id });

    const controllerProps = useEditController({ resource: "provider", id });
    controllerProps.mutationMode = "pessimistic";

    const translate = useTranslate();
    const redirect = useRedirect();
    const { toast } = useToast();
    const { theme } = useTheme();

    const formSchema = z.object({
        name: z.string().min(1, translate("resources.providers.errors.name")).trim(),
        public_key: z.string().nullable(),
        fields_json_schema: z.string().optional().default(""),
        methods: z.string()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: record?.name || "",
            public_key: record?.public_key || "",
            fields_json_schema: record?.fields_json_schema || "",
            methods: JSON.stringify(record?.methods) || ""
        }
    });

    useEffect(() => {
        if (record) {
            form.reset({
                name: record.name || "",
                public_key: record.public_key || "",
                fields_json_schema: record.fields_json_schema || "",
                methods: JSON.stringify(record.methods, null, 2) || ""
            });
        }
    }, [form, record]);

    const onSubmit: SubmitHandler<Omit<Omit<Provider, "id">, "name">> = async data => {
        data.methods = JSON.parse(data.methods);
        try {
            await dataProvider.update("provider", {
                id,
                data,
                previousData: undefined
            });
            redirect("list", "provider");
        } catch (error) {
            toast({
                description: translate("resources.currency.errors.alreadyInUse"),
                variant: "destructive",
                title: "Error"
            });
        }
        onClose();
    };

    const handleEditorDidMount = (editor: any, monaco: any) => {
        monaco.editor.setTheme(`vs-${theme}`);
    };

    if (isLoading || !record) return <Loading />;
    return (
        <EditContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-wrap">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>
                                        <span className="!text-note-1 !text-neutral-30">
                                            {translate("resources.providers.fields._name")}
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input {...field} disabled />
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
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>
                                        <span className="!text-note-1 !text-neutral-30">
                                            {translate("resources.providers.fields.json_schema")}
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input {...field} />
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
                                            {translate("resources.providers.fields.code")}
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Editor
                                            {...field}
                                            height="20vh"
                                            defaultLanguage="json"
                                            onValidate={markers => {
                                                setError(markers.length > 0);
                                            }}
                                            loading={<LoadingAlertDialog />}
                                            onMount={handleEditorDidMount}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="w-full md:w-2/5 p-2 ml-auto flex space-x-2">
                            <Button type="submit" variant="default" className="flex-1">
                                {translate("app.ui.actions.save")}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 border-neutral-50 text-neutral-50 bg-muted"
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
