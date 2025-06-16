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
import {
    ChevronDown,
    ChevronLeft,
    // Circle,
    CirclePlus,
    LockKeyhole,
    LockKeyholeOpen,
    Vault,
    WalletCards
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDataProvider, usePermissions, useTranslate } from "react-admin";
import { NavLink, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CRYPTO_STORE_OPEN } from "@/helpers/localStorage";

interface ICustomViewRoute {
    name: string;
    icon: React.ReactNode;
    childrens: {
        name: string;
        path: string;
        icon: React.ReactNode;
        showLock: boolean;
    }[];
}

export const AdminCryptoStoreResources = ({ showCaptions }: { showCaptions: boolean }) => {
    const translate = useTranslate();
    const dataProvider = useDataProvider<VaultDataProvider>();
    const location = useLocation();
    const { permissions } = usePermissions();

    const [openAccordion, setOpenAccordion] = useState(
        localStorage.getItem(CRYPTO_STORE_OPEN) === "true" ? true : false
    );

    const { data: storageState, isLoading: storageStateLoading } = useQuery({
        queryKey: ["walletStorage"],
        queryFn: ({ signal }) => dataProvider.getVaultState("vault", signal),
        enabled: permissions === "admin"
    });

    const [customViewRoutes, setCustomViewRoutes] = useState<ICustomViewRoute>({
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
    });

    useEffect(() => {
        if (permissions === "admin") {
            setCustomViewRoutes({
                name: "wallet",
                icon: <BitcoinWalletIcon />,
                childrens: [
                    {
                        name: "storage",
                        path: "/wallet/storage",
                        icon: <Vault />,
                        showLock: true
                    },
                    {
                        name: "manage",
                        path: "/wallet",
                        icon: <DoubleWalletsIcon />,
                        showLock: false
                    },
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
                ]
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const CurrentStateIcon = (className?: string) => {
        if (storageStateLoading) {
            return <LoadingBalance className="ml-auto mr-5 h-6 w-6" />;
        }

        if (!storageState?.initiated) {
            return (
                <CirclePlus
                    className={cn(
                        showCaptions
                            ? "ml-auto mr-5 w-full max-w-6 text-controlElements [&>path]:!stroke-controlElements"
                            : "text-controlElements [&>path]:!stroke-controlElements",
                        className
                    )}
                />
            );
        } else if (storageState?.state === "sealed" && storageState?.initiated) {
            return (
                <LockKeyhole
                    className={cn(
                        showCaptions
                            ? "ml-auto mr-5 w-full max-w-6 text-controlElements [&>path]:!stroke-controlElements"
                            : "text-controlElements [&>path]:!stroke-controlElements",
                        className
                    )}
                />
            );
        } else if (storageState?.state === "unsealed" && storageState?.initiated) {
            return (
                <LockKeyholeOpen
                    className={cn(
                        showCaptions
                            ? "ml-auto mr-5 w-full max-w-6 text-red-40 [&>path]:!stroke-red-40"
                            : "text-red-40 [&>path]:!stroke-red-40",
                        className
                    )}
                />
            );
        } else if (storageState?.state === "waiting" && storageState?.initiated) {
            return (
                <RearLockKeyhole
                    className={cn(
                        showCaptions
                            ? "ml-auto mr-5 w-full max-w-6 text-yellow-40 [&>path]:!stroke-yellow-40"
                            : "text-yellow-40 [&>path]:!stroke-yellow-40",
                        className
                    )}
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
                            onClick={() => {
                                localStorage.setItem(CRYPTO_STORE_OPEN, String(!openAccordion));
                                setOpenAccordion(!openAccordion);
                            }}
                            className={`pointer flex items-center pl-6 text-left transition-colors duration-150 animate-in fade-in-0 hover:bg-neutral-20 hover:text-controlElements dark:hover:bg-black [&:hover>svg>path]:stroke-controlElements [&>svg>path]:transition-all ${
                                showCaptions ? "gap-3" : ""
                            }`}>
                            {customViewRoutes?.icon}

                            {showCaptions && (
                                <span className="m-0 p-0 leading-[22px] transition-opacity animate-in fade-in-0">
                                    {translate(`resources.${customViewRoutes?.name}.name`)}
                                </span>
                            )}
                            {showCaptions &&
                                // <Circle
                                //     className={cn("stroke-transparent", {
                                //         "fill-neutral-50": !storageState?.initiated,
                                //         "fill-yellow-40": storageState?.state === "waiting" && storageState?.initiated,
                                //         "fill-green-50": storageState?.state === "sealed" && storageState?.initiated,
                                //         "fill-red-40": storageState?.state === "unsealed" && storageState?.initiated
                                //     })}
                                // />
                                CurrentStateIcon("w-5 h-5 mr-0")}
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
                                            "flex items-center gap-3 py-2 pl-4 leading-normal transition-colors duration-150 animate-in fade-in-0",
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

                                        {customRoute.showLock && permissions === "admin" && CurrentStateIcon()}
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
