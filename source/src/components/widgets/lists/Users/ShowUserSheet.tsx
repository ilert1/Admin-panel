import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { UserShow } from "../../show";
import { useTranslate } from "react-admin";
import React from "react";
import { CloseSheetXButton } from "../../components/CloseSheetXButton";

export interface ShowSheetProps {
    id?: string;
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
}

export const ShowUserSheet: React.FC<ShowSheetProps> = ({ id = "", open, onOpenChange = () => {} }) => {
    const translate = useTranslate();

    return (
        <Sheet onOpenChange={onOpenChange} open={open}>
            <SheetContent
                className="top-[84px] m-0 flex h-full max-h-[calc(100dvh-84px)] w-full flex-col overflow-hidden p-0 sm:h-[502px] sm:max-w-[1015px]"
                tabIndex={-1}
                close={false}>
                <div className="flex-shrink-0 p-4 pb-[0px] md:p-[42px]">
                    <div className="flex items-center justify-between md:pb-2">
                        <SheetTitle className="!text-display-1">{translate("resources.users.user")}</SheetTitle>
                        <CloseSheetXButton onOpenChange={onOpenChange} />
                    </div>
                </div>

                <div className="flex-1 overflow-auto" tabIndex={-1}>
                    <UserShow id={id} onOpenChange={onOpenChange} />
                </div>
                <SheetDescription />
            </SheetContent>
        </Sheet>
    );
};
