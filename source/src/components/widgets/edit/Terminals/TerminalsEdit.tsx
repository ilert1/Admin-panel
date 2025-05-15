import { useEditController, EditContextProvider, useTranslate, useDataProvider, useRefresh } from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/loading";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { usePreventFocus } from "@/hooks";
import { TerminalWithId } from "@/data/terminals";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MonacoEditor } from "@/components/ui/MonacoEditor";

interface ProviderEditParams {
    provider: string;
    id: string;
    onClose: () => void;
}

export const TerminalsEdit: FC<ProviderEditParams> = ({ id, provider, onClose }) => {
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const refresh = useRefresh();
    const appToast = useAppToast();

    const [monacoEditorMounted, setMonacoEditorMounted] = useState(false);
    const [hasErrors, setHasErrors] = useState(false);

    const controllerProps = useEditController<TerminalWithId>({
        resource: `${provider}/terminal`,
        id,
        mutationMode: "pessimistic"
    });

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const formSchema = z.object({
        verbose_name: z.string().min(1, translate("resources.terminals.errors.verbose_name")).trim(),
        description: z.union([z.string().trim(), z.literal("")]),
        details: z.string()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            verbose_name: controllerProps.record?.verbose_name || "",
            description: controllerProps.record?.description || "",
            details: JSON.stringify(controllerProps.record?.details) || ""
        }
    });

    useEffect(() => {
        if (controllerProps.record) {
            form.reset({
                verbose_name: controllerProps.record.verbose_name || "",
                description: controllerProps.record.description || "",
                details: JSON.stringify(controllerProps.record.details, null, 2) || ""
            });
        }
    }, [form, controllerProps.record]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;
        data.details = JSON.parse(data.details);
        try {
            setSubmitButtonDisabled(true);

            await dataProvider.update<TerminalWithId>(`${provider}/terminal`, {
                id,
                data,
                previousData: undefined
            });

            refresh();
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
        } finally {
            form.reset();
            setSubmitButtonDisabled(false);
            onClose();
        }
    };

    usePreventFocus({ dependencies: [controllerProps.record] });

    if (controllerProps.isLoading || !controllerProps.record) return <Loading />;
    return (
        <EditContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                    <div className="flex flex-wrap">
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
                                onClick={() => onClose()}>
                                {translate("app.ui.actions.cancel")}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </EditContextProvider>
    );
};
