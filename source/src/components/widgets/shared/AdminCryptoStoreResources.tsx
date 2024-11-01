import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BitcoinWalletIcon, DoubleWalletsIcon, RearLockKeyhole } from "@/lib/icons/WalletStore";
import { ChevronDown, ChevronLeft, LockKeyhole, LockKeyholeOpen, Vault, WalletCards } from "lucide-react";
import { useState } from "react";
import { useTranslate } from "react-admin";
import { useQuery } from "react-query";
import { NavLink, useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_WALLET_URL;

export const AdminCryptoStoreResources = ({ showCaptions }: { showCaptions: boolean }) => {
    const translate = useTranslate();
    const location = useLocation();
    const [openAccordion, setOpenAccordion] = useState(true);

    const { data: storageState } = useQuery<WalletStorage | undefined>("walletStorage", () =>
        fetch(`${API_URL}/vault/state`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        })
            .then(response => response.json())
            .then(data => data.data)
    );

    const customViewRoutes = {
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
            }
        ]
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

                            {customRoute.showLock && (
                                <>
                                    {storageState?.state === "sealed" && (
                                        <LockKeyhole className={showCaptions ? "ml-auto w-full max-w-6 mr-5" : ""} />
                                    )}
                                    {storageState?.state === "unsealed" && (
                                        <LockKeyholeOpen
                                            className={
                                                showCaptions
                                                    ? "ml-auto w-full max-w-6 mr-5 text-red-40 [&>path]:!stroke-red-40"
                                                    : "text-red-40 [&>path]:!stroke-red-40"
                                            }
                                        />
                                    )}
                                    {storageState?.state === "waiting" && (
                                        <RearLockKeyhole
                                            className={
                                                showCaptions
                                                    ? "ml-auto w-full max-w-6 mr-5 text-yellow-40 [&>path]:!stroke-yellow-40"
                                                    : "text-yellow-40 [&>path]:!stroke-yellow-40"
                                            }
                                        />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );
};
