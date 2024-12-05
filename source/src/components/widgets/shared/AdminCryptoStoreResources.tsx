import { LoadingBalance } from "@/components/ui/loading";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { VaultDataProvider } from "@/data";
import {
    BitcoinWalletIcon,
    DoubleWalletsIcon,
    RearLockKeyhole,
    WalletLinkedTransactionsIcon
} from "@/lib/icons/WalletStore";
import { ChevronDown, ChevronLeft, CirclePlus, LockKeyhole, LockKeyholeOpen, Vault, WalletCards } from "lucide-react";
import { useState } from "react";
import { useDataProvider, usePermissions, useTranslate } from "react-admin";
import { useQuery } from "react-query";
import { NavLink, useLocation } from "react-router-dom";

export const AdminCryptoStoreResources = ({ showCaptions }: { showCaptions: boolean }) => {
    const translate = useTranslate();
    const dataProvider = useDataProvider<VaultDataProvider>();
    const location = useLocation();
    const { permissions } = usePermissions();

    const [openAccordion, setOpenAccordion] = useState(true);
    const { data: storageState, isLoading: storageStateLoading } = useQuery(
        ["walletStorage"],
        () => dataProvider.getVaultState("vault"),
        {
            enabled: permissions === "admin"
        }
    );

    const customViewRoutes = {
        name: "wallet",
        icon: <BitcoinWalletIcon />,
        childrens: [
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
                name: "linkedTransactions",
                path: "/wallet/linkedTransactions",
                icon: <WalletLinkedTransactionsIcon />,
                showLock: false
            }
        ];
    }

    const CurrentStateIcon = () => {
        if (storageStateLoading) {
            return <LoadingBalance className="ml-auto mr-5 w-6 h-6" />;
        }

        if (!storageState?.initiated) {
            return (
                <CirclePlus
                    className={
                        showCaptions
                            ? "ml-auto w-full max-w-6 mr-5 text-green-40 [&>path]:!stroke-green-40"
                            : "text-green-40 [&>path]:!stroke-green-40"
                    }
                />
            );
        } else if (storageState?.state === "sealed" && storageState?.initiated) {
            return (
                <LockKeyhole
                    className={
                        showCaptions
                            ? "ml-auto w-full max-w-6 mr-5 text-green-40 [&>path]:!stroke-green-40"
                            : "text-green-40 [&>path]:!stroke-green-40"
                    }
                />
            );
        } else if (storageState?.state === "unsealed" && storageState?.initiated) {
            return (
                <LockKeyholeOpen
                    className={
                        showCaptions
                            ? "ml-auto w-full max-w-6 mr-5 text-red-40 [&>path]:!stroke-red-40"
                            : "text-red-40 [&>path]:!stroke-red-40"
                    }
                />
            );
        } else if (storageState?.state === "waiting" && storageState?.initiated) {
            return (
                <RearLockKeyhole
                    className={
                        showCaptions
                            ? "ml-auto w-full max-w-6 mr-5 text-yellow-40 [&>path]:!stroke-yellow-40"
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
                            className={`pointer text-left flex items-center hover:text-green-40 [&:hover>svg>path]:stroke-green-40 [&>svg>path]:transition-all animate-in fade-in-0 transition-colors duration-150 ${
                                showCaptions ? "gap-3" : ""
                            }`}>
                            {customViewRoutes.icon}

                            {showCaptions && (
                                <span className="animate-in fade-in-0 transition-opacity p-0 m-0 leading-[22px]">
                                    {translate(`resources.${customViewRoutes.name}.name`)}
                                </span>
                            )}

                            <ChevronDown
                                className={`transition-transform ${openAccordion ? "rotate-180" : ""} ${
                                    showCaptions ? "w-full max-w-6 mr-6" : ""
                                }`}
                            />
                        </button>
                    </TooltipTrigger>

                    <TooltipContent
                        className="after:absolute after:-left-[3.5px] after:top-[12.5px] after:w-2 after:h-2 after:bg-neutral-0 after:rotate-45"
                        sideOffset={12}
                        side="right">
                        {translate(`resources.${customViewRoutes.name}.name`)}
                        <ChevronLeft className="absolute -left-[13px] top-1.5 text-green-40" width={20} height={20} />
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            {openAccordion && (
                <div className={`flex flex-col gap-4 bg-muted py-1  mr-[1px] ${showCaptions ? "pl-4" : "-ml-6 pl-6"}`}>
                    {customViewRoutes.childrens.map((customRoute, index) => (
                        <NavLink
                            key={index}
                            to={customRoute.path}
                            className={
                                location.pathname === customRoute.path
                                    ? "flex items-center gap-3 text-green-40 animate-in fade-in-0 transition-colors duration-150 py-2 dark:[&>svg>path]:stroke-green-40 [&>svg>path]:stroke-green-40 [&>svg>path]:transition-all"
                                    : "flex items-center gap-3 hover:text-green-40 animate-in fade-in-0 transition-colors duration-150 py-2 [&:hover>svg>path]:stroke-green-40 [&>svg>path]:transition-all"
                            }>
                            {(!customRoute.showLock || (customRoute.showLock && showCaptions)) && customRoute.icon}

                            {showCaptions && (
                                <span className="animate-in fade-in-0 transition-opacity p-0 m-0 leading-[22px]">
                                    {translate(`resources.wallet.${customRoute.name}.name`)}
                                </span>
                            )}

                            {customRoute.showLock && permissions === "admin" && <CurrentStateIcon />}
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );
};
