import { useTranslate } from "react-admin";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { WalletLinkedTransactionShow } from "../../show/WalletLinkedTransactions";
import { CloseSheetXButton } from "../../components/CloseSheetXButton";

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
                close={false}>
                <div className="p-4 md:p-[42px] pb-[0px] flex-shrink-0">
                    <div>
                        <div className="flex justify-between items-center">
                            <SheetTitle className="!text-display-1">
                                {translate("resources.wallet.linkedTransactions.show")}
                            </SheetTitle>
                            <CloseSheetXButton onOpenChange={onOpenChange} />
                        </div>
                    </div>
                </div>

                <WalletLinkedTransactionShow id={id} />

                <SheetDescription />
            </SheetContent>
        </Sheet>
    );
};
