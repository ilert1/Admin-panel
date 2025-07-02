import { ProviderMethods } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useTranslate } from "react-admin";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ProviderMethodsTable } from "./ProviderMethodsTable";
import { Button } from "@/components/ui/Button";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { ProviderMethodsForm } from "./ProviderMethodsForm";

interface IProviderMethodsShow {
    methods: ProviderMethods;
}

export const ProviderMethodsShow = ({ methods }: IProviderMethodsShow) => {
    const [editMethod, setEditMethod] = useState(false);
    const [addMethodForm, setAddMethodForm] = useState(false);
    const translate = useTranslate();

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
                                {editMethod ? (
                                    <ProviderMethodsForm
                                        methodKey={methodKey}
                                        methodValue={methods[methodKey]}
                                        onChangeMethod={(key, value) => console.log(key, value)}
                                        onCancel={() => setEditMethod(false)}
                                    />
                                ) : (
                                    <ProviderMethodsTable
                                        onEditClick={() => setEditMethod(true)}
                                        executionMethod={methods[methodKey]}
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
                disabled={addMethodForm}
                className="flex items-center gap-1 self-end"
                onClick={() => setAddMethodForm(true)}>
                <CirclePlus className="h-[16px] w-[16px]" />
                <span className="text-title-1">{translate("resources.provider.addMethod")}</span>
            </Button>

            {addMethodForm && (
                <ProviderMethodsForm
                    onChangeMethod={(key, value) => console.log(key, value)}
                    onCancel={() => setAddMethodForm(false)}
                />
            )}
        </div>
    );
};
