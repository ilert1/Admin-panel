import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { useEffect, useState } from "react";
import { useDataProvider, useTranslate } from "react-admin";

interface ShowMethodDialogProps {
    id: string;
    open: boolean;
    onOpenChange: (state: boolean) => void;
}

const EditorDialog = ({ id }: { id: string }) => {
    const dataProvider = useDataProvider();

    const [code, setCode] = useState("");

    useEffect(() => {
        async function fetch() {
            const { data } = await dataProvider.getOne("provider", { id });
            setCode(JSON.stringify(data.methods, null, 2));
        }
        fetch();
    }, [dataProvider, id, setCode]);

    return (
        <MonacoEditor
            height="144px"
            code={code}
            setCode={() => {}}
            onErrorsChange={() => {}}
            onValidChange={() => {}}
            disabled
        />
    );
};

export const ShowMethodsDialog = (props: ShowMethodDialogProps) => {
    const { id, open, onOpenChange } = props;
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[478px] h-[295px] max-h-full overflow-auto bg-muted">
                <DialogHeader>
                    <DialogTitle className="text-center"></DialogTitle>
                    <DialogDescription></DialogDescription>
                    <div className="w-full flex flex-col items-center justify-end ">
                        <span className="self-start text-note-1">{translate("resources.provider.fields.methods")}</span>
                        <EditorDialog id={id} />
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
