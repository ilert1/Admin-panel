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
}

export const EditProviderDialog = (props: EditProviderDialogProps) => {
    const refresh = useRefresh();
    const translate = useTranslate();

    const { open, id, onOpenChange = () => {} } = props;
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="z-[60] bg-muted max-w-full w-[716px] h-full max-h-[100dvh] md:h-auto max-h-[100dvh] !overflow-y-auto rounded-[0] md:rounded-[16px]">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-center">
                        {translate("resources.provider.editingProvider")}
                    </AlertDialogTitle>
                    <AlertDialogDescription></AlertDialogDescription>
                    <ProvidersEdit
                        id={id}
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
