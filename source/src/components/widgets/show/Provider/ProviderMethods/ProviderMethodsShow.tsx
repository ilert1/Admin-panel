import {
    ExecutionMethodInput,
    ExecutionMethodOutput,
    ProviderMethods,
    ProviderUpdateMethodsAnyOf
} from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useRefresh, useTranslate } from "react-admin";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ProviderMethodsTable } from "./ProviderMethodsTable";
import { Button } from "@/components/ui/Button";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { ProviderMethodsForm } from "./ProviderMethodsForm";
import { ProvidersDataProvider } from "@/data";
import { useAppToast } from "@/components/ui/toast/useAppToast";

interface IProviderMethodsShow {
    providerId: string;
    methods: ProviderMethods | ProviderUpdateMethodsAnyOf;
    isFetching: boolean;
}

export const ProviderMethodsShow = ({ methods, providerId, isFetching }: IProviderMethodsShow) => {
    const providersDataProvider = new ProvidersDataProvider();
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [editMethod, setEditMethod] = useState("");
    const [addMethodForm, setAddMethodForm] = useState(false);

    const appToast = useAppToast();
    const refresh = useRefresh();
    const translate = useTranslate();

    const updateProviderMethods = async (tempMethodsData: typeof methods) => {
        try {
            setButtonDisabled(true);

            await providersDataProvider.update("provider", {
                id: providerId,
                data: { methods: { ...tempMethodsData } },
                previousData: undefined
            });

            appToast("success", translate("app.ui.edit.editSuccess"));
            refresh();
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
            else appToast("error", translate("app.ui.toast.error"));
        } finally {
            setButtonDisabled(false);
        }
    };

    const onChangeMethod = async (originalKey: string, key: string, value: ExecutionMethodInput) => {
        const tempMethodsData = { ...methods };

        if (originalKey === key) {
            tempMethodsData[originalKey] = { ...value };
        } else {
            delete tempMethodsData[originalKey];
            tempMethodsData[key] = { ...value };
        }

        await updateProviderMethods(tempMethodsData);
        setEditMethod("");
    };

    const onAddMethod = async (key: string, value: ExecutionMethodInput) => {
        if (Object.keys(methods).includes(key)) {
            appToast("error", translate("resources.provider.errors.methodAlreadyExist"));
            return;
        }

        await updateProviderMethods({ ...methods, [key]: { ...value } });
        setAddMethodForm(false);
    };

    const onRemoveMethod = async (originalKey: string) => {
        const tempMethodsData = { ...methods };
        delete tempMethodsData[originalKey];

        await updateProviderMethods(tempMethodsData);
    };

    return (
        <div className="flex flex-col gap-4 rounded-8 bg-neutral-0 px-8 py-4 dark:bg-neutral-100">
            <h3 className="text-2xl text-neutral-90 dark:text-neutral-30">
                {translate("resources.provider.fields.methods")}
            </h3>

            {Object.keys(methods).length > 0 ? (
                <Accordion type="multiple">
                    {Object.keys(methods).map(methodKey => (
                        <AccordionItem key={methodKey} value={methodKey}>
                            <AccordionTrigger>{methodKey}</AccordionTrigger>

                            <AccordionContent>
                                {editMethod === methodKey ? (
                                    <ProviderMethodsForm
                                        methodKey={methodKey}
                                        methodValue={methods[methodKey]}
                                        disabledProcess={isFetching || buttonDisabled}
                                        onChangeMethod={(key, value) => onChangeMethod(methodKey, key, value)}
                                        onCancel={() => setEditMethod("")}
                                    />
                                ) : (
                                    <ProviderMethodsTable
                                        disabledProcess={isFetching || buttonDisabled}
                                        disabledEditButton={!!editMethod}
                                        onDeleteClick={() => onRemoveMethod(methodKey)}
                                        onEditClick={() => setEditMethod(methodKey)}
                                        methodValue={methods[methodKey] as ExecutionMethodOutput}
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

            <Button
                disabled={addMethodForm || isFetching || buttonDisabled}
                className="flex items-center gap-1 self-end"
                onClick={() => setAddMethodForm(true)}>
                <CirclePlus className="h-[16px] w-[16px]" />
                <span className="text-title-1">{translate("resources.provider.addMethod")}</span>
            </Button>

            {addMethodForm && (
                <ProviderMethodsForm
                    disabledProcess={isFetching || buttonDisabled}
                    onChangeMethod={onAddMethod}
                    onCancel={() => setAddMethodForm(false)}
                />
            )}
        </div>
    );
};
