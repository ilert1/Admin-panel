import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useTranslate } from "react-admin";
import { CloseSheetXButton } from "../../components/CloseSheetXButton";
import { SystemPaymentInstrumentShow } from "../../show/SystemPaymentInstrument/SystemPaymentInstrumentShow";
import SystemToolsIcon from "@/lib/icons/System_tools.svg?react";

interface SystemPaymentInstrumentSheetProps {
    open: boolean;
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const SystemPaymentInstrumentSheet = (props: SystemPaymentInstrumentSheetProps) => {
    const { open, onOpenChange, id } = props;
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
                                <SystemToolsIcon />
                                {translate("resources.paymentSettings.systemPaymentInstruments.show")}
                            </SheetTitle>
                            <CloseSheetXButton onOpenChange={onOpenChange} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto" tabIndex={-1}>
                    <SystemPaymentInstrumentShow id={id} onOpenChange={onOpenChange} />
                </div>
                <SheetDescription />
            </SheetContent>
        </Sheet>
    );
};
