import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useTranslate } from "react-admin";
import { CloseSheetXButton } from "../../components/CloseSheetXButton";
import { CascadeTerminalShow } from "../../show/CascadeTerminal";

export interface ShowCascadeTerminalSheetProps {
    id?: string;
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
}

export const ShowCascadeTerminalSheet = ({ id = "", open, onOpenChange = () => {} }: ShowCascadeTerminalSheetProps) => {
    const translate = useTranslate();

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                className="top-[84px] m-0 flex !max-h-[calc(100dvh-84px)] w-full flex-col border-0 p-0 sm:max-w-[1015px]"
                tabIndex={-1}
                close={false}>
                <div className="flex-shrink-0 p-4 pb-[0px] md:p-[42px]">
                    <div>
                        <div className="flex items-center justify-between">
                            <SheetTitle className="!text-display-1">
                                {translate("resources.cascadeSettings.cascadeTerminals.cascadeTerminal")}
                            </SheetTitle>
                            <CloseSheetXButton onOpenChange={onOpenChange} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto" tabIndex={-1}>
                    <CascadeTerminalShow id={id} onOpenChange={onOpenChange} />
                </div>
                <SheetDescription></SheetDescription>
            </SheetContent>
        </Sheet>
    );
};
