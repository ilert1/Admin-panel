import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { XIcon } from "lucide-react";
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
                className="sm:max-w-[1015px] max-h-[calc(100dvh-84px)] h-full sm:h-[540px] w-full p-0 m-0 top-[84px] flex flex-col border-0 overflow-y-auto"
                tabIndex={-1}
                close={false}>
                <div className="p-4 md:p-[42px] pb-[0px] flex-shrink-0">
                    <div>
                        <div className="flex justify-between items-center">
                            <SheetTitle className="!text-display-1 break-words overflow-hidden text-neutral-90 dark:text-neutral-30">
                                {translate("resources.wallet.transactions.cryptotransaction")}
                            </SheetTitle>
                            <button
                                onClick={() => onOpenChange(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors border-0 outline-0">
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
