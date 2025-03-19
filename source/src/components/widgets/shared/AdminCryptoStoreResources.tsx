import { LoadingBalance } from "@/components/ui/loading";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { VaultDataProvider } from "@/data";
import {
    BitcoinWalletIcon,
    DoubleWalletsIcon,
    RearLockKeyhole,
    WalletLinkedTransactionsIcon
} from "@/lib/icons/WalletStore";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronLeft, CirclePlus, LockKeyhole, LockKeyholeOpen, Vault, WalletCards } from "lucide-react";
import { useState } from "react";
import { useDataProvider, usePermissions, useTranslate } from "react-admin";
import { useQuery } from "@tanstack/react-query";
import { NavLink, useLocation } from "react-router-dom";

export const AdminCryptoStoreResources = ({ showCaptions }: { showCaptions: boolean }) => {
    const translate = useTranslate();
    const dataProvider = useDataProvider<VaultDataProvider>();
    const location = useLocation();
    const { permissions } = usePermissions();

    const [openAccordion, setOpenAccordion] = useState(true);
    const { data: storageState, isLoading: storageStateLoading } = useQuery({
        queryKey: ["walletStorage"],
        queryFn: ({ signal }) => dataProvider.getVaultState("vault", signal),
        enabled: permissions === "admin"
    });

    const customViewRoutes = {
        name: "wallet",
        icon: <BitcoinWalletIcon />,
        childrens: [
            {
                name: "manage",
                path: "/wallet",
                icon: <DoubleWalletsIcon />,
                showLock: false
            }
        ]
    };

    if (permissions === "admin") {
        customViewRoutes.childrens = [
            {
                name: "storage",
                path: "/wallet/storage",
                icon: <Vault />,
                showLock: true
            },
            ...customViewRoutes.childrens,
            {
                name: "transactions",
                path: "/wallet/transactions",
                icon: <WalletCards />,
                showLock: false
            },
            {
                name: "linkedTransactions",
                path: "/wallet/linkedTransactions",
                icon: <WalletLinkedTransactionsIcon />,
                showLock: false
            }
        ];
    }

    const CurrentStateIcon = () => {
        if (storageStateLoading) {
            return <LoadingBalance className="ml-auto mr-5 h-6 w-6" />;
        }

        if (!storageState?.initiated) {
            return (
                <CirclePlus
                    className={
                        showCaptions
                            ? "ml-auto mr-5 w-full max-w-6 text-controlElements [&>path]:!stroke-controlElements"
                            : "text-controlElements [&>path]:!stroke-controlElements"
                    }
                />
            );
        } else if (storageState?.state === "sealed" && storageState?.initiated) {
            return (
                <LockKeyhole
                    className={
                        showCaptions
                            ? "ml-auto mr-5 w-full max-w-6 text-controlElements [&>path]:!stroke-controlElements"
                            : "text-controlElements [&>path]:!stroke-controlElements"
                    }
                />
            );
        } else if (storageState?.state === "unsealed" && storageState?.initiated) {
            return (
                <LockKeyholeOpen
                    className={
                        showCaptions
                            ? "ml-auto mr-5 w-full max-w-6 text-red-40 [&>path]:!stroke-red-40"
                            : "text-red-40 [&>path]:!stroke-red-40"
                    }
                />
            );
        } else if (storageState?.state === "waiting" && storageState?.initiated) {
            return (
                <RearLockKeyhole
                    className={
                        showCaptions
                            ? "ml-auto mr-5 w-full max-w-6 text-yellow-40 [&>path]:!stroke-yellow-40"
                            : "text-yellow-40 [&>path]:!stroke-yellow-40"
                    }
                />
            );
        }
    };
    return (
        <div className="flex flex-col gap-4">
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={() => setOpenAccordion(!openAccordion)}
                            className={`pointer flex items-center pl-6 text-left transition-colors duration-150 animate-in fade-in-0 hover:bg-neutral-20 hover:text-controlElements dark:hover:bg-black [&:hover>svg>path]:stroke-controlElements [&>svg>path]:transition-all ${
                                showCaptions ? "gap-3" : ""
                            }`}>
                            {customViewRoutes.icon}

                            {showCaptions && (
                                <span className="m-0 p-0 leading-[22px] transition-opacity animate-in fade-in-0">
                                    {translate(`resources.${customViewRoutes.name}.name`)}
                                </span>
                            )}

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
                        {translate(`resources.${customViewRoutes.name}.name`)}
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
                        {customViewRoutes.childrens.map((customRoute, index) => (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                    {/* className={cn(
                                            "pl-4 flex items-center gap-3 animate-in fade-in-0 transition-colors duration-150 py-2 dark:text-neutral-0",
                                            showCaptions ? "" : "ml-2",
                                            location.pathname === customRoute.path
                                                ? "dark:bg-muted [&>span]:text-green-40 dark:[&:hover>svg>path]:stroke-green-50 [&>svg>path]:stroke-red-40 [&>svg>path]:transition-all"
                                                : "dark:hover:bg-muted hover:text-controlElements [&:hover>svg>path]:stroke-green-50 dark:[&:hover>svg>path]:stroke-green-40 [&>svg>path]:transition-all text-neutral-90"
                                        )}> */}

                                    <NavLink
                                        to={customRoute.path}
                                        className={cn(
                                            "flex items-center gap-3 py-2 pl-4 transition-colors duration-150 animate-in fade-in-0",
                                            showCaptions ? "" : "ml-2",
                                            location.pathname === customRoute.path
                                                ? "text-controlElements dark:bg-muted [&>svg>path]:stroke-controlElements [&>svg>path]:transition-all dark:[&>svg>path]:stroke-controlElements"
                                                : "text-neutral-90 hover:text-controlElements dark:text-neutral-0 dark:hover:bg-muted dark:hover:text-controlElements [&:hover>svg>path]:stroke-controlElements dark:[&:hover>svg>path]:stroke-controlElements [&>svg>path]:stroke-neutral-90 [&>svg>path]:transition-all dark:[&>svg>path]:stroke-neutral-0"
                                        )}>
                                        {(!customRoute.showLock || (customRoute.showLock && showCaptions)) &&
                                            customRoute.icon}

                                        {showCaptions && (
                                            <span className="m-0 p-0 leading-[22px] transition-opacity animate-in fade-in-0">
                                                {translate(`resources.wallet.${customRoute.name}.name`)}
                                            </span>
                                        )}

                                        {customRoute.showLock && permissions === "admin" && <CurrentStateIcon />}
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
                                    {translate(`resources.wallet.${customRoute.name}.name`)}
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
