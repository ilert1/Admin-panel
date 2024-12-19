import { useTranslate } from "react-admin";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { XIcon } from "lucide-react";
import { WalletLinkedTransactionShow } from "../../show/WalletLinkedTransactions";

interface WalletLinkedTransactionShowProps {
    id: string;
    open: boolean;
    onOpenChange: (state: boolean) => void;
}

export const ShowWalletLinkedTransactionsSheet = ({ id, open, onOpenChange }: WalletLinkedTransactionShowProps) => {
    const translate = useTranslate();

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                className="sm:max-w-[1015px] max-h-[calc(100dvh-84px)] h-full sm:h-[560px] w-full p-0 m-0 top-[84px] flex flex-col border-0 overflow-y-auto"
                tabIndex={-1}
                style={{ backgroundColor: "rgba(19, 35, 44, 1)" }}
                close={false}>
                <div className="p-[42px] pb-[0px] flex-shrink-0">
                    <div>
                        <div className="flex justify-between items-center">
                            <SheetTitle className="text-display-1">
                                {translate("resources.wallet.linkedTransactions.show")}
                            </SheetTitle>
                            <button
                                onClick={() => onOpenChange(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors border-0 outline-0">
                                <XIcon className="h-[28px] w-[28px]" />
                            </button>
                        </div>
                    </div>
                </div>

                <WalletLinkedTransactionShow id={id} />

                <SheetDescription />
            </SheetContent>
        </Sheet>
    );
};
