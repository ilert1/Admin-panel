import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useRefresh, useTranslate } from "react-admin";
import { Button } from "@/components/ui/Button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { DirectionsDataProvider } from "@/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useState } from "react";
import { TerminalPaymentInstrumentsProvider } from "@/data/terminalPaymentInstruments";

interface InitializeFinancialInstitutionDialogProps {
    terminalId: string;
    open: boolean;
    onOpenChange: (state: boolean) => void;
}
export const InitializeTerminalPaymentInstrumentsDialog = ({
    terminalId,
    open,
    onOpenChange = () => {}
}: InitializeFinancialInstitutionDialogProps) => {
    const translate = useTranslate();
    const appToast = useAppToast();
    const refresh = useRefresh();

    const terminalsDataProvider = new TerminalPaymentInstrumentsProvider();
    const directionsDataProvider = new DirectionsDataProvider();

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const { isLoading, data } = useQuery({
        queryKey: ["getAvailablePaymentTypes", "terminal"],
        queryFn: async ({ signal }) => await directionsDataProvider.getAvailablePaymentTypes({ terminalId, signal }),
        enabled: !!terminalId
    });
    console.log(data);

    const formSchema = z.object({
        payment_type_codes: z.string()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            payment_type_codes: ""
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setSubmitButtonDisabled(true);

        try {
            await terminalsDataProvider.initialize(terminalId, []);

            appToast("success", translate("app.ui.create.createSuccess"));

            refresh();
            onOpenChange(false);
        } catch (error) {
            if (error instanceof Error) {
                appToast("error", error.message);
            } else {
                appToast("error", translate("app.ui.create.createError"));
            }
        } finally {
            setSubmitButtonDisabled(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center">
                        {translate(
                            "resources.paymentSettings.terminalPaymentInstruments.initializeTerminalPaymentInstrument"
                        )}
                    </DialogTitle>
                    <DialogDescription />

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                            <div className="flex flex-col flex-wrap">
                                <div className="grid grid-cols-1 sm:grid-cols-2"></div>

                                <div className="ml-auto mt-6 flex w-full flex-col space-x-0 p-2 sm:flex-row sm:space-x-2 md:w-2/5">
                                    <Button
                                        type="submit"
                                        variant="default"
                                        className="w-full sm:w-auto"
                                        disabled={submitButtonDisabled}>
                                        {translate("app.ui.actions.initialize")}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline_gray"
                                        className="mt-4 w-full flex-1 sm:mt-0 sm:w-1/2"
                                        onClick={() => onOpenChange(false)}>
                                        {translate("app.ui.actions.cancel")}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </DialogHeader>
                <DialogFooter />
            </DialogContent>
        </Dialog>
    );
};
