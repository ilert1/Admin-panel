import { Button } from "@/components/ui/Button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCopy } from "@/hooks/useCopy";
import { Copy, EyeIcon } from "lucide-react";
import { useTranslate } from "react-admin";

interface ProviderMethodsShowButtonsGroupProps {
    stringifiedData: string;
    onOpenChange: (state: boolean) => void;
}

export const ProviderMethodsShowButtonsGroup = (props: ProviderMethodsShowButtonsGroupProps) => {
    const { stringifiedData, onOpenChange } = props;
    const translate = useTranslate();
    const { copy } = useCopy();

    return (
        <TooltipProvider>
            <div className="flex flex-wrap">
                <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                        <Button
                            role="tooltip"
                            variant="text_btn"
                            className="flex flex-col py-6"
                            onClick={() => copy(stringifiedData)}>
                            <Copy className="min-h-5 min-w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{translate("resources.provider.settings.copyJson")}</TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                        <Button onClick={() => onOpenChange(true)} variant="text_btn" className="flex flex-col py-6">
                            <EyeIcon className="min-h-5 min-w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{translate("resources.provider.settings.copyJson")}</TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    );
};
