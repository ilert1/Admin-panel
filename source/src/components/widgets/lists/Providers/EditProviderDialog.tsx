import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { ProvidersEdit } from "../../edit";
import { useRefresh, useTranslate } from "react-admin";

interface EditProviderDialogProps {
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
    id?: string;
}

export const EditProviderDialog = (props: EditProviderDialogProps) => {
    const refresh = useRefresh();
    const translate = useTranslate();

    const { open, id, onOpenChange = () => {} } = props;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="bg-muted max-w-full sm:w-[716px]  sm:max-h-[100dvh] !overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-center">{translate("resources.provider.editingProvider")}</DialogTitle>
                    <DialogDescription></DialogDescription>
                    <ProvidersEdit
                        id={id}
                        onClose={() => {
                            onOpenChange(false);
                            refresh();
                        }}
                    />
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
