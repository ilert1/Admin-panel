import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { XIcon } from "lucide-react";
import { AccountShow } from "../../show";
import { useTranslate } from "react-admin";
import React from "react";
import { TextField } from "@/components/ui/text-field";

export interface ShowSheetProps {
    accountId: string;
    accountCaption: string;
    open: boolean;
    onOpenChange: (state: boolean) => void;
}

export const ShowAccountSheet: React.FC<ShowSheetProps> = ({
    accountId,
    accountCaption,
    open,
    onOpenChange = () => {}
}) => {
    const translate = useTranslate();

    return (
        <Sheet onOpenChange={onOpenChange} open={open}>
            <SheetContent
                className="sm:max-w-[1015px] !max-h-[calc(100dvh-84px)] w-full p-0 m-0 top-[84px] flex flex-col border-0"
                tabIndex={-1}
                style={{ backgroundColor: "rgba(19, 35, 44, 1)" }}
                close={false}>
                <SheetHeader className="p-[42px] pb-0 flex-shrink-0">
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center ">
                            <SheetTitle className="!text-display-1">{translate("app.ui.accountHistory")}</SheetTitle>

                            <button
                                onClick={() => onOpenChange(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors border-0 outline-0">
                                <XIcon className="h-[28px] w-[28px]" />
                            </button>
                        </div>
                        <div className="text-display-2 mb-2">
                            <span>{accountCaption}</span>
                        </div>
                        <TextField text={accountId} copyValue />
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-auto" tabIndex={-1}>
                    <SheetDescription />
                    <AccountShow id={accountId} type="compact" />
                </div>
            </SheetContent>
        </Sheet>
    );
};
