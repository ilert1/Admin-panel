import { ChevronLeftCircleIcon, ChevronRightCircleIcon, KeyRound, ChevronLeft } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AdminCryptoStoreResources } from "@/components/widgets/shared";
import { useTheme } from "@/components/providers";
import { usePermissions, useResourceDefinitions, useTranslate } from "react-admin";
import { createElement, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useGetResLabel } from "@/hooks/useGetResLabel";
import { Button } from "@/components/ui/button";

const WALLET_ENABLED = import.meta.env.VITE_WALLET_ENABLED === "true" ? true : false;

export interface SidebarProps {
    resourceName: string[];
    setTestKeysModalOpen: (state: boolean) => void;
}

export const Sidebar = (props: SidebarProps) => {
    const { resourceName, setTestKeysModalOpen } = props;

    const resources = useResourceDefinitions();
    const { theme } = useTheme();
    const translate = useTranslate();
    const getResLabel = useGetResLabel();
    const { permissions } = usePermissions();

    const menuOpenState = localStorage.getItem("menuOpenState") === "false" ? false : true;

    const [isSheetOpen, setSheetOpen] = useState(menuOpenState);
    const [showCaptions, setShowCaptions] = useState(true);

    const handleMenuState = (state: boolean) => {
        setSheetOpen(state);
        localStorage.setItem("menuOpenState", String(state));
    };

    useEffect(() => {
        isSheetOpen
            ? setTimeout(() => {
                  setShowCaptions(isSheetOpen);
              }, 150)
            : setShowCaptions(isSheetOpen);
    }, [isSheetOpen]);

    return (
        <aside
            className={
                isSheetOpen
                    ? "w-[280px] h-full flex flex-col items-stretch flex-shrink-0 overflow-y-auto overflow-x-hidden justify-start bg-header transition-[width] pt-6"
                    : "w-[72px] h-full flex flex-col items-stretch flex-shrink-0 overflow-y-auto overflow-x-hidden justify-start bg-header transition-[width] pt-6"
            }>
            {isSheetOpen ? (
                <div className="flex flex-shrink-0 justify-center items-center h-[63px] gap-6 px-6">
                    <div className="flex items-center w-[189px] m-0 p-0">
                        <div className="animate-in fade-in-0 transition-opacity duration-700">
                            <img
                                src={theme === "light" ? "/NoNameLogoLight.svg" : "/NoNameLogo.svg"}
                                alt="Logo"
                                className="h-[55px] w-[89.51px] pointer-events-none select-none"
                            />
                        </div>
                    </div>
                    <button className="flex flex-col items-center animate-in fade-in-0 transition-opacity duration-300">
                        <ChevronLeftCircleIcon
                            onClick={() => handleMenuState(!isSheetOpen)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-green-50 transition-colors hover:text-green-60 dark:hover:text-white"
                        />
                    </button>
                </div>
            ) : (
                <div className="w-[70px] flex justify-center">
                    <button className="h-[63px] ">
                        <ChevronRightCircleIcon
                            onClick={() => handleMenuState(!isSheetOpen)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-green-50 transition-colors hover:text-green-60 dark:hover:text-white border-none outline-none"
                        />
                    </button>
                </div>
            )}

            <nav className="flex flex-col items-baseline text-base gap-4 mt-6">
                {Object.keys(resources).map(resource => {
                    if (!resource.includes("wallet")) {
                        return (
                            <TooltipProvider key={resource} delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <NavLink
                                            to={`/${resource}`}
                                            className={
                                                resourceName[0] === resource
                                                    ? " pl-6 bg-neutral-20 dark:bg-black w-full flex items-center gap-3 text-controlElements animate-in fade-in-0 transition-colors duration-150 py-2"
                                                    : "pl-6 flex items-center gap-3 hover:bg-neutral-20 dark:hover:bg-black w-full hover:text-controlElements animate-in fade-in-0 transition-colors duration-150 py-2"
                                            }>
                                            {createElement(resources[resource].icon, {})}
                                            {showCaptions && (
                                                <span className="animate-in fade-in-0 transition-opacity">
                                                    {getResLabel(resources[resource].name, permissions)}
                                                </span>
                                            )}
                                        </NavLink>
                                    </TooltipTrigger>

                                    <TooltipContent
                                        className={
                                            showCaptions
                                                ? "hidden"
                                                : "after:absolute after:-left-[3.5px] after:top-[12.5px] after:w-2 after:h-2 after:bg-neutral-0 after:rotate-45"
                                        }
                                        sideOffset={12}
                                        side="right">
                                        {getResLabel(resources[resource].name, permissions)}
                                        <ChevronLeft
                                            className="absolute -left-[13px] top-1.5 text-green-40"
                                            width={20}
                                            height={20}
                                        />
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        );
                    }
                })}
                {WALLET_ENABLED && <AdminCryptoStoreResources showCaptions={showCaptions} />}
            </nav>

            {permissions === "admin" && (
                <div className="flex flex-grow items-end ml-[18px] mr-[10px] mb-6 mt-4">
                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className={showCaptions ? "w-full pl-6 flex gap-[4px] text-title-1" : "p-2.5"}
                                    onClick={() => {
                                        setTestKeysModalOpen(true);
                                    }}>
                                    <KeyRound className="text-white w-[16px] h-[16px]" />
                                    {showCaptions ? (
                                        <span className="animate-in fade-in-0 text-white transition-opacity p-0 m-0">
                                            {translate("resources.provider.createTestKeys")}
                                        </span>
                                    ) : null}
                                </Button>
                            </TooltipTrigger>

                            <TooltipContent
                                className={
                                    showCaptions
                                        ? "hidden"
                                        : "after:absolute after:-left-[3.5px] after:top-[12.5px] after:w-2 after:h-2 after:bg-neutral-0 after:rotate-45"
                                }
                                side="right"
                                sideOffset={12}>
                                {translate("resources.provider.createTestKeys")}
                                <ChevronLeft
                                    className="absolute -left-[13px] top-1.5 text-green-40"
                                    width={20}
                                    height={20}
                                />
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            )}
        </aside>
    );
};
