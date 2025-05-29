import { CallbackMappingCreate } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button, useDataProvider, useRefresh, useTranslate } from "react-admin";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

interface PaymentInstrumentCreateProps {
    onOpenChange: (state: boolean) => void;
}

export const PaymentInstrumentCreate = (props: PaymentInstrumentCreateProps) => {
    const { onOpenChange } = props;
    const translate = useTranslate();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();

    const appToast = useAppToast();

    const [buttonDisabled, setButtonDisabled] = useState(false);

    const onSubmit: SubmitHandler<CallbackMappingCreate> = async data => {
        if (buttonDisabled) return;
        setButtonDisabled(true);
        try {
            await dataProvider.create("callbridge/v1/mapping", { data: data });
            appToast(
                "success",
                translate("resources.paymentTools.systemPaymentInstruments.createSuccess"),
                translate("app.ui.toast.success"),
                10000
            );

            refresh();
            onOpenChange(false);
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
            else
                appToast(
                    "error",
                    translate("resources.paymentTools.systemPaymentInstruments.errors.errorWhenCreating")
                );
            setButtonDisabled(false);
        }
    };

    const formSchema = z.object({
        name: z.string().min(1, translate("resources.paymentTools.systemPaymentInstruments.errors.cantBeEmpty")),
        payment_type_code: z
            .string()
            .min(1, translate("resources.paymentTools.systemPaymentInstruments.errors.cantBeEmpty")),
        currency_code: z
            .string()
            .min(1, translate("resources.paymentTools.systemPaymentInstruments.errors.cantBeEmpty")),
        financial_institution_id: z
            .string()
            .uuid()
            .min(1, translate("resources.paymentTools.systemPaymentInstruments.errors.cantBeEmpty")),
        direction: z.enum(["universal", "deposit", "withdraw"]).default("universal"),
        status: z.string().min(1, translate("resources.paymentTools.systemPaymentInstruments.errors.cantBeEmpty")),
        description: z.string().min(1, translate("resources.paymentTools.systemPaymentInstruments.errors.cantBeEmpty")),
        meta: z.object({
            processor_id: z
                .string()
                .min(1, translate("resources.paymentTools.systemPaymentInstruments.errors.cantBeEmpty")),
            region: z.string().min(1, translate("resources.paymentTools.systemPaymentInstruments.errors.cantBeEmpty"))
        })
    });

    // {
    //     "name": "MainCardProcessor_USD_Deposit",
    //     "payment_type_code": "card2card",
    //     "currency_code": "USD",
    //     "financial_institution_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    //     "direction": "universal",
    //     "status": "active",
    //     "description": "Primary instrument for USD card deposits via MainCardProcessor.",
    //     "meta": {
    //     "processor_id": "proc_001",
    //     "region": "US"
    //     }
    //     }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            payment_type_code: "",
            currency_code: "",
            financial_institution_id: "",
            direction: "",
            status: "",
            description: "",
            meta: {
                processor_id: "",
                region: ""
            }
        }
    });

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => {
                            return (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            variant={InputTypes.GRAY}
                                            label={translate("resources.callbridge.mapping.fields.name")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                        />
                                    </FormControl>
                                </FormItem>
                            );
                        }}
                    />
                    <FormField
                        control={form.control}
                        name="internal_path"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        variant={InputTypes.GRAY}
                                        label={translate("resources.callbridge.mapping.fields.ext_path")}
                                        error={fieldState.invalid}
                                        errorMessage={<FormMessage />}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="external_path"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        variant={InputTypes.GRAY}
                                        label={translate("resources.callbridge.mapping.fields.int_path")}
                                        error={fieldState.invalid}
                                        errorMessage={<FormMessage />}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        label={translate("resources.callbridge.mapping.fields.description")}
                                        variant={InputTypes.GRAY}
                                        error={fieldState.invalid}
                                        errorMessage={<FormMessage />}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:self-end">
                    <Button type="submit" variant="default" className="w-full sm:w-auto">
                        {translate("app.ui.actions.save")}
                    </Button>
                    <Button
                        onClick={() => onOpenChange(false)}
                        variant="outline_gray"
                        type="button"
                        className="w-full rounded-4 border border-neutral-50 hover:border-neutral-100 sm:w-auto">
                        {translate("app.ui.actions.cancel")}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};
