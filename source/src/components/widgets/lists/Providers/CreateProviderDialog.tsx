import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alertdialog";
import { useRefresh, useTranslate } from "react-admin";
import { ProviderCreate } from "../../create";

interface CreateProviderDialogProps {
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
}
export const CreateProviderDialog = (props: CreateProviderDialogProps) => {
    const { open, onOpenChange = () => {} } = props;
    const refresh = useRefresh();
    const translate = useTranslate();
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-[716px] bg-muted">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-center">
                        {translate("resources.providers.editingProvider")}
                    </AlertDialogTitle>
                    <AlertDialogDescription></AlertDialogDescription>
                    <ProviderCreate
                        onClose={() => {
                            onOpenChange(false);
                            refresh();
                        }}
                    />
                </AlertDialogHeader>
                <AlertDialogFooter></AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
