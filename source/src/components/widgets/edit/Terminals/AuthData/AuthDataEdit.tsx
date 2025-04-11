import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useTranslate } from "react-admin";
import { CloseSheetXButton } from "../../../components/CloseSheetXButton";

interface IAuthDataEditSheet {
    open: boolean;
    // id: string;
    // authData: string;
    onOpenChange: (state: boolean) => void;
}

export const AuthDataEditSheet = (props: IAuthDataEditSheet) => {
    const { open, onOpenChange } = props;
    const translate = useTranslate();

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                className="bottom-auto top-[84px] m-0 flex h-auto w-full flex-col border-0 p-0 sm:max-w-[1015px]"
                tabIndex={-1}
                close={false}>
                <div className="flex-shrink-0 p-4 pb-[0px] md:p-[42px]">
                    <div>
                        <div className="flex items-center justify-between">
                            <SheetTitle className="!text-display-1">
                                {" "}
                                {translate("resources.terminals.fields.auth")}
                            </SheetTitle>
                            <CloseSheetXButton onOpenChange={onOpenChange} />
                        </div>
                    </div>
                </div>
                <SheetDescription />
            </SheetContent>
        </Sheet>
    );
};
