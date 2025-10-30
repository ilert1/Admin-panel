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
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useState } from "react";
import { TerminalPaymentInstrumentsDataProvider } from "@/data/terminalPaymentInstruments";
import { PaymentTypeMultiSelect } from "../../components/MultiSelectComponents/PaymentTypeMultiSelect";
import { CurrenciesMultiSelect } from "../../components/MultiSelectComponents/CurrenciesMultiSelect";
import { useCurrenciesListWithoutPagination } from "@/hooks";
import { TerminalWithId } from "@/data/terminals";

interface InitializeFinancialInstitutionDialogProps {
    terminal: TerminalWithId | undefined;
    open: boolean;
    onOpenChange: (state: boolean) => void;
}
export const InitializeTerminalPaymentInstrumentsDialog = ({
    terminal,
    open,
    onOpenChange = () => {}
}: InitializeFinancialInstitutionDialogProps) => {
    const { currenciesData, currenciesLoadingProcess } = useCurrenciesListWithoutPagination();
    const translate = useTranslate();
    const appToast = useAppToast();
    const refresh = useRefresh();

    const terminalsDataProvider = new TerminalPaymentInstrumentsDataProvider();

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const formSchema = z.object({
        payment_type_codes: z.array(z.string()),
        currency_codes: z.array(z.string()).optional()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            payment_type_codes: [],
            currency_codes: []
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setSubmitButtonDisabled(true);

        try {
            if (terminal) {
                await terminalsDataProvider.initialize(
                    terminal.terminal_id,
                    data.payment_type_codes,
                    data.currency_codes
                );

                appToast("success", translate("app.ui.create.createSuccess"));

                refresh();
                onOpenChange(false);
            } else {
                throw new Error("Terminal is undefined");
            }
        } catch (error) {
            if (error instanceof Error) {
                appToast("error", error.message);
            } else {
                appToast("error", translate("app.ui.create.createError"));
            }
        } finally {
            form.reset();
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
                            "resources.paymentSettings.terminalPaymentInstruments.initializeTerminalPaymentInstrument",
                            { terminal: terminal?.verbose_name }
                        )}
                    </DialogTitle>
                    <DialogDescription />

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                            <div className="flex flex-col flex-wrap">
                                <div className="grid grid-cols-1 sm:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="payment_type_codes"
                                        render={({ field }) => (
                                            <FormItem className="w-full p-2">
                                                <FormControl>
                                                    <PaymentTypeMultiSelect
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        options={terminal?.payment_types}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="currency_codes"
                                        render={({ field }) => (
                                            <FormItem className="w-full p-2">
                                                <CurrenciesMultiSelect
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    options={currenciesData || []}
                                                    isLoading={currenciesLoadingProcess}
                                                />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="ml-auto mt-6 flex w-full flex-col space-x-0 p-2 sm:flex-row sm:space-x-2 md:w-2/5">
                                    <Button
                                        type="submit"
                                        variant="default"
                                        className="w-full sm:w-auto"
                                        disabled={
                                            !terminal ||
                                            submitButtonDisabled ||
                                            currenciesLoadingProcess ||
                                            terminal?.payment_types?.length === 0 ||
                                            form.getValues("payment_type_codes").length === 0
                                        }>
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
