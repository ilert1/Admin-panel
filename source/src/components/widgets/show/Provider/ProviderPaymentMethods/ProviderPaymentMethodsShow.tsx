import { PaymentMethodConfig, ProviderPaymentMethods } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useRefresh, useTranslate } from "react-admin";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { ProvidersDataProvider } from "@/data";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { ProviderUpdateParams } from "@/data/providers";
import { ProviderPaymentMethodsForm } from "./ProviderPaymentMethodsForm";
import { ProviderPaymentMethodsTable } from "./ProviderPaymentMethodsTable";

interface IProviderMethodsShow {
    providerId: string;
    paymentMethods: ProviderPaymentMethods;
    isFetching: boolean;
}

export const ProviderPaymentMethodsShow = ({ paymentMethods, providerId, isFetching }: IProviderMethodsShow) => {
    const providersDataProvider = new ProvidersDataProvider();
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [editMethod, setEditMethod] = useState("");

    const appToast = useAppToast();
    const refresh = useRefresh();
    const translate = useTranslate();

    const onChangeMethod = async (key: keyof ProviderPaymentMethods, value: PaymentMethodConfig) => {
        const tempMethodsData = { ...paymentMethods };
        tempMethodsData[key] = { ...value };

        try {
            setButtonDisabled(true);

            await providersDataProvider.update("provider", {
                id: providerId,
                data: { payment_methods: { ...tempMethodsData } },
                previousData: { payment_methods: paymentMethods } as ProviderUpdateParams
            });

            appToast("success", translate("resources.provider.methodEditSuccess"));
            refresh();
            setEditMethod("");
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
            else appToast("error", translate("app.ui.toast.error"));
        } finally {
            setButtonDisabled(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 rounded-8 bg-neutral-0 px-8 py-4 dark:bg-neutral-100">
            <h3 className="text-2xl text-neutral-90 dark:text-neutral-30">
                {translate("resources.provider.fields.paymentMethods")}
            </h3>

            {Object.keys(paymentMethods).length > 0 ? (
                <Accordion type="multiple">
                    {(Object.keys(paymentMethods) as (keyof ProviderPaymentMethods)[]).map(methodKey => (
                        <AccordionItem key={methodKey} value={methodKey}>
                            <AccordionTrigger
                                disabled={!paymentMethods[methodKey]}
                                className="text-neutral-90 dark:text-neutral-0">
                                {methodKey}
                            </AccordionTrigger>

                            <AccordionContent>
                                {editMethod === methodKey ? (
                                    <ProviderPaymentMethodsForm
                                        methodValue={paymentMethods[methodKey]}
                                        disabledProcess={isFetching || buttonDisabled}
                                        onChangeMethod={value => onChangeMethod(methodKey, value)}
                                        onCancel={() => setEditMethod("")}
                                    />
                                ) : (
                                    <ProviderPaymentMethodsTable
                                        disabledProcess={isFetching || buttonDisabled}
                                        disabledEditButton={!!editMethod}
                                        onEditClick={() => setEditMethod(methodKey)}
                                        methodValue={paymentMethods[methodKey]}
                                    />
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            ) : (
                <span className="self-center text-lg text-neutral-50">
                    {translate("resources.provider.methodNotFound")}
                </span>
            )}
        </div>
    );
};
