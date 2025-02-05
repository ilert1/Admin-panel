import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { XIcon } from "lucide-react";
import { useTranslate } from "react-admin";
import { MerchantShow } from "../../show";
import { MerchantTypeToShow } from "./Columns";

interface ShowMerchantSheetProps {
    id: string;
    showType: MerchantTypeToShow;
    open: boolean;
    onOpenChange: (state: boolean) => void;
}
export const ShowMerchantSheet = ({ id, showType, open, onOpenChange }: ShowMerchantSheetProps) => {
    const translate = useTranslate();

    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent
                    className="sm:max-w-[1015px] !max-h-[calc(100dvh-84px)] overflow-hidden w-full p-0 m-0 top-[84px] flex flex-col border-0 h-full"
                    tabIndex={-1}
                    close={false}>
                    <div className="p-[42px] pb-[0px] flex-shrink-0">
                        <div>
                            <div className="flex justify-between items-center">
                                <SheetTitle className="!text-display-1">
                                    {translate("resources.merchant.merchant")}
                                </SheetTitle>
                                <button
                                    onClick={() => onOpenChange(false)}
                                    className="text-gray-500 hover:text-gray-700 transition-colors border-0 outline-0">
                                    <XIcon className="h-[28px] w-[28px]" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="h-full min-h-0" tabIndex={-1}>
                        <MerchantShow id={id} type={showType} />
                    </div>
                    <SheetDescription></SheetDescription>
                </SheetContent>
            </Sheet>
        </>
    );
};
