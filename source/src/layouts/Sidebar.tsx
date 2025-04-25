import { ChevronLeftCircleIcon, ChevronRightCircleIcon, KeyRound, ChevronLeft } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AdminCryptoStoreResources } from "@/components/widgets/shared";
import { useTheme } from "@/components/providers";
import { usePermissions, useResourceDefinitions, useTranslate } from "react-admin";
import { createElement, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useGetResLabel } from "@/hooks/useGetResLabel";
import { Button } from "@/components/ui/Button";
import { useMediaQuery } from "react-responsive";
import clsx from "clsx";
import { AdminCallbridgeResources } from "@/components/widgets/shared/AdminCallbridgeResources";

const WALLET_ENABLED = import.meta.env.VITE_WALLET_ENABLED === "true" ? true : false;
const CALLBRIDGE_ENABLED = import.meta.env.VITE_CALLBRIDGE_ENABLED === "true" ? true : false;

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
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

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
                isSheetOpen && !isMobile
                    ? "flex h-full w-[280px] flex-shrink-0 flex-col items-stretch justify-start overflow-y-auto overflow-x-hidden bg-header pt-6 transition-[width]"
                    : "flex h-full w-[72px] flex-shrink-0 flex-col items-stretch justify-start overflow-y-auto overflow-x-hidden bg-header pt-6 transition-[width]"
            }>
            {!isMobile && (
                <>
                    {isSheetOpen ? (
                        <div className="flex h-[63px] flex-shrink-0 items-center justify-center gap-6 px-6">
                            <div className="m-0 flex w-[189px] items-center p-0">
                                <div className="transition-opacity duration-700 animate-in fade-in-0">
                                    <img
                                        src={theme === "light" ? "/NoNameLogoLight.svg" : "/NoNameLogo.svg"}
                                        alt="Logo"
                                        className="pointer-events-none h-[55px] w-[89.51px] select-none"
                                    />
                                </div>
                            </div>
                            <button className="flex flex-col items-center transition-opacity duration-300 animate-in fade-in-0">
                                <ChevronLeftCircleIcon
                                    onClick={() => handleMenuState(!isSheetOpen)}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-green-50 transition-colors hover:text-green-60 dark:hover:text-white"
                                />
                            </button>
                        </div>
                    ) : (
                        <div className="flex w-[70px] justify-center">
                            <button className="h-[63px]">
                                <ChevronRightCircleIcon
                                    onClick={() => handleMenuState(!isSheetOpen)}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg border-none text-green-50 outline-none transition-colors hover:text-green-60 dark:hover:text-white"
                                />
                            </button>
                        </div>
                    )}
                </>
            )}

            <nav className={clsx("flex flex-col items-baseline gap-4 text-base", !isMobile && "mt-6")}>
                {Object.keys(resources).map(resource => {
                    if (!resource.includes("wallet") && !resource.includes("callbridge")) {
                        return (
                            <TooltipProvider key={resource} delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <NavLink
                                            to={`/${resource}`}
                                            className={
                                                resourceName[0] === resource
                                                    ? "flex w-full items-center gap-3 bg-neutral-20 py-2 pl-6 text-controlElements animate-in fade-in-0 dark:bg-black"
                                                    : "flex w-full items-center gap-3 py-2 pl-6 animate-in fade-in-0 hover:bg-neutral-20 hover:text-controlElements dark:hover:bg-black"
                                            }>
                                            {createElement(resources[resource].icon, {})}
                                            {showCaptions && !isMobile && (
                                                <span className="transition-opacity animate-in fade-in-0">
                                                    {getResLabel(resources[resource].name, permissions)}
                                                </span>
                                            )}
                                        </NavLink>
                                    </TooltipTrigger>

                                    <TooltipContent
                                        className={
                                            showCaptions && !isMobile
                                                ? "hidden"
                                                : "after:absolute after:-left-[3.5px] after:top-[12.5px] after:h-2 after:w-2 after:rotate-45 after:bg-neutral-0 dark:after:bg-neutral-100"
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
                {permissions === "admin" && CALLBRIDGE_ENABLED && (
                    <AdminCallbridgeResources showCaptions={showCaptions && !isMobile} />
                )}
                {WALLET_ENABLED && <AdminCryptoStoreResources showCaptions={showCaptions && !isMobile} />}
            </nav>

            {permissions === "admin" && (
                <div className="mb-6 ml-[18px] mr-[10px] mt-4 flex flex-grow items-end">
                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className={
                                        showCaptions && !isMobile ? "flex w-full gap-[4px] pl-6 text-title-1" : "p-2.5"
                                    }
                                    onClick={() => {
                                        setTestKeysModalOpen(true);
                                    }}>
                                    <KeyRound className="h-[16px] w-[16px] text-white" />
                                    {showCaptions && !isMobile ? (
                                        <span className="m-0 p-0 text-white transition-opacity animate-in fade-in-0">
                                            {translate("resources.provider.createTestKeys")}
                                        </span>
                                    ) : null}
                                </Button>
                            </TooltipTrigger>

                            <TooltipContent
                                className={
                                    showCaptions && !isMobile
                                        ? "hidden"
                                        : "after:absolute after:-left-[3.5px] after:top-[12.5px] after:h-2 after:w-2 after:rotate-45 after:bg-neutral-0"
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
