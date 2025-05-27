import SbpIcon from "@/lib/icons/payment_types/sbp.svg?react";
import MobilePaymentIcon from "@/lib/icons/payment_types/mobile_payment.svg?react";
import M10WalletIcon from "@/lib/icons/payment_types/m10_wallet.svg?react";
import IBANIcon from "@/lib/icons/payment_types/iban.svg?react";
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
import { cn } from "@/lib/utils";
import { memo } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/Button";

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
    wave_mobile_money: EcomWaveMobileMoneyIcon
};

export const PaymentTypeIcon = memo(
    ({ type, className, tooltip = false }: { type: string; className?: string; tooltip?: boolean }) => {
        const Icon = iconsRecord[type];

        if (!Icon) return null;
        return tooltip ? (
            <TooltipProvider>
                <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                        <Button variant="text_btn" className="cursor-default p-0">
                            <Icon className={cn(className)} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent tabIndex={-1} sideOffset={5} align="center">
                        <p>{type}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ) : (
            <Icon className={cn(className)} />
        );
    }
);

PaymentTypeIcon.displayName = "PaymentTypeIcon";
