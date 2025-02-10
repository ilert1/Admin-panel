import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useTranslate } from "react-admin";
import { CloseSheetXButton } from "../../components/CloseSheetXButton";
import { TerminalShow } from "../../show/Terminals/TerminalShow";

interface TerminalFeesDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    id: string;
    provider: string;
}

export const TerminalFeesDialog = (props: TerminalFeesDialogProps) => {
    const { open, onOpenChange, id, provider } = props;
    const translate = useTranslate();

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                className="sm:max-w-[1015px] !max-h-[calc(100dvh-84px)] w-full p-0 m-0 top-[84px] flex flex-col border-0 "
                tabIndex={-1}
                close={false}>
                <div className="p-[42px] pb-[0px] flex-shrink-0">
                    <div>
                        <div className="flex justify-between items-center">
                            <SheetTitle className="!text-display-1">{translate("resources.terminals.name")}</SheetTitle>
                            <CloseSheetXButton onOpenChange={onOpenChange} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto" tabIndex={-1}>
                    <TerminalShow id={id} provider={provider} />
                </div>
                <SheetDescription />
            </SheetContent>
        </Sheet>
    );
};
