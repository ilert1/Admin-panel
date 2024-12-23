import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { XIcon } from "lucide-react";
import { TransactionShow } from "../../show";
import { useTranslate } from "react-admin";
import React from "react";
import { TextField } from "@/components/ui/text-field";

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
                            <button
                                onClick={() => onOpenChange(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors border-0 outline-0">
                                <XIcon className="h-[28px] w-[28px]" />
                            </button>
                        </div>
                        <TextField text={id} copyValue />
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
