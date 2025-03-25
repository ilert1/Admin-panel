import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { DirectionsShow } from "../../show";
import { useTranslate } from "react-admin";
import React from "react";
import { CloseSheetXButton } from "../../components/CloseSheetXButton";

export interface ShowDirectionSheetProps {
    id?: string;
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
}

export const ShowDirectionSheet: React.FC<ShowDirectionSheetProps> = props => {
    const translate = useTranslate();
    const { id = "", open, onOpenChange = () => {} } = props;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                className="top-[84px] m-0 flex !max-h-[calc(100dvh-84px)] w-full flex-col border-0 p-0 sm:max-w-[1015px]"
                tabIndex={-1}
                close={false}
            >
                <div className="flex-shrink-0 p-4 pb-[0px] md:p-[42px]">
                    <div>
                        <div className="flex items-center justify-between">
                            <SheetTitle className="!text-display-1">
                                {translate("resources.direction.direction")}
                            </SheetTitle>
                            <CloseSheetXButton onOpenChange={onOpenChange} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto" tabIndex={-1}>
                    <DirectionsShow id={id} onOpenChange={onOpenChange} />
                </div>
                <SheetDescription></SheetDescription>
            </SheetContent>
        </Sheet>
    );
};
