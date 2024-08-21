import { useCreateController, CreateContextProvider, useRedirect, useTranslate, useDataProvider } from "react-admin";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading } from "@/components/ui/loading";
import { Editor } from "@monaco-editor/react";
import { useTheme } from "@/components/providers";

export const ProviderCreate = () => {
    const dataProvider = useDataProvider();
    const controllerProps = useCreateController();
    const { toast } = useToast();
    const { theme } = useTheme();

    const translate = useTranslate();
    const redirect = useRedirect();
    const [editorValue, setEditorValue] = useState("{}");
    const [error, setError] = useState(false);
    const formSchema = z.object({
        name: z.string().min(1, translate("resources.merchants.errors.name")),
        public_key: z.string().nullable(),
        fields_json_schema: z.string().optional().default(""),
        methods: z.string()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            public_key: "",
            fields_json_schema: "",
            methods: ""
        }
    });

    const onSubmit: SubmitHandler<Omit<Provider, "id">> = async data => {
        if (data.methods.length === 0) {
            data.methods = {};
        } else {
            data.methods = JSON.parse(data.methods);
        }

        if (!data.methods) {
            data.methods = {};
        }

        if (!data.fields_json_schema) {
            data.fields_json_schema = "";
        }

        if (!data.public_key) {
            data.public_key = null;
        }
        try {
            await dataProvider.create("provider", { data });
            redirect("list", "provider");
        } catch (error) {
            toast({
                description: translate("resources.providers.errors.alreadyInUse"),
                variant: "error",
                title: translate("resources.transactions.download.error")
            });
        }
    };
    const handleEditorDidMount = (editor: any, monaco: any) => {
        monaco.editor.setTheme(`vs-${theme}`);
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
                                            value={editorValue}
                                            onChange={value => {
                                                setEditorValue(value || "{}");
                                                field.onChange(value);
                                            }}
                                            onValidate={markers => {
                                                setError(markers.length > 0);
                                            }}
                                            options={{
                                                theme: `vs-${theme}`
                                            }}
                                            loading={<Loading />}
                                            onMount={handleEditorDidMount}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="w-1/4 p-2 ml-auto">
                            <Button type="submit" variant="default" className="w-full" disabled={error}>
                                {translate("app.ui.actions.save")}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </CreateContextProvider>
    );
};
