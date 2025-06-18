import { useCreateController, CreateContextProvider, useTranslate, useDataProvider } from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading } from "@/components/ui/loading";
import { useTheme } from "@/components/providers";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { ProviderWithId } from "@/data/providers";
import { ProviderCreate as IProviderCreate } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAppToast } from "@/components/ui/toast/useAppToast";

export interface ProviderCreateProps {
    onClose?: () => void;
}

export const ProviderCreate = ({ onClose = () => {} }: ProviderCreateProps) => {
    const dataProvider = useDataProvider();
    const controllerProps = useCreateController<IProviderCreate>();
    const { theme } = useTheme();

    const appToast = useAppToast();

    const translate = useTranslate();
    const [hasErrors, setHasErrors] = useState(false);
    const [hasValid, setHasValid] = useState(true);
    const [monacoEditorMounted, setMonacoEditorMounted] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const formSchema = z.object({
        name: z.string().min(1, translate("resources.provider.errors.name")).trim(),
        fields_json_schema: z.string().optional().default(""),
        methods: z.string().trim().optional()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            fields_json_schema: "",
            methods: "{}"
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;

        setSubmitButtonDisabled(true);

        const parseData: IProviderCreate = {
            name: data.name,
            methods: data.methods && data.methods.length !== 0 ? JSON.parse(data.methods) : {},
            fields_json_schema: data.fields_json_schema || ""
        };

        try {
            await dataProvider.create<ProviderWithId>("provider", { data: parseData });
            onClose();
        } catch (error) {
            appToast("error", translate("resources.provider.errors.alreadyInUse"));
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
