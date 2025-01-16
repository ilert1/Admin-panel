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
                className="sm:max-w-[1015px] h-full sm:h-[502px] max-h-[calc(100dvh-84px)] overflow-hidden w-full p-0 m-0 top-[84px] flex flex-col"
                tabIndex={-1}
                close={false}>
                <div className="p-[42px] pb-[0px] flex-shrink-0">
                    <div className="flex justify-between items-center pb-2">
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
