import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useTranslate } from "react-admin";
import { CloseSheetXButton } from "../../components/CloseSheetXButton";
import { TerminalShow } from "../../show/Terminals/TerminalShow";
import { SquareTerminal } from "lucide-react";

interface TerminalFeesDialogProps {
    open: boolean;
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const TerminalShowDialog = ({ open, onOpenChange, id }: TerminalFeesDialogProps) => {
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
                            <SheetTitle className="flex items-center gap-2 overflow-hidden break-words !text-display-1 text-neutral-90 dark:text-neutral-30">
                                <SquareTerminal className="text-neutral-90 dark:text-neutral-30" />
                                {translate("resources.terminals.terminal")}
                            </SheetTitle>
                            <CloseSheetXButton onOpenChange={onOpenChange} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto" tabIndex={-1}>
                    <TerminalShow id={id} onOpenChange={onOpenChange} />
                </div>
                <SheetDescription />
            </SheetContent>
        </Sheet>
    );
};
