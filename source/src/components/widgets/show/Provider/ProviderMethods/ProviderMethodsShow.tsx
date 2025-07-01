import { ProviderMethods } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useTranslate } from "react-admin";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ProviderMethodsTable } from "./ProviderMethodsTable";
import { Button } from "@/components/ui/Button";
import { CirclePlus } from "lucide-react";

interface IProviderMethodsShow {
    methods: ProviderMethods;
}

export const ProviderMethodsShow = ({ methods }: IProviderMethodsShow) => {
    const translate = useTranslate();

    return (
        <div className="flex flex-col gap-4 rounded-8 bg-neutral-100 px-8 py-4">
            <h3 className="text-2xl">{translate("resources.provider.fields.methods")}</h3>

            <Accordion type="multiple">
                {Object.keys(methods).map(methodKey => (
                    <AccordionItem key={methodKey} value={methodKey}>
                        <AccordionTrigger>{methodKey}</AccordionTrigger>

                        <AccordionContent>
                            <ProviderMethodsTable executionMethod={methods[methodKey]} />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            <Button className="flex items-center gap-1 self-end" onClick={() => {}}>
                <CirclePlus className="h-[16px] w-[16px]" />
                <span className="text-title-1">{translate("resources.provider.addMethod")}</span>
            </Button>
        </div>
    );
};
