import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { XIcon } from "lucide-react";
import { DirectionsShow } from "../../show";
import { useTranslate } from "react-admin";
import React from "react";

export interface ShowDirectionSheetProps {
    id?: string;
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
}

export const ShowDirectionSheet: React.FC<ShowDirectionSheetProps> = props => {
    const translate = useTranslate();
    const { id = "", open, onOpenChange = () => {} } = props;

    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent
                    className="sm:max-w-[1015px] !max-h-[calc(100dvh-84px)] w-full p-0 m-0 top-[84px] flex flex-col border-0 "
                    tabIndex={-1}
                    close={false}>
                    <div className="p-[42px] pb-[0px] flex-shrink-0">
                        <div>
                            <div className="flex justify-between items-center">
                                <SheetTitle className="!text-display-1">
                                    {translate("resources.direction.direction")}
                                </SheetTitle>
                                <button
                                    onClick={() => onOpenChange(false)}
                                    className="text-gray-500 hover:text-gray-700 transition-colors border-0 outline-0">
                                    <XIcon className="h-[28px] w-[28px]" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto" tabIndex={-1}>
                        <DirectionsShow id={id} onOpenChange={onOpenChange} />
                    </div>
                    <SheetDescription></SheetDescription>
                </SheetContent>
            </Sheet>
        </>
    );
};
