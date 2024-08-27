import { useParams } from "react-router-dom";
import { useEditController, EditContextProvider, useTranslate, useRedirect, useDataProvider } from "react-admin";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Editor } from "@monaco-editor/react";
import { useTheme } from "@/components/providers";
import { useToast } from "@/components/ui/use-toast";

export const ProvidersEdit = () => {
    const dataProvider = useDataProvider();
    const [error, setError] = useState(false);
    const { record, isLoading } = useEditController();

    const { id } = useParams();

    const controllerProps = useEditController();
    controllerProps.mutationMode = "pessimistic";

    const translate = useTranslate();
    const redirect = useRedirect();
    const { theme } = useTheme();
    const { toast } = useToast();

    useEffect(() => {
        if (record) {
            form.reset({
                name: record.name || "",
                public_key: record.public_key || "",
                fields_json_schema: record.fields_json_schema || "",
                methods: JSON.stringify(record.methods, null, 2) || ""
            });
        }
    }, [record]);

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
                description: translate("resources.currencies.errors.alreadyInUse"),
                variant: "destructive",
                title: "Error"
            });
        }
    };

    const handleEditorDidMount = (editor: any, monaco: any) => {
        monaco.editor.setTheme(`vs-${theme}`);
    };

    const formSchema = z.object({
        name: z.string().min(1, translate("resources.merchants.errors.name")),
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
                                    <FormLabel>{translate("resources.providers.fields.name")}</FormLabel>
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
                            name="fields_json_schema"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>{translate("resources.providers.fields.json_schema")}</FormLabel>
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
                                    <FormLabel>{translate("resources.providers.fields.code")}</FormLabel>
                                    <FormControl>
                                        <Editor
                                            {...field}
                                            height="20vh"
                                            defaultLanguage="json"
                                            onValidate={markers => {
                                                setError(markers.length > 0);
                                            }}
                                            loading={<Loading />}
                                            onMount={handleEditorDidMount}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="w-full md:w-2/5 p-2 ml-auto flex space-x-2">
                            <Button type="submit" variant="error" className="flex-1">
                                {translate("app.ui.actions.cancel")}
                            </Button>
                            <Button type="submit" variant="default" className="flex-1">
                                {translate("app.ui.actions.save")}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </EditContextProvider>
    );
};
