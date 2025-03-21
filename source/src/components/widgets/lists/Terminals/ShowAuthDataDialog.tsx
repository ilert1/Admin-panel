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
import { usePreventFocus } from "@/hooks";
import { useTranslate } from "react-admin";

interface ShowAuthDataProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    authData: string;
}

export const ShowAuthDataDialog = ({ open, authData, onOpenChange }: ShowAuthDataProps) => {
    const translate = useTranslate();

    usePreventFocus({ dependencies: [open] });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[340px] max-w-[478px] overflow-auto bg-muted">
                <DialogHeader>
                    <DialogTitle className="text-center" />
                    <DialogDescription />

                    <div className="flex w-full flex-col items-center justify-end">
                        <span className="self-start text-note-1">{translate("resources.terminals.fields.auth")}</span>

                        <MonacoEditor
                            height="144px"
                            code={authData}
                            setCode={() => {}}
                            onErrorsChange={() => {}}
                            onValidChange={() => {}}
                            disabled
                        />
                    </div>
                </DialogHeader>

                <DialogFooter>
                    <div className="flex w-full justify-end pr-1">
                        <Button
                            variant={"outline_gray"}
                            onClick={() => {
                                onOpenChange(false);
                            }}>
                            {translate("app.ui.actions.close")}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
