import { Button } from "@/components/ui/Button";
import TelegramIcon from "@/lib/icons/providerLinks/telegram.svg?react";
import GrafanaIcon from "@/lib/icons/providerLinks/grafana.svg?react";
import { ProviderBaseInfo } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AlarmClock, FileText, NetworkIcon } from "lucide-react";
import { useTranslate } from "react-admin";

interface IconsListProps {
    info: ProviderBaseInfo | undefined;
}

interface ListDataType {
    icon: React.ReactNode;
    contentText: string;
    disabled: boolean;
    linkTo?: string;
}

export const IconsList = (props: IconsListProps) => {
    const { info } = props;
    const translate = useTranslate();

    const listData: ListDataType[] = [
        {
            icon: <TelegramIcon className="h-4 w-4" />,
            contentText: translate("resources.provider.settings.telegram_chat"),
            disabled: !info?.telegram_chat,
            linkTo: info?.telegram_chat as string
        },
        {
            icon: <GrafanaIcon className="h-4 w-4" />,
            contentText: translate("resources.provider.settings.grafana_link"),
            disabled: !info?.grafana_link,
            linkTo: info?.grafana_link as string
        },
        {
            icon: <AlarmClock className="h-4 w-4" />,
            contentText: translate("resources.provider.settings.temporal_link"),
            disabled: !info?.temporal_link,
            linkTo: info?.temporal_link as string
        },
        {
            icon: <NetworkIcon className="h-4 w-4" />,
            contentText: translate("resources.provider.settings.provider_docs"),
            disabled: !info?.provider_docs,
            linkTo: info?.provider_docs as string
        },
        {
            icon: <FileText className="h-4 w-4" />,
            contentText: translate("resources.provider.settings.wiki_link"),
            disabled: !info?.wiki_link,
            linkTo: info?.wiki_link as string
        }
    ];

    return (
        <>
            <TooltipProvider>
                <div className="flex h-10 flex-wrap gap-2">
                    {listData.map((item, index) => (
                        <Tooltip delayDuration={100} key={index}>
                            <TooltipTrigger role="tooltip" asChild className="h-auto">
                                <Button
                                    onClick={() => window.open(item.linkTo, "_blank")}
                                    className="px-3"
                                    variant={"outline_gray"}
                                    disabled={item.disabled}>
                                    {item.icon}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent tabIndex={-1} sideOffset={5} align="center">
                                <p>{item.contentText}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
            </TooltipProvider>
        </>
    );
};
