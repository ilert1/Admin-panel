import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { useCopy } from "@/hooks/useCopy";
import { useTranslate } from "react-admin";

interface ProviderSettingsJsonShowDialog {
    open: boolean;
    setOpen: (open: boolean) => void;
    label: string;
    json: string;
}

export const ProviderSettingsJsonShowDialog = (props: ProviderSettingsJsonShowDialog) => {
    const { open, setOpen, label, json } = props;
    const translate = useTranslate();
    const { copy } = useCopy();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="!z-[200] h-[80dvh] overflow-auto rounded-16 bg-muted">
                <DialogHeader>
                    <DialogTitle className="mb-2 text-center">{label}</DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <MonacoEditor code={json} height="h-full" disabled />
                <DialogFooter>
                    <div className="flex w-full justify-end gap-4">
                        <Button onClick={() => copy(json)}>
                            {translate("resources.provider.settings.copyAllData")}
                        </Button>
                        <Button
                            className="bg-neutral-0 dark:bg-neutral-100"
                            variant={"outline"}
                            onClick={() => setOpen(false)}>
                            {translate("app.ui.actions.close")}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
