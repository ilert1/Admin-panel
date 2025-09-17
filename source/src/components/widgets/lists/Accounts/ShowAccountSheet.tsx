import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AccountShow } from "../../show";
import { useTranslate } from "react-admin";
import React from "react";
import { CloseSheetXButton } from "../../components/CloseSheetXButton";
import { WalletMinimalIcon } from "lucide-react";

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
                className="top-[84px] m-0 flex h-full !max-h-[calc(100dvh-84px)] w-full flex-col gap-[4px] border-0 p-0 sm:max-w-[1015px]"
                tabIndex={-1}
                close={false}>
                <SheetHeader className="flex-shrink-0 p-4 pb-0 md:p-[42px]">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <SheetTitle className="flex items-center gap-2 overflow-hidden break-words !text-display-1 text-neutral-90 dark:text-neutral-30">
                                <WalletMinimalIcon className="text-neutral-90 dark:text-neutral-30" />
                                {translate("app.ui.accountHistory")}
                            </SheetTitle>
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
