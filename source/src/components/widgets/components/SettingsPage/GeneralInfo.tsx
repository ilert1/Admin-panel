import { TextField } from "@/components/ui/text-field";
import { useTranslate } from "react-admin";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { ChangePasswordDialog } from "./ChangePasswordDialog";

export const GeneralInfo = () => {
    const translate = useTranslate();
    const [changePasswordDialogOpenClicked, setChangePasswordDialogOpenClicked] = useState(false);

    return (
        <div className="w-[585px] h-[276px] bg-white dark:bg-black rounded-16 p-[30px] flex flex-col gap-[20px]">
            <h4 className="w-full text-center text-display-4">{translate("pages.settings.generalInformation")}</h4>
            <div className="grid grid-cols-2 gap-y-[20px]">
                <TextField text="Заглушка" label={translate("pages.settings.name")} copyValue />
                <TextField text="Заглушка" label="ID" copyValue />
                <TextField text="Заглушка" label="E-mail" />
            </div>
            <div className="flex justify-end">
                <Button
                    className="text-title-1"
                    variant="alert"
                    onClick={() => setChangePasswordDialogOpenClicked(true)}>
                    {translate("pages.settings.changePassword")}
                </Button>
            </div>
            <ChangePasswordDialog
                open={changePasswordDialogOpenClicked}
                onOpenChange={setChangePasswordDialogOpenClicked}
            />
        </div>
    );
};
