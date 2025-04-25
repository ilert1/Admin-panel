import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { XIcon } from "lucide-react";
import { useTranslate } from "react-admin";
import { MappingShow } from "../../show/Mapping/MappingShow";

interface ShowMappingSheetProps {
    id: string;
    open: boolean;
    onOpenChange: (state: boolean) => void;
}
export const ShowMappingSheet = ({ id, open, onOpenChange }: ShowMappingSheetProps) => {
    const translate = useTranslate();

    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent
                    className="top-[84px] m-0 flex h-full !max-h-[calc(100dvh-84px)] w-full flex-col overflow-hidden border-0 p-0 sm:max-w-[1015px]"
                    tabIndex={-1}
                    close={false}>
                    <div className="flex-shrink-0 p-4 !pb-[0px] md:p-[42px]">
                        <div className="flex items-center justify-between">
                            <SheetTitle className="!text-display-1">
                                {translate("resources.callbridge.mapping.mapping")}
                            </SheetTitle>

                            <button
                                onClick={() => onOpenChange(false)}
                                className="border-0 text-gray-500 outline-0 transition-colors hover:text-gray-700">
                                <XIcon className="h-[28px] w-[28px]" />
                            </button>
                        </div>
                    </div>
                    <MappingShow id={id} onOpenChange={onOpenChange} />
                    <SheetDescription></SheetDescription>
                </SheetContent>
            </Sheet>
        </>
    );
};
