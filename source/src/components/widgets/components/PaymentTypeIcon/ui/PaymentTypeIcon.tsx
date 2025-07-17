import SbpIcon from "@/lib/icons/payment_types/sbp.svg?react";
import MobilePaymentIcon from "@/lib/icons/payment_types/mobile_payment.svg?react";
import M10WalletIcon from "@/lib/icons/payment_types/m10_wallet.svg?react";
import IBANIcon from "@/lib/icons/payment_types/IBAN.svg?react";
import Card2CardIcon from "@/lib/icons/payment_types/card2card.svg?react";
import Card2CardCrossBorderIcon from "@/lib/icons/payment_types/card2card_cross_border.svg?react";
import BankAccountNumberIcon from "@/lib/icons/payment_types/bank_account_number.svg?react";
import SbpCrossBorderIcon from "@/lib/icons/payment_types/sbp_cross_border.svg?react";
import AdCashIcon from "@/lib/icons/payment_types/ad_cash.svg?react";
import AdChinaIcon from "@/lib/icons/payment_types/ad_china.svg?react";
import AdCryptoWalletIcon from "@/lib/icons/payment_types/ad_crypto_wallet.svg?react";
import AdDigitalWalletIcon from "@/lib/icons/payment_types/ad_digital_wallet.svg?react";
import AdIndiaIcon from "@/lib/icons/payment_types/ad_India.svg?react";
import AdSepaIcon from "@/lib/icons/payment_types/ad_sepa.svg?react";
import AdSwiftIcon from "@/lib/icons/payment_types/ad_swift.svg?react";
import EcomAirtelMobileMoneyIcon from "@/lib/icons/payment_types/ecom_airtel_mobile_money.svg?react";
import EcomHaloPesaMobileMoneyIcon from "@/lib/icons/payment_types/ecom_halo_pesa_mobile_money.svg?react";
import EcomMoovMobileMoneyIcon from "@/lib/icons/payment_types/ecom_moov_mobile_money.svg?react";
import EcomMtnMobileMoneyIcon from "@/lib/icons/payment_types/ecom_mtn_mobile_money.svg?react";
import EcomNgnBankNumberIcon from "@/lib/icons/payment_types/ecom_ngn_bank_number.svg?react";
import EcomOrangeMobileMoneyIcon from "@/lib/icons/payment_types/ecom_orange_mobile_money.svg?react";
import EcomTigoMobileMoneyIcon from "@/lib/icons/payment_types/ecom_tigo_mobile_money.svg?react";
import EcomVodacomMobileMoneyIcon from "@/lib/icons/payment_types/ecom_vodacom_mobile_money.svg?react";
import EcomVodafoneMobileMoneyIcon from "@/lib/icons/payment_types/ecom_vodafone_mobile_money.svg?react";
import EcomWaveMobileMoneyIcon from "@/lib/icons/payment_types/ecom_wave_mobile_money.svg?react";
import IBANAccountIcon from "@/lib/icons/payment_types/iban_account.svg?react";
import EcomLocalAllIcon from "@/lib/icons/payment_types/ecom_local_all.svg?react";
import EcomLocalCardIcon from "@/lib/icons/payment_types/ecom_local_card.svg?react";
import EcomPlatformAllIcon from "@/lib/icons/payment_types/ecom_platform_all.svg?react";
import EcomPlatformCardIcon from "@/lib/icons/payment_types/ecom_platform_card.svg?react";
import EcomExternalAllIcon from "@/lib/icons/payment_types/ecom_external_all.svg?react";
import PhoneNumberPaymentIcon from "@/lib/icons/payment_types/phone_number_payment.svg?react";
import EcomNonameIcon from "@/lib/icons/payment_types/ecom_noname.svg?react";
import WalletPaymentIcon from "@/lib/icons/payment_types/wallet_payment.svg?react";

import { cn } from "@/lib/utils";
import { memo } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const iconsRecord: Record<
    string,
    React.FunctionComponent<
        React.SVGProps<SVGSVGElement> & {
            title?: string;
            titleId?: string;
            desc?: string;
            descId?: string;
        }
    >
> = {
    sbp: SbpIcon,
    sbp_cross_border: SbpCrossBorderIcon,
    mobile_payment: MobilePaymentIcon,
    m10_wallet: M10WalletIcon,
    IBAN: IBANIcon,
    card2card: Card2CardIcon,
    card2card_cross_border: Card2CardCrossBorderIcon,
    bank_account_number: BankAccountNumberIcon,
    cash: AdCashIcon,
    china: AdChinaIcon,
    crypto_wallet: AdCryptoWalletIcon,
    digital_wallet: AdDigitalWalletIcon,
    India: AdIndiaIcon,
    sepa: AdSepaIcon,
    swift: AdSwiftIcon,
    airtel_mobile_money: EcomAirtelMobileMoneyIcon,
    halo_pesa_mobile_money: EcomHaloPesaMobileMoneyIcon,
    moov_mobile_money: EcomMoovMobileMoneyIcon,
    mtn_mobile_money: EcomMtnMobileMoneyIcon,
    ngn_bank_number: EcomNgnBankNumberIcon,
    orange_mobile_money: EcomOrangeMobileMoneyIcon,
    tigo_mobile_money: EcomTigoMobileMoneyIcon,
    vodacom_mobile_money: EcomVodacomMobileMoneyIcon,
    vodafone_mobile_money: EcomVodafoneMobileMoneyIcon,
    wave_mobile_money: EcomWaveMobileMoneyIcon,
    ecom_local_all: EcomLocalAllIcon,
    ecom_local_card: EcomLocalCardIcon,
    ecom_platform_all: EcomPlatformAllIcon,
    ecom_platform_card: EcomPlatformCardIcon,
    ecom_external_all: EcomExternalAllIcon,
    iban_account: IBANAccountIcon,
    phone_number_payment: PhoneNumberPaymentIcon,
    ecom_noname: EcomNonameIcon,
    wallet_payment: WalletPaymentIcon
};

export const PaymentTypeIcon = memo(
    ({
        type,
        className,
        small = false,
        metaIcon,
        metaIconMargin = false
    }: {
        type: string;
        className?: string;
        small?: boolean;
        metaIcon?: string | unknown;
        metaIconMargin?: boolean;
    }) => {
        if (metaIcon && typeof metaIcon === "string") {
            return (
                <img
                    src={metaIcon}
                    alt="icon"
                    className={cn("h-6 w-6 fill-white object-contain", metaIconMargin ? "mr-2" : "")}
                />
            );
        }
        const Icon = iconsRecord[type];

        if (!Icon) {
            return (
                <TooltipProvider>
                    <Tooltip delayDuration={300}>
                        <TooltipTrigger role="tooltip" asChild className="h-auto">
                            <div className="cursor-default p-0">
                                <div
                                    className={cn(
                                        className,
                                        "h-auto w-auto rounded-full bg-neutral-80 px-2 py-1 text-note-1 text-white",
                                        small ? "relative flex h-4 w-4 items-center justify-start text-left" : ""
                                    )}>
                                    {small ? (
                                        <span
                                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                                            style={{ fontSize: "8px" }}>
                                            {type
                                                .toUpperCase()
                                                .split("_")
                                                .map(el => el[0])
                                                .join("")}
                                        </span>
                                    ) : (
                                        type
                                            .toUpperCase()
                                            .split("_")
                                            .map(el => el[0])
                                            .join("")
                                    )}
                                </div>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent tabIndex={-1} sideOffset={5} align="center">
                            <p>{type}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        }
        return (
            <TooltipProvider>
                <Tooltip delayDuration={300}>
                    <TooltipTrigger role="tooltip" asChild>
                        <div className={cn("h-auto w-auto cursor-default p-0", metaIconMargin ? "mr-2" : "")}>
                            <Icon className={cn(className)} />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent tabIndex={-1} sideOffset={5} align="center">
                        <p>{type}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
        // tooltip ? (
        // ) : (
        //     <Icon className={cn(className)} />
        // );
    }
);

PaymentTypeIcon.displayName = "PaymentTypeIcon";
