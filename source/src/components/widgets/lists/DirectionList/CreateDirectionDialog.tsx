import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useTranslate } from "react-admin";
import { DirectionCreate } from "../../create";

export interface CreateDirectionDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
}
export const CreateDirectionDialog = (props: CreateDirectionDialogProps) => {
    const { open, onOpenChange } = props;

    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{translate("app.ui.actions.areYouSure")}</DialogTitle>
                    <DialogDescription></DialogDescription>
                    <DirectionCreate />
                </DialogHeader>
                <DialogFooter>
                    {/* <DialogAction onClick={handleOkClicked}> */}
                    {/* {translate("app.ui.actions.delete")} */}
                    {/* </DialogAction> */}
                    {/* <DialogCancel>{translate("app.ui.actions.cancel")}</DialogCancel> */}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
