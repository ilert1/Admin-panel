import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useDataProvider, useRefresh, useTranslate } from "react-admin";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Direction } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAppToast } from "@/components/ui/toast/useAppToast";

interface EditAuthDataProps {
    open: boolean;
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const EditAuthData = ({ open, id, onOpenChange }: EditAuthDataProps) => {
    const translate = useTranslate();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();

    const [code, setCode] = useState("{}");
    const [hasErrors, setHasErrors] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const appToast = useAppToast();

    const handleSaveClicked = async () => {
        const data = JSON.parse(code);
        setCode("{}");
        try {
            await dataProvider.update<Direction>("direction", {
                id,
                data: { auth_data: data },
                previousData: undefined
            });
            appToast("success", translate("resources.direction.addedSuccess"));

            onOpenChange(false);
            refresh();
        } catch (error: any) {
            appToast("error", error.message ?? translate("resources.direction.errors.authError"));
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent disableOutsideClick className="max-w-[468px] max-h-[464px] bg-muted p-[30px] ">
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
                            <Button onClick={() => onOpenChange(false)} variant={"outline_gray"}>
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
