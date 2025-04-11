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
import { terminalEndpointsSetTerminalAuthEnigmaV1ProviderProviderNameTerminalTerminalIdSetAuthPut } from "@/api/enigma/terminal/terminal";
import { TerminalUpdateAuthAuth } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { AuthDataViewer } from "./AuthData";

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

    const controllerProps = useEditController<TerminalWithId>({
        resource: `${provider}/terminal`,
        id,
        mutationMode: "pessimistic"
    });

    const [hasErrors, setHasErrors] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [monacoEditorMounted, setMonacoEditorMounted] = useState(false);

    const formSchema = z.object({
        verbose_name: z.string().min(1, translate("resources.terminals.errors.verbose_name")).trim(),
        description: z.union([z.string().trim(), z.literal("")]),
        auth: z.string()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            verbose_name: controllerProps.record?.verbose_name || "",
            description: controllerProps.record?.description || "",
            auth: JSON.stringify(controllerProps.record?.auth, null, 2) || ""
        }
    });

    useEffect(() => {
        if (controllerProps.record) {
            form.reset({
                verbose_name: controllerProps.record.verbose_name || "",
                description: controllerProps.record.description || "",
                auth: JSON.stringify(controllerProps.record.auth, null, 2) || ""
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

            if (data.auth) {
                const parseAuthData: TerminalUpdateAuthAuth = JSON.parse(data.auth);

                if (JSON.stringify(controllerProps.record?.auth) !== data.auth) {
                    const res =
                        await terminalEndpointsSetTerminalAuthEnigmaV1ProviderProviderNameTerminalTerminalIdSetAuthPut(
                            provider,
                            id,
                            {
                                auth: parseAuthData
                            },
                            {
                                headers: {
                                    authorization: `Bearer ${localStorage.getItem("access-token")}`
                                }
                            }
                        );

                    if ("data" in res.data && !res.data.success) {
                        throw new Error(res.data.error?.error_message);
                    } else if ("detail" in res.data) {
                        throw new Error(res.data.detail?.[0].msg);
                    }
                }
            }

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
                        <FormField
                            control={form.control}
                            name="auth"
                            render={({ field }) => (
                                <FormItem className="w-full p-2">
                                    <FormControl>
                                        <AuthDataViewer
                                            disabledEditJson={false}
                                            onMountEditor={() => setMonacoEditorMounted(true)}
                                            onErrorsChange={setHasErrors}
                                            onValidChange={setIsValid}
                                            authData={field.value}
                                            setAuthData={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="ml-auto mt-6 flex w-full flex-col space-x-0 p-2 sm:flex-row sm:space-x-2 md:w-2/5">
                            <Button
                                disabled={(hasErrors && !isValid) || submitButtonDisabled || !monacoEditorMounted}
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
