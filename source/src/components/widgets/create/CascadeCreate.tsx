import { useCreateController, CreateContextProvider, useTranslate, useDataProvider } from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading } from "@/components/ui/loading";
import { useTheme } from "@/components/providers";
import { PaymentTypeCreate as IPaymentTypeCreate } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { Label } from "@/components/ui/label";
import { MonacoEditor } from "@/components/ui/MonacoEditor";

export const CascadeCreate = ({ onClose = () => {} }: { onClose?: () => void }) => {
    const dataProvider = useDataProvider();
    const controllerProps = useCreateController<IPaymentTypeCreate>();
    const { theme } = useTheme();
    const appToast = useAppToast();
    const translate = useTranslate();

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [hasErrors, setHasErrors] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [monacoEditorMounted, setMonacoEditorMounted] = useState(false);

    const formSchema = z.object({
        name: z
            .string()
            .min(1, translate("resources.paymentSettings.paymentType.errors.code"))
            .regex(/^[a-z0-9_]+$/, translate("resources.paymentSettings.paymentType.errors.codeRegex"))
            .trim(),
        details: z.string().trim().optional()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            details: "{}"
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;

        setSubmitButtonDisabled(true);

        try {
            await dataProvider.create("cascades", {
                data: {
                    ...data,
                    details: data.details && data.details.length !== 0 ? JSON.parse(data.details) : {}
                }
            });

            appToast("success", translate("app.ui.create.createSuccess"));
            onClose();
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("already exists")) {
                    appToast("error", translate("resources.cascadeSettings.cascades.errors.duplicateCode"));
                } else if (error.message.includes("paymentFieldsRegex")) {
                    appToast("error", translate("resources.cascadeSettings.cascades.errors.paymentFieldsRegex"));
                } else {
                    appToast("error", error.message);
                }
            } else {
                appToast("error", translate("app.ui.toast.error"));
            }
        } finally {
            setSubmitButtonDisabled(false);
        }
    };

    if (controllerProps.isLoading || theme.length === 0)
        return (
            <div className="h-[300px]">
                <Loading />
            </div>
        );

    return (
        <CreateContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <div className="flex flex-col flex-wrap">
                        <div className="grid grid-cols-1 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                variant={InputTypes.GRAY}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                label={translate("resources.cascadeSettings.cascades.fields.name")}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="details"
                                render={({ field }) => {
                                    return (
                                        <FormItem className="col-span-1 w-full p-2 sm:col-span-2">
                                            <Label>
                                                {translate("resources.cascadeSettings.cascades.fields.details")}
                                            </Label>
                                            <FormControl>
                                                <MonacoEditor
                                                    onErrorsChange={setHasErrors}
                                                    onValidChange={setIsValid}
                                                    onMountEditor={() => setMonacoEditorMounted(true)}
                                                    code={field.value ?? "{}"}
                                                    setCode={field.onChange}
                                                    allowEmptyValues
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                        </div>
                        <div className="ml-auto mt-6 flex w-full flex-col space-x-0 p-2 sm:flex-row sm:space-x-2 md:w-2/5">
                            <Button
                                type="submit"
                                variant="default"
                                className="w-full sm:w-1/2"
                                disabled={
                                    submitButtonDisabled ||
                                    hasErrors ||
                                    (!isValid && form.watch("details")?.length !== 0) ||
                                    !monacoEditorMounted
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
