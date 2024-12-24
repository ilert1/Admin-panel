import { useCreateController, CreateContextProvider, useTranslate, useDataProvider } from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading } from "@/components/ui/loading";
import { useTheme } from "@/components/providers";
import { MonacoEditor } from "@/components/ui/MonacoEditor";

export interface ProviderCreateProps {
    onClose?: () => void;
}

export const ProviderCreate = ({ onClose = () => {} }: ProviderCreateProps) => {
    const dataProvider = useDataProvider();
    const controllerProps = useCreateController();
    const { theme } = useTheme();

    const translate = useTranslate();
    const [hasErrors, setHasErrors] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const formSchema = z.object({
        name: z.string().min(1, translate("resources.merchant.errors.name")).trim(),
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

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;

        setSubmitButtonDisabled(true);

        const parseData: Omit<Provider, "id"> = {
            name: data.name,
            methods: data.methods && data.methods.length !== 0 ? JSON.parse(data.methods) : {},
            fields_json_schema: data.fields_json_schema || "",
            public_key: data.public_key || null
        };

        try {
            await dataProvider.create("provider", { data: parseData });
            onClose();
        } catch (error) {
            toast.error(translate("resources.transactions.download.error"), {
                description: translate("resources.provider.errors.alreadyInUse"),
                dismissible: true,
                duration: 3000
            });
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
                            render={({ field }) => (
                                <FormItem className="w-full sm:w-1/2 p-2">
                                    <FormLabel>
                                        <span className="!text-note-1 !text-neutral-30">
                                            {translate("resources.provider.fields._name")}
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input {...field} variant={InputTypes.GRAY} className="shadow-1" />
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
                                            <Input {...field} variant={InputTypes.GRAY} className="shadow-1" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="methods"
                            render={({ field }) => {
                                return (
                                    <FormItem className="w-full p-2">
                                        <FormLabel>
                                            <span className="!text-note-1 !text-neutral-30">
                                                {translate("resources.provider.fields.code")}
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <MonacoEditor
                                                onErrorsChange={setHasErrors}
                                                onValidChange={setIsValid}
                                                code={field.value || "{}"}
                                                setCode={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                        <div className="w-full md:w-2/5 p-2 ml-auto flex flex-col sm:flex-row space-x-0 sm:space-x-2 mt-6">
                            <Button
                                type="submit"
                                variant="default"
                                className="w-full sm:w-1/2"
                                disabled={hasErrors && isValid && submitButtonDisabled}>
                                {translate("app.ui.actions.save")}
                            </Button>
                            <Button
                                type="button"
                                variant="deleteGray"
                                className="flex-1 mt-4 sm:mt-0  w-full sm:w-1/2"
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
