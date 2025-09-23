import { Button } from "@/components/ui/Button";
import TelegramIcon from "@/lib/icons/providerLinks/telegram.svg?react";
import GrafanaIcon from "@/lib/icons/providerLinks/grafana.svg?react";
import { ProviderBaseInfo } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AlarmClock, FileText, NetworkIcon } from "lucide-react";

interface IconsListProps {
    info: ProviderBaseInfo | undefined;
}

export const IconsList = (props: IconsListProps) => {
    const { info } = props;

    return (
        <>
            <TooltipProvider>
                <div className="flex h-10 flex-wrap gap-2">
                    <Tooltip delayDuration={100}>
                        <TooltipTrigger role="tooltip" asChild className="h-auto">
                            <Button className="px-3" variant={"outline_gray"} disabled={!info?.telegram_chat}>
                                <TelegramIcon className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent tabIndex={-1} sideOffset={5} align="center">
                            <p>Telegram</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip delayDuration={100}>
                        <TooltipTrigger role="tooltip" asChild className="h-auto">
                            <Button className="px-3" variant={"outline_gray"} disabled={!info?.grafana_link}>
                                <GrafanaIcon className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent tabIndex={-1} sideOffset={5} align="center">
                            <p>Grafana</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip delayDuration={100}>
                        <TooltipTrigger role="tooltip" asChild className="h-auto">
                            <Button className="px-3" variant={"outline_gray"} disabled={!info?.temporal_link}>
                                <NetworkIcon className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent tabIndex={-1} sideOffset={5} align="center">
                            <p>Provider link</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip delayDuration={100}>
                        <TooltipTrigger role="tooltip" asChild className="h-auto">
                            <Button className="px-3" variant={"outline_gray"} disabled={!info?.provider_environment}>
                                <AlarmClock className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent tabIndex={-1} sideOffset={5} align="center">
                            <p>Teporal link</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip delayDuration={100}>
                        <TooltipTrigger role="tooltip" asChild className="h-auto">
                            <Button className="px-3" variant={"outline_gray"} disabled={!info?.provider_docs}>
                                <FileText />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent tabIndex={-1} sideOffset={5} align="center">
                            <p>Wiki</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
        </>
    );
};
