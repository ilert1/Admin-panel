import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useTranslate } from "react-admin";
import { deleteLimits } from "../model/api/deleteLimits";

export interface DeleteLimitsDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    id: string;
}
export const DeleteLimitsDialog = (props: DeleteLimitsDialogProps) => {
    const { id, open, onOpenChange } = props;
    const translate = useTranslate();

    const handleDelete = () => {
        deleteLimits(id);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[270px] bg-muted">
                <DialogHeader>
                    <DialogTitle className="text-center">{translate("app.widgets.limits.deleteLimits")}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex justify-around w-full">
                        <Button onClick={handleDelete}>{translate("app.widgets.limits.reset")}</Button>
                        <Button
                            className="bg-neutral-0 dark:bg-neutral-100"
                            variant={"outline"}
                            onClick={() => {
                                onOpenChange(false);
                            }}>
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
