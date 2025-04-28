import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { TerminalsDataProvider } from "@/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRefresh, useTranslate } from "react-admin";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

export interface GenerateCallbackDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    terminalId: string;
    providerName: string;
}
export const GenerateCallbackDialog = (props: GenerateCallbackDialogProps) => {
    const { open, terminalId, providerName, onOpenChange } = props;
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const refresh = useRefresh();
    const translate = useTranslate();
    const dataProvider = new TerminalsDataProvider();

    const appToast = useAppToast();

    const formSchema = z.object({
        callback_url: z.string().min(1, translate("resources.callbridge.mapping.errors.cantBeEmpty"))
    });

    type FormSchemaType = z.infer<typeof formSchema>;

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            callback_url: ""
        }
    });
    const onSubmit = async (data: FormSchemaType) => {
        if (buttonDisabled) {
            return;
        }

        setButtonDisabled(true);
        try {
            await dataProvider.createCallback(`${providerName}/terminal`, {
                data,
                id: terminalId
            });
            appToast("success", translate("resources.terminals.callbackCreatedSuccessfully"));
            onOpenChange(false);
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
        } finally {
            setButtonDisabled(false);
            refresh();
        }
    };

    useEffect(() => {
        form.reset({
            callback_url: ""
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[300px] max-w-[340px] overflow-auto bg-muted sm:max-h-[250px]">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {translate("resources.terminals.callbackCreating")}
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription className="hidden" />
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-6">
                        <div>
                            <FormField
                                control={form.control}
                                name="callback_url"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                variant={InputTypes.GRAY}
                                                label={translate("resources.terminals.urlTemplate")}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex w-full flex-col justify-between gap-4 sm:flex-row">
                            <Button className="w-full" disabled={buttonDisabled} type="submit">
                                {translate("app.ui.actions.save")}
                            </Button>
                            <Button
                                className="w-full"
                                variant={"outline"}
                                onClick={() => {
                                    onOpenChange(false);
                                }}>
                                {translate("app.ui.actions.cancel")}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
};
