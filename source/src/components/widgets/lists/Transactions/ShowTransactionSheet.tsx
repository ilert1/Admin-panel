import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TransactionShow } from "../../show";
import { useTranslate } from "react-admin";
import React from "react";
import { TextField } from "@/components/ui/text-field";
import { CloseSheetXButton } from "../../components/CloseSheetXButton";
import { HistoryIcon } from "lucide-react";

export interface ShowTransactionSheetProps {
    id: string;
    open: boolean;
    onOpenChange: (state: boolean) => void;
}

export const ShowTransactionSheet: React.FC<ShowTransactionSheetProps> = ({ id, open, onOpenChange }) => {
    const translate = useTranslate();

    return (
        <Sheet onOpenChange={onOpenChange} open={open}>
            <SheetContent
                className="top-[84px] m-0 flex h-full !max-h-[calc(100dvh-84px)] w-full flex-col border-0 p-0 sm:max-w-[1020px]"
                tabIndex={-1}
                close={false}>
                <SheetHeader className="flex-shrink-0 p-4 pb-1 md:p-[42px] md:pb-[24px]">
                    <div>
                        <div className="flex items-center justify-between pb-2">
                            <SheetTitle className="flex items-center gap-2 overflow-hidden break-words !text-display-1 text-neutral-90 dark:text-neutral-30">
                                <HistoryIcon className="text-neutral-90 dark:text-neutral-30" />
                                {translate("app.ui.transactionHistory")}
                            </SheetTitle>
                            <CloseSheetXButton onOpenChange={onOpenChange} />
                        </div>
                        <TextField text={id} copyValue className="text-neutral-70 dark:text-neutral-30" />
                    </div>
                </SheetHeader>

                <div className="h-full min-h-0" tabIndex={-1}>
                    <TransactionShow id={id} />
                </div>
                <SheetDescription />
            </SheetContent>
        </Sheet>
    );
};
