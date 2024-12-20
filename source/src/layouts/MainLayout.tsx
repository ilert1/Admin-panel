import { CoreLayoutProps, useLogout, usePermissions, useResourceDefinitions, useTranslate } from "react-admin";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useMemo, createElement, useState, useEffect } from "react";
import { ChevronLeftCircleIcon, ChevronRightCircleIcon, KeyRound, ChevronLeft } from "lucide-react";
// import Logo from "@/lib/icons/Logo";
import { Button } from "@/components/ui/button";
import { useGetResLabel } from "@/hooks/useGetResLabel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { KeysModal } from "@/components/widgets/components/KeysModal";
import { Header } from "@/components/widgets/shared/Header";
import { AdminCryptoStoreResources } from "@/components/widgets/shared";
import { useTheme } from "@/components/providers";

enum SplitLocations {
    show = "show",
    edit = "edit",
    new = "new"
}

const WALLET_ENABLED = import.meta.env.VITE_WALLET_ENABLED === "true" ? true : false;

export const MainLayout = ({ children }: CoreLayoutProps) => {
    const resources = useResourceDefinitions();
    const getResLabel = useGetResLabel();
    const translate = useTranslate();
    const { permissions } = usePermissions();
    const location = useLocation();
    const { theme } = useTheme();

    const resourceName = useMemo(() => {
        const urlParts = location.pathname?.split("/")?.filter((s: string) => s?.length > 0);

        Object.values(SplitLocations).forEach(item => {
            if (urlParts.includes(item)) {
                const tempResource = urlParts.splice(urlParts.indexOf(item) - 1, 2);
                urlParts.push(tempResource.join("/"));
            }
        });

        const isWrongResource =
            Object.keys(resources).length !==
            new Set([...Object.keys(resources), urlParts[0] !== "" && urlParts[0]]).size;

        return isWrongResource ? ["error"] : urlParts;
    }, [location, resources]);

    const pageTitle = useMemo(() => {
        if (resourceName.length > 0) {
            if (resourceName[0] === "wallet") {
                if (resourceName[1]) {
                    return getResLabel(`wallet.${resourceName[1]}`, permissions);
                } else {
                    return getResLabel(`wallet.manage`, permissions);
                }
            }

            return getResLabel(resourceName[0], permissions);
        }
    }, [getResLabel, permissions, resourceName]);

    const logout = useLogout();
    const handleLogout = () => {
        location.pathname = "/";
        logout();
    };
    const menuOpenState = localStorage.getItem("menuOpenState") === "false" ? false : true;
    const [isSheetOpen, setSheetOpen] = useState(menuOpenState);
    const [showCaptions, setShowCaptions] = useState(true);
    const [testKeysModalOpen, setTestKeysModalOpen] = useState(false);

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
        <div className="flex flex-col h-screen">
            <Header handleLogout={handleLogout} />
            <div className="flex grow h-full overflow-hidden">
                <aside
                    className={
                        isSheetOpen
                            ? "w-[280px] h-full flex flex-col items-stretch flex-shrink-0 overflow-y-auto overflow-x-hidden scrollbar-stable justify-start bg-header transition-[width] pt-6"
                            : "w-[72px] h-full flex flex-col items-stretch flex-shrink-0 overflow-y-auto overflow-x-hidden scrollbar-stable justify-start bg-header transition-[width] pt-6"
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
                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-green-50 transition-colors hover:text-foreground"
                                />
                            </button>
                        </div>
                    ) : (
                        <div className="w-[70px] flex justify-center">
                            <button className="h-[63px] ">
                                <ChevronRightCircleIcon
                                    onClick={() => handleMenuState(!isSheetOpen)}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-green-50 transition-colors hover:text-foreground"
                                />
                            </button>
                        </div>
                    )}

                    <nav className="flex flex-col items-baseline text-base gap-4 mt-6 pl-6">
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
                                                            ? "bg-neutral-20 dark:bg-black w-full flex items-center gap-3 text-controlElements animate-in fade-in-0 transition-colors duration-150 py-2"
                                                            : "flex items-center gap-3 hover:bg-neutral-20 dark:hover:bg-black w-full hover:text-controlElements animate-in fade-in-0 transition-colors duration-150 py-2"
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
                                            className={
                                                showCaptions ? "w-full pl-6 flex gap-[4px] text-title-1" : "p-2.5"
                                            }
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

                <div className="bg-neutral-20 dark:bg-muted grow overflow-y-auto scrollbar-stable transition-[margin-left] relative">
                    <main className={`p-6 pr-4 container ${resourceName[0] == "error" ? "h-full" : ""}`}>
                        {resourceName[0] !== "bank-transfer" && resourceName[0] !== "error" && (
                            <h1 className="text-3xl mb-6">{pageTitle}</h1>
                        )}
                        {children}
                    </main>
                </div>
            </div>

            <KeysModal open={testKeysModalOpen} onOpenChange={setTestKeysModalOpen} isTest />
        </div>
    );
};
