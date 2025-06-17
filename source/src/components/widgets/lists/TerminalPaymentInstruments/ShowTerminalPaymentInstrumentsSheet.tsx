import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { XIcon } from "lucide-react";
import { useTranslate } from "react-admin";
import { TerminalPaymentInstrumentsShow } from "../../show/TerminalPaymentInstruments";

interface IShowTerminalPaymentInstrumentsSheet {
    id: string;
    open: boolean;
    onOpenChange: (state: boolean) => void;
}
export const ShowTerminalPaymentInstrumentsSheet = ({
    id,
    open,
    onOpenChange
}: IShowTerminalPaymentInstrumentsSheet) => {
    const translate = useTranslate();

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                className="top-[84px] m-0 flex !max-h-[calc(100dvh-84px)] w-full flex-col border-0 p-0 sm:max-w-[1015px]"
                tabIndex={-1}
                close={false}>
                <div className="flex-shrink-0 p-4 pb-0 md:p-[42px] md:pb-0">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="!text-display-1">
                            {translate("resources.paymentSettings.terminalPaymentInstruments.show")}
                        </SheetTitle>

                        <button
                            onClick={() => onOpenChange(false)}
                            className="border-0 text-gray-500 outline-0 transition-colors hover:text-gray-700">
                            <XIcon className="h-[28px] w-[28px]" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto" tabIndex={-1}>
                    <TerminalPaymentInstrumentsShow id={id} onOpenChange={onOpenChange} />
                </div>

                <SheetDescription />
            </SheetContent>
        </Sheet>
    );
};
