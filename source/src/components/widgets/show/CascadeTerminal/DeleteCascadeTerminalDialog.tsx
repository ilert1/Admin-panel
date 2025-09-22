import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { CascadeTerminalDataProvider } from "@/data";
import { useRefresh, useTranslate } from "react-admin";

export interface DeleteCascadeTerminalDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    id: string;
    onQuickShowOpenChange?: (state: boolean) => void;
    termName: string;
    cascadeName: string;
}
export const DeleteCascadeTerminalDialog = ({
    open,
    id,
    onOpenChange,
    termName,
    cascadeName,
    onQuickShowOpenChange
}: DeleteCascadeTerminalDialogProps) => {
    const cascadeTerminalDataProvider = new CascadeTerminalDataProvider();
    const refresh = useRefresh();
    const translate = useTranslate();
    const appToast = useAppToast();

    const handleDelete = () => {
        const deleteElem = async () => {
            try {
                await cascadeTerminalDataProvider.delete("cascade_terminals", {
                    id
                });
                appToast(
                    "success",
                    translate("resources.cascadeSettings.cascadeTerminals.deletedSuccessfully", {
                        cascade: cascadeName,
                        terminal: termName
                    })
                );
                refresh();
                onOpenChange(false);
                if (onQuickShowOpenChange) onQuickShowOpenChange(false);
            } catch (error) {
                if (error instanceof Error) appToast("error", error.message);
            }
        };
        deleteElem();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[250px] max-w-[270px] overflow-auto bg-muted sm:max-h-[200px]">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {translate("resources.cascadeSettings.cascadeTerminals.deleteCascadeTerminal")}
                    </DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <DialogFooter>
                    <div className="flex w-full flex-col justify-around gap-4 sm:flex-row sm:gap-0">
                        <Button onClick={handleDelete}>{translate("app.ui.actions.delete")}</Button>
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
