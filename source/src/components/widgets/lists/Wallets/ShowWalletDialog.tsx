import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { XIcon } from "lucide-react";
import { useTranslate } from "react-admin";
import { WalletShow } from "../../show";
import WalletsLogo from "@/lib/icons/Wallets";

interface ShowWalletDialogProps {
    id: string;
    open: boolean;
    onOpenChange: (state: boolean) => void;
}
export const ShowWalletDialog = (props: ShowWalletDialogProps) => {
    const { id, open, onOpenChange } = props;

    const translate = useTranslate();

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                className="top-[84px] m-0 flex h-full max-h-[calc(100dvh-84px)] w-full flex-col overflow-y-auto border-0 p-0 sm:h-[620px] sm:max-w-[1015px]"
                tabIndex={-1}
                close={false}>
                <div className="flex-shrink-0 p-4 pb-[0px] md:p-[42px]">
                    <div>
                        <div className="flex items-center justify-between">
                            <SheetTitle className="flex items-center gap-2 overflow-hidden break-words !text-display-1 text-neutral-90 dark:text-neutral-30 [&>svg>path]:stroke-neutral-90 dark:[&>svg>path]:stroke-neutral-30">
                                <WalletsLogo />
                                {translate("resources.wallet.manage.wallet")}
                            </SheetTitle>
                            <button
                                onClick={() => onOpenChange(false)}
                                className="border-0 text-gray-500 outline-0 transition-colors hover:text-gray-700">
                                <XIcon className="h-[28px] w-[28px]" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1" tabIndex={-1}>
                    <WalletShow id={id} onOpenChange={onOpenChange} />
                </div>
                <SheetDescription></SheetDescription>
            </SheetContent>
        </Sheet>
    );
};
