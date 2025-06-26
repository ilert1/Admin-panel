import { ProviderMethods } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface IProviderMethodsViewer {
    methods: ProviderMethods;
}

export const ProviderMethodsViewer = ({ methods }: IProviderMethodsViewer) => {
    return (
        <Accordion type="multiple">
            {Object.keys(methods).map(methodKey => (
                <AccordionItem key={methodKey} value={methodKey}>
                    <AccordionTrigger>{methodKey}</AccordionTrigger>
                    <AccordionContent className="border pb-0">
                        <div className="grid grid-cols-2 border-b">
                            <p className="border-r p-2">execution_name</p>
                            <p className="p-2">{methods[methodKey].execution_name}</p>
                        </div>
                        <div className="grid grid-cols-2 border-b">
                            <p className="border-r p-2">retry_policy</p>
                            <div>
                                <div className="grid grid-cols-2 border-b">
                                    <p className="border-r p-2">backoff_coefficient</p>
                                    <p className="p-2">{methods[methodKey].retry_policy?.backoff_coefficient}</p>
                                </div>

                                <div className="grid grid-cols-2 border-b">
                                    <p className="border-r p-2">initial_interval</p>
                                    <p className="p-2">{methods[methodKey].retry_policy?.initial_interval}</p>
                                </div>

                                <div className="grid grid-cols-2 border-b">
                                    <p className="border-r p-2">maximum_attempts</p>
                                    <p className="p-2">{methods[methodKey].retry_policy?.maximum_attempts}</p>
                                </div>

                                <div className="grid grid-cols-2 border-b">
                                    <p className="border-r p-2">maximum_interval</p>
                                    <p className="p-2">{methods[methodKey].retry_policy?.maximum_interval}</p>
                                </div>

                                <div className="grid grid-cols-2">
                                    <p className="border-r p-2">non_retryable_error_types</p>
                                    <p className="border-r p-2">
                                        {methods[methodKey].retry_policy?.non_retryable_error_types}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 border-b">
                            <p className="border-r p-2">task_queue</p>
                            <p className="p-2">{methods[methodKey].task_queue}</p>
                        </div>
                        <div className="grid grid-cols-2 border-b">
                            <p className="border-r p-2">timeouts</p>
                            <div>
                                <div className="grid grid-cols-2 border-b">
                                    <p className="border-r p-2">start_to_close_timeout</p>
                                    <p className="p-2">{methods[methodKey].timeouts?.start_to_close_timeout}</p>
                                </div>

                                <div className="grid grid-cols-2 border-b">
                                    <p className="border-r p-2">wait_condition_timeout</p>
                                    <p className="p-2">{methods[methodKey].timeouts?.wait_condition_timeout}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2">
                            <p className="border-r p-2">type</p>
                            <p className="p-2">{methods[methodKey].type}</p>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};
