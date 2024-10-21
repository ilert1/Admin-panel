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

export const ShowMethodsDialog = (props: ShowMethodDialogProps) => {
    const { id, open, onOpenChange } = props;

    const dataProvider = useDataProvider();
    const translate = useTranslate();

    const [code, setCode] = useState("");

    useEffect(() => {
        async function fetch() {
            const { data } = await dataProvider.getOne("provider", { id });
            console.log(data.methods);
            setCode(JSON.stringify(data.methods, null, 2));
        }
        fetch();
    }, [dataProvider, id, setCode]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[468px] max-h-[286px] bg-muted">
                <DialogHeader>
                    <DialogTitle className="text-center"></DialogTitle>
                    <DialogDescription></DialogDescription>
                    <div className="flex flex-col items-center justify-end">
                        <span className="self-start text-note-1">{translate("resources.provider.fields.methods")}</span>
                        <MonacoEditor
                            height="144px"
                            code={code}
                            setCode={() => {}}
                            onErrorsChange={() => {}}
                            onValidChange={() => {}}
                        />
                    </div>
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
