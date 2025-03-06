import { useCreateController, useRefresh, CreateContextProvider, useTranslate, useDataProvider } from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingBlock } from "@/components/ui/loading";
import { useTheme } from "@/components/providers";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TerminalWithId } from "@/data/terminals";
import { useAppToast } from "@/components/ui/toast/useAppToast";

export interface ProviderCreateProps {
    provider: string;
    onClose: () => void;
}

export const TerminalCreate = ({ onClose, provider }: ProviderCreateProps) => {
    const refresh = useRefresh();
    const translate = useTranslate();
    const appToast = useAppToast();
    const dataProvider = useDataProvider();
    const controllerProps = useCreateController<TerminalWithId>();
    const { theme } = useTheme();
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const formSchema = z.object({
        verbose_name: z.string().min(1, translate("resources.terminals.errors.verbose_name")).trim(),
        description: z.union([z.string().trim(), z.literal("")])
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            verbose_name: "",
            description: ""
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;

        try {
            setSubmitButtonDisabled(true);

            await dataProvider.create<TerminalWithId>(`${provider}/terminal`, { data });

            refresh();
            form.reset();
            onClose();
        } catch (error) {
            appToast("error", translate("resources.provider.errors.alreadyInUse"));
        } finally {
            setSubmitButtonDisabled(false);
        }
    };

    if (controllerProps.isLoading || theme.length === 0) return <LoadingBlock />;

    return (
        <CreateContextProvider value={controllerProps}>
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
                                <FormItem className="w-full sm:w-full p-2">
                                    <Label className="">{translate("resources.terminals.fields.description")}</Label>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            value={field.value ?? ""}
                                            placeholder={translate("resources.wallet.manage.fields.descr")}
                                            className="w-full h-24 p-2 rounded resize-none overflow-auto dark:bg-muted text-title-1 outline-none !mt-0"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="w-full md:w-2/5 p-2 ml-auto flex flex-col sm:flex-row space-x-0 sm:space-x-2 mt-6">
                            <Button
                                type="submit"
                                variant="default"
                                className="w-full sm:w-1/2"
                                disabled={submitButtonDisabled}>
                                {translate("app.ui.actions.save")}
                            </Button>
                            <Button
                                type="button"
                                variant="outline_gray"
                                className="flex-1 mt-4 sm:mt-0 w-full sm:w-1/2"
                                onClick={() => {
                                    form.reset();
                                    onClose();
                                }}>
                                {translate("app.ui.actions.cancel")}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </CreateContextProvider>
    );
};
