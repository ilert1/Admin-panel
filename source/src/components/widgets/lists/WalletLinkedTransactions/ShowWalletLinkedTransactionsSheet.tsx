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
                className="top-[84px] m-0 flex h-full max-h-[calc(100dvh-84px)] w-full flex-col overflow-y-auto border-0 p-0 sm:h-[560px] sm:max-w-[1015px]"
                tabIndex={-1}
                close={false}>
                <div className="flex-shrink-0 p-4 pb-[0px] md:p-[42px]">
                    <div>
                        <div className="flex items-center justify-between">
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
