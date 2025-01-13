import { Button } from "@/components/ui/button";
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

export const ShowAuthDataDialog = (props: ShowAuthDataProps) => {
    const translate = useTranslate();
    const { open, authData, onOpenChange } = props;

    usePreventFocus({ dependencies: [open] });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[478px] max-h-[340px] overflow-auto bg-muted">
                <DialogHeader>
                    <DialogTitle className="text-center" />
                    <DialogDescription />

                    <div className="w-full flex flex-col items-center justify-end ">
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
                    <div className="flex justify-end w-full pr-1">
                        <Button
                            variant={"outline"}
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
