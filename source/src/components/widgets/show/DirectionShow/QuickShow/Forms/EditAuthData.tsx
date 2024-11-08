import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { fetchUtils, useDataProvider, useRefresh, useTranslate } from "react-admin";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface EditAuthDataProps {
    open: boolean;
    id: string;
    onOpenChange: (state: boolean) => void;
}
const API_URL = import.meta.env.VITE_ENIGMA_URL;

export const EditAuthData = (props: EditAuthDataProps) => {
    const { open, id, onOpenChange } = props;

    const translate = useTranslate();
    const { toast } = useToast();
    const refresh = useRefresh();

    const [code, setCode] = useState("{}");
    const [hasErrors, setHasErrors] = useState(false);
    const [isValid, setIsValid] = useState(false);

    const handleSaveClicked = async () => {
        const data = JSON.parse(code);
        setCode("{}");
        try {
            const body = JSON.stringify({
                auth_data: data
            });
            const { json } = await fetchUtils.fetchJson(`${API_URL}/direction/${id}`, {
                method: "PUT",
                body,
                user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
            });

            if (!json.success) {
                throw new Error(json.error);
            }

            toast({
                description: translate("resources.direction.addedSuccess"),
                variant: "success",
                title: "Success"
            });
            onOpenChange(false);
            refresh();
        } catch (error: any) {
            console.log(error);
            toast({
                description: translate("resources.direction.errors.authError"),
                variant: "destructive",
                title: "Error"
            });
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-[468px] max-h-[464px] bg-muted p-[30px] ">
                    <DialogHeader>
                        <DialogTitle className="text-center">
                            <span className="text-display-4">
                                {translate("resources.direction.changeAuthDataHeader")}
                            </span>
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                        <div className="text-title-1 mb-[24px]">
                            {translate("resources.direction.writeSecretPhrase")}
                        </div>
                        <div className="w-full flex flex-col items-center mb-[24px]">
                            <div className="flex justify-start w-full text-note-1 pb-[4px]">
                                {translate("resources.direction.secretHelper")}
                            </div>
                            <MonacoEditor
                                height="144px"
                                onErrorsChange={setHasErrors}
                                onValidChange={setIsValid}
                                code={code}
                                setCode={setCode}
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row justify-end gap-[16px] w-full">
                            <Button onClick={() => handleSaveClicked()} disabled={hasErrors || !isValid}>
                                {translate("app.ui.actions.save")}
                            </Button>
                            <Button onClick={() => onOpenChange(false)} variant={"deleteGray"}>
                                {translate("app.ui.actions.cancel")}
                            </Button>
                        </div>
                    </DialogHeader>
                    <DialogFooter></DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
