import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { BanknoteIcon, ChevronDown, ChevronLeft, FileTerminal, HandCoins, Landmark, Pickaxe } from "lucide-react";
import { useState } from "react";

import { useTranslate } from "react-admin";
import { NavLink, useLocation } from "react-router-dom";
import SystemToolsIcon from "@/lib/icons/System_tools.svg?react";
import TerminalIntegrationsIcon from "@/lib/icons/integrations.svg?react";

interface ICustomViewRoute {
    name: string;
    icon: React.ReactNode;
    childrens: {
        name: string;
        path: string;
        icon: React.ReactNode;
    }[];
}

export const AdminPaymentToolResources = ({ showCaptions }: { showCaptions: boolean }) => {
    const translate = useTranslate();
    const location = useLocation();

    const [openAccordion, setOpenAccordion] = useState(true);

    const customViewRoutes: ICustomViewRoute = {
        name: "paymentTools",
        icon: <Pickaxe />,
        childrens: [
            {
                name: "currency",
                path: "/paymentTools/currency",
                icon: <BanknoteIcon />
            },
            {
                name: "paymentType",
                path: "/paymentTools/paymentType",
                icon: <HandCoins />
            },
            {
                name: "financialInstitution",
                path: "/paymentTools/financialInstitution",
                icon: <Landmark />
            },
            {
                name: "systemPaymentInstruments",
                path: "/paymentTools/systemPaymentInstruments",
                icon: <SystemToolsIcon className="stroke-current" />
            },
            {
                name: "terminalPaymentInstruments",
                path: "/paymentTools/terminalPaymentInstruments",
                icon: <TerminalIntegrationsIcon className="stroke-current" />
                // icon: <SystemToolsIcon className="stroke-white" />
            }
        ]
    };

    return (
        <div className="flex w-full flex-col gap-4">
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={() => setOpenAccordion(!openAccordion)}
                            className={`pointer flex w-full items-center justify-between pl-6 text-left transition-colors duration-150 animate-in fade-in-0 hover:bg-neutral-20 hover:text-controlElements dark:hover:bg-black [&:hover>svg>path]:stroke-controlElements [&>svg>path]:transition-all ${
                                showCaptions ? "gap-3" : ""
                            }`}>
                            <div className={cn("flex items-center", showCaptions ? "gap-3" : "")}>
                                {customViewRoutes?.icon}

                                {showCaptions && (
                                    <span className="m-0 p-0 leading-[22px] transition-opacity animate-in fade-in-0">
                                        {translate(`resources.${customViewRoutes?.name}.name`)}
                                    </span>
                                )}
                            </div>

                            <ChevronDown
                                className={`transition-transform ${openAccordion ? "rotate-180" : ""} ${
                                    showCaptions ? "mr-6 w-full max-w-6" : ""
                                }`}
                            />
                        </button>
                    </TooltipTrigger>

                    <TooltipContent
                        className={
                            showCaptions
                                ? "hidden"
                                : "after:absolute after:-left-[3.5px] after:top-[12.5px] after:h-2 after:w-2 after:rotate-45 after:bg-neutral-100"
                        }
                        sideOffset={12}
                        side="right">
                        {translate(`resources.${customViewRoutes?.name}.name`)}
                        <ChevronLeft
                            className="absolute -left-[13px] top-1.5 text-controlElements"
                            width={20}
                            height={20}
                        />
                    </TooltipContent>
                </Tooltip>

                {openAccordion && (
                    <div
                        className={`mr-[1px] flex flex-col gap-4 bg-green-0 py-1 pl-6 dark:bg-muted ${
                            showCaptions ? "pl-4" : "-ml-6 pl-4"
                        }`}>
                        {customViewRoutes?.childrens.map((customRoute, index) => (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                    <NavLink
                                        to={customRoute.path}
                                        className={cn(
                                            "flex items-center gap-3 py-2 pl-4 text-black transition-colors duration-150 animate-in fade-in-0",
                                            showCaptions ? "" : "ml-2",
                                            location.pathname === customRoute.path
                                                ? "text-controlElements dark:bg-muted [&>svg>path]:stroke-controlElements [&>svg>path]:transition-all dark:[&>svg>path]:stroke-controlElements"
                                                : "text-black hover:text-controlElements dark:text-neutral-0 dark:hover:bg-muted dark:hover:text-controlElements [&:hover>svg>path]:stroke-controlElements dark:[&:hover>svg>path]:stroke-controlElements [&>svg>path]:stroke-neutral-90 [&>svg>path]:transition-all dark:[&>svg>path]:stroke-neutral-0"
                                        )}>
                                        {customRoute.icon}

                                        {showCaptions && (
                                            <span className="m-0 p-0 leading-[22px] transition-opacity animate-in fade-in-0">
                                                {translate(
                                                    `resources.${customViewRoutes.name}.${customRoute.name}.name`
                                                )}
                                            </span>
                                        )}
                                    </NavLink>
                                </TooltipTrigger>

                                <TooltipContent
                                    className={
                                        showCaptions
                                            ? "hidden"
                                            : "after:absolute after:-left-[3.5px] after:top-[12.5px] after:h-2 after:w-2 after:rotate-45 after:bg-neutral-0 dark:after:bg-neutral-100"
                                    }
                                    sideOffset={12}
                                    side="right">
                                    {translate(`resources.${customViewRoutes.name}.${customRoute.name}.name`)}
                                    <ChevronLeft
                                        className="absolute -left-[13px] top-1.5 text-green-40"
                                        width={20}
                                        height={20}
                                    />
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                )}
            </TooltipProvider>
        </div>
    );
};
