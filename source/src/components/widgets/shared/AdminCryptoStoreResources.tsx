import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDown, ChevronLeft, LockKeyhole, Vault, WalletCards } from "lucide-react";
import { useState } from "react";
import { useTranslate } from "react-admin";
import { NavLink, useLocation } from "react-router-dom";

const DoubleWalletsIcon = () => (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M1.88318 4.125V15.2678C1.88318 15.69 2.05089 16.0949 2.34941 16.3934C2.64794 16.6919 3.05283 16.8596 3.47501 16.8596H7.04332C7.04332 16.8596 7.04332 15.2066 7.04332 14.1046V11.9005V10.7984"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M14.6178 5.71686V3.32912C14.6178 3.11803 14.534 2.91558 14.3847 2.76632C14.2354 2.61706 14.033 2.5332 13.8219 2.5332H3.47501C3.05283 2.5332 2.64794 2.70091 2.34941 2.99944C2.05089 3.29797 1.88318 3.70285 1.88318 4.12503C1.88318 4.54721 2.05089 4.9521 2.34941 5.25063C2.64794 5.54915 3.05283 5.71686 3.47501 5.71686H15.4137C15.6248 5.71686 15.8273 5.80072 15.9765 5.94998C16.1258 6.09925 16.2097 6.30169 16.2097 6.51278"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M6.99451 9.63477V20.7776C6.99451 21.1998 7.16222 21.6046 7.46074 21.9032C7.75927 22.2017 8.16416 22.3694 8.58634 22.3694H20.5251C20.7362 22.3694 20.9386 22.2856 21.0879 22.1363C21.2371 21.987 21.321 21.7846 21.321 21.5735V18.3898"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M19.7292 11.2266V8.83888C19.7292 8.62779 19.6453 8.42535 19.496 8.27609C19.3468 8.12682 19.1443 8.04297 18.9332 8.04297H8.58634C8.16416 8.04297 7.75927 8.21068 7.46074 8.50921C7.16222 8.80773 6.99451 9.21262 6.99451 9.6348C6.99451 10.057 7.16222 10.4619 7.46074 10.7604C7.75927 11.0589 8.16416 11.2266 8.58634 11.2266H20.5251C20.7362 11.2266 20.9386 11.3105 21.0879 11.4597C21.2371 11.609 21.321 11.8115 21.321 12.0225V15.2062M21.321 15.2062H18.9332C18.5111 15.2062 18.1062 15.3739 17.8076 15.6724C17.5091 15.971 17.3414 16.3759 17.3414 16.798C17.3414 17.2202 17.5091 17.6251 17.8076 17.9236C18.1062 18.2222 18.5111 18.3899 18.9332 18.3899H21.321C21.5321 18.3899 21.7345 18.306 21.8838 18.1567C22.033 18.0075 22.1169 17.805 22.1169 17.594V16.0021C22.1169 15.791 22.033 15.5886 21.8838 15.4393C21.7345 15.2901 21.5321 15.2062 21.321 15.2062Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const BitcoinWalletIcon = () => (
    <svg
        className="my-[12px] w-full max-w-6"
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
            d="M7 7.45117H19C19.5304 7.45117 20.0391 7.66189 20.4142 8.03696C20.7893 8.41203 21 8.92074 21 9.45117V19.4512C21 19.9816 20.7893 20.4903 20.4142 20.8654C20.0391 21.2405 19.5304 21.4512 19 21.4512H5C4.46957 21.4512 3.96086 21.2405 3.58579 20.8654C3.21071 20.4903 3 19.9816 3 19.4512V5.45117C3 4.92074 3.21071 4.41203 3.58579 4.03696C3.96086 3.66189 4.46957 3.45117 5 3.45117H19"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M12.0871 18.3818C14.6605 18.853 15.296 15.1113 12.7226 14.6395M12.0871 18.3818L9 17.8162M12.0871 18.3818L11.9063 19.4512M10.664 14.2628L12.7232 14.6395C15.2966 15.1113 15.9321 11.369 13.3581 10.8978L10.27 10.3322M13.3576 10.8978L13.5395 9.82844M9.84665 19.0739L11.4804 9.45117"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const AdminCryptoStoreResources = ({ showCaptions }: { showCaptions: boolean }) => {
    const translate = useTranslate();
    const location = useLocation();
    const [openAccordion, setOpenAccordion] = useState(true);

    const currentResource = location.pathname?.split("/")?.filter((s: string) => s?.length > 0);

    const customViewRoutes = {
        name: "manage",
        icon: <BitcoinWalletIcon />,
        childrens: [
            {
                name: "manageStore",
                path: "/manageStore",
                icon: <Vault />,
                showLock: true
            },
            {
                name: "manageWallets",
                path: "/manageWallets",
                icon: <DoubleWalletsIcon />,
                showLock: false
            },
            {
                name: "manageTransactions",
                path: "/manageTransactions",
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
                        <div
                            onClick={() => {
                                if (showCaptions) setOpenAccordion(!openAccordion);
                            }}
                            className="pointer flex items-center gap-3 hover:text-green-40 [&:hover>svg>path]:stroke-green-40 [&>svg>path]:transition-all animate-in fade-in-0 transition-colors duration-150">
                            {customViewRoutes.icon}

                            {showCaptions && (
                                <span className="animate-in fade-in-0 transition-opacity p-0 m-0 leading-[22px]">
                                    {translate(`resources.${customViewRoutes.name}.name`)}
                                </span>
                            )}

                            {showCaptions && (
                                <ChevronDown
                                    className={`w-full max-w-6 mr-6 transition-transform ${
                                        openAccordion ? "rotate-180" : ""
                                    }`}
                                />
                            )}
                        </div>
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

            {showCaptions && openAccordion && (
                <div className="flex flex-col gap-4 bg-muted py-1 pl-4 mr-1">
                    {customViewRoutes.childrens.map((customRoute, index) => (
                        <NavLink
                            key={index}
                            to={customRoute.path}
                            className={
                                currentResource[0] === customRoute.name
                                    ? "flex items-center gap-3 text-green-40 animate-in fade-in-0 transition-colors duration-150 py-2 [&>svg>path]:stroke-green-40 [&>svg>path]:transition-all"
                                    : "flex items-center gap-3 hover:text-green-40 animate-in fade-in-0 transition-colors duration-150 py-2 [&:hover>svg>path]:stroke-green-40 [&>svg>path]:transition-all"
                            }>
                            {customRoute.icon}

                            <span className="animate-in fade-in-0 transition-opacity p-0 m-0 leading-[22px]">
                                {translate(`resources.${customRoute.name}.name`)}
                            </span>

                            {customRoute.showLock && <LockKeyhole className="ml-auto w-full max-w-6 mr-5" />}
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );
};
