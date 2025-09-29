import { Button } from "@/components/ui/Button";
import TelegramIcon from "@/lib/icons/providerLinks/telegram.svg?react";
import GrafanaIcon from "@/lib/icons/providerLinks/grafana.svg?react";
import TemporalIcon from "@/lib/icons/providerLinks/temporal.svg?react";
import { ProviderBaseInfo } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FileText, NetworkIcon } from "lucide-react";
import { useTranslate } from "react-admin";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface IconsListProps {
    info: ProviderBaseInfo | undefined;
    iconsSmall?: boolean;
    border?: boolean;
    label?: boolean;
}

interface ListDataType {
    icon: React.ReactNode;
    contentText: string;
    disabled: boolean;
    linkTo?: string;
}

export const IconsList = (props: IconsListProps) => {
    const { info, iconsSmall = false, label = true, border = true } = props;
    const translate = useTranslate();
    const iconsSize = iconsSmall ? "h-4 w-4" : "h-5 w-5";
    const listData: ListDataType[] = [
        {
            icon: <TelegramIcon className={cn("fill-black dark:fill-white", iconsSize)} />,
            contentText: translate("resources.provider.settings.telegram_chat"),
            disabled: !info?.telegram_chat,
            linkTo: info?.telegram_chat as string
        },
        {
            icon: <GrafanaIcon className={iconsSize} />,
            contentText: translate("resources.provider.settings.grafana_link"),
            disabled: !info?.grafana_link,
            linkTo: info?.grafana_link as string
        },
        {
            icon: <TemporalIcon className={cn("fill-black dark:fill-white", iconsSize)} />,
            contentText: translate("resources.provider.settings.temporal_link"),
            disabled: !info?.temporal_link,
            linkTo: info?.temporal_link as string
        },
        {
            icon: (
                <NetworkIcon
                    className={cn(
                        iconsSize,
                        "stroke-green-50 hover:stroke-green-50 dark:stroke-green-40 dark:hover:stroke-green-40"
                    )}
                />
            ),
            contentText: translate("resources.provider.settings.provider_docs"),
            disabled: !info?.provider_docs,
            linkTo: info?.provider_docs as string
        },
        {
            icon: (
                <FileText
                    className={cn(
                        iconsSize,
                        "stroke-green-50 hover:stroke-green-50 dark:stroke-green-40 dark:hover:stroke-green-40"
                    )}
                />
            ),
            contentText: translate("resources.provider.settings.wiki_link"),
            disabled: !info?.wiki_link,
            linkTo: info?.wiki_link as string
        }
    ];

    const isThereAnyValue = listData.some(item => item.disabled === false);

    return (
        <>
            <TooltipProvider>
                <div className="flex flex-col">
                    {label && (
                        <Label className="text-sm dark:!text-neutral-60">
                            {translate("resources.provider.settings.links")}
                        </Label>
                    )}
                    <div className={cn("flex flex-wrap gap-3")}>
                        {isThereAnyValue
                            ? listData.map(
                                  (item, index) =>
                                      !item.disabled && (
                                          <Tooltip delayDuration={100} key={index}>
                                              <TooltipTrigger role="tooltip" asChild className="h-auto">
                                                  <Button
                                                      onClick={() => window.open(item.linkTo, "_blank")}
                                                      variant={border ? "resourceLink" : "outline_gray"}
                                                      disabled={item.disabled}>
                                                      {item.icon}
                                                  </Button>
                                              </TooltipTrigger>
                                              <TooltipContent tabIndex={-1} sideOffset={5} align="center">
                                                  <p>{item.contentText}</p>
                                              </TooltipContent>
                                          </Tooltip>
                                      )
                              )
                            : "-"}
                    </div>
                </div>
            </TooltipProvider>
        </>
    );
};
