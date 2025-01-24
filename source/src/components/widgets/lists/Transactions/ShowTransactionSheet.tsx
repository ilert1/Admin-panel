import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TransactionShow } from "../../show";
import { useTranslate } from "react-admin";
import React from "react";
import { TextField } from "@/components/ui/text-field";
import { CloseSheetXButton } from "../../components/CloseSheetXButton";

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
                className="sm:max-w-[1015px] !max-h-[calc(100dvh-84px)] w-full p-0 m-0 top-[84px] flex flex-col border-0"
                tabIndex={-1}
                close={false}>
                <SheetHeader className="p-[42px] pb-[24px] flex-shrink-0">
                    <div>
                        <div className="flex justify-between items-center pb-2">
                            <SheetTitle className="!text-display-1">
                                {translate("app.ui.transactionHistory")}
                            </SheetTitle>
                            <CloseSheetXButton onOpenChange={onOpenChange} />
                        </div>
                        <TextField text={id} copyValue className="text-neutral-70 dark:text-neutral-30" />
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-auto" tabIndex={-1}>
                    <SheetDescription />
                    <TransactionShow id={id} />
                </div>
            </SheetContent>
        </Sheet>
    );
};
