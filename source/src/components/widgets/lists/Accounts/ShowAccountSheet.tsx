import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AccountShow } from "../../show";
import { useTranslate } from "react-admin";
import React from "react";
import { CloseSheetXButton } from "../../components/CloseSheetXButton";

export interface ShowSheetProps {
    id: string;
    open: boolean;
    onOpenChange: (state: boolean) => void;
}

export const ShowAccountSheet: React.FC<ShowSheetProps> = ({ id, open, onOpenChange = () => {} }) => {
    const translate = useTranslate();

    return (
        <Sheet onOpenChange={onOpenChange} open={open}>
            <SheetContent
                className="sm:max-w-[1015px] !max-h-[calc(100dvh-84px)] w-full p-0 m-0 top-[84px] flex flex-col h-full border-0 gap-[4px]"
                tabIndex={-1}
                close={false}>
                <SheetHeader className="p-4 md:p-[42px] pb-0 flex-shrink-0">
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center ">
                            <SheetTitle className="!text-display-1">{translate("app.ui.accountHistory")}</SheetTitle>
                            <CloseSheetXButton onOpenChange={onOpenChange} />
                        </div>
                    </div>
                </SheetHeader>

                <div className="h-full min-h-0" tabIndex={-1}>
                    <SheetDescription />
                    <AccountShow id={id} />
                </div>
            </SheetContent>
        </Sheet>
    );
};
