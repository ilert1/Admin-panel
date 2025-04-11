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
import { AuthDataViewer } from "./AuthData";

interface ProviderEditParams {
    provider: string;
    id: string;
    showAuthDataEditSheet: () => void;
    onClose: () => void;
}

export const TerminalsEdit: FC<ProviderEditParams> = ({ id, provider, onClose, showAuthDataEditSheet }) => {
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const refresh = useRefresh();
    const appToast = useAppToast();

    const controllerProps = useEditController<TerminalWithId>({
        resource: `${provider}/terminal`,
        id,
        mutationMode: "pessimistic"
    });

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const formSchema = z.object({
        verbose_name: z.string().min(1, translate("resources.terminals.errors.verbose_name")).trim(),
        description: z.union([z.string().trim(), z.literal("")])
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            verbose_name: controllerProps.record?.verbose_name || "",
            description: controllerProps.record?.description || ""
        }
    });

    useEffect(() => {
        if (controllerProps.record) {
            form.reset({
                verbose_name: controllerProps.record.verbose_name || "",
                description: controllerProps.record.description || ""
            });
        }
    }, [form, controllerProps.record]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;

        try {
            setSubmitButtonDisabled(true);

            await dataProvider.update<TerminalWithId>(`${provider}/terminal`, {
                id,
                data: {
                    verbose_name: data.verbose_name,
                    description: data.description
                },
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-wrap">
                        <FormField
                            control={form.control}
                            name="verbose_name"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full p-2 sm:w-1/2">
                                    <FormControl>
                                        <Input
                                            label={translate("resources.terminals.fields.verbose_name")}
                                            error={fieldState.invalid}
                                            variant={InputTypes.GRAY}
                                            errorMessage={<FormMessage />}
                                            autoCorrect="off"
                                            autoCapitalize="none"
                                            spellCheck="false"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full p-2 sm:w-1/2">
                                    <FormControl>
                                        <Input
                                            variant={InputTypes.GRAY}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            label={translate("resources.terminals.fields.description")}
                                            autoCorrect="off"
                                            autoCapitalize="none"
                                            spellCheck="false"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="w-full p-2">
                            <AuthDataViewer
                                authData={controllerProps.record?.auth}
                                showAuthDataEditSheet={showAuthDataEditSheet}
                            />
                        </div>

                        <div className="ml-auto mt-6 flex w-full flex-col space-x-0 p-2 sm:flex-row sm:space-x-2 md:w-2/5">
                            <Button disabled={submitButtonDisabled} type="submit" variant="default" className="flex-1">
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
