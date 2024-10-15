import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alertdialog";
import { ProvidersEdit } from "../../edit";
import { useRefresh, useTranslate } from "react-admin";

interface EditProviderDialogProps {
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
    id?: string;
    setEditDialogOpen?: (state: boolean) => void;
}

export const EditProviderDialog = (props: EditProviderDialogProps) => {
    const refresh = useRefresh();
    const translate = useTranslate();

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const { open, id, onOpenChange, setEditDialogOpen = () => {} } = props;
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-[716px] bg-muted">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-center">
                        {translate("resources.providers.editingProvider")}
                    </AlertDialogTitle>
                    <AlertDialogDescription></AlertDialogDescription>
                    <ProvidersEdit
                        id={id}
                        onClose={() => {
                            setEditDialogOpen(false);
                            refresh();
                        }}
                    />
                </AlertDialogHeader>
                <AlertDialogFooter></AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
