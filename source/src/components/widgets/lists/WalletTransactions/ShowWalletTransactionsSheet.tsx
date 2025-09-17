import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { WalletCards, XIcon } from "lucide-react";
import { useTranslate } from "react-admin";
import { WalletTransactionsShow } from "../../show";

interface ShowWalletTransactionsSheetProps {
    id: string;
    open: boolean;
    onOpenChange: (state: boolean) => void;
}
export const ShowWalletTransactionsSheet = ({ id, open, onOpenChange }: ShowWalletTransactionsSheetProps) => {
    const translate = useTranslate();

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                className="top-[84px] m-0 flex h-full max-h-[calc(100dvh-84px)] w-full flex-col overflow-y-auto border-0 p-0 sm:h-[540px] sm:max-w-[1015px]"
                tabIndex={-1}
                close={false}>
                <div className="flex-shrink-0 p-4 pb-[0px] md:p-[42px]">
                    <div>
                        <div className="flex items-center justify-between">
                            <SheetTitle className="flex items-center gap-2 overflow-hidden break-words !text-display-1 text-neutral-90 dark:text-neutral-30">
                                <WalletCards className="text-neutral-90 dark:text-neutral-30" />
                                {translate("resources.wallet.transactions.cryptotransaction")}
                            </SheetTitle>
                            <button
                                onClick={() => onOpenChange(false)}
                                className="border-0 text-gray-500 outline-0 transition-colors hover:text-gray-700">
                                <XIcon className="h-[28px] w-[28px]" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto" tabIndex={-1}>
                    <WalletTransactionsShow id={id} />
                </div>
                <SheetDescription></SheetDescription>
            </SheetContent>
        </Sheet>
    );
};
