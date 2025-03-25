import { TextField } from "@/components/ui/text-field";
import { useGetIdentity, useTranslate } from "react-admin";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { ChangePasswordDialog } from "./ChangePasswordDialog";

export const GeneralInfo = () => {
    const translate = useTranslate();
    const identity = useGetIdentity();

    const [changePasswordDialogOpenClicked, setChangePasswordDialogOpenClicked] = useState(false);

    return (
        <div className="flex min-h-[276px] w-full max-w-[585px] flex-col gap-[20px] rounded-16 bg-white p-[30px] dark:bg-black">
            <h4 className="w-full text-center text-display-4">{translate("pages.settings.generalInformation")}</h4>
            <div className="grid grid-cols-1 gap-y-[20px] sm:grid-cols-2">
                <TextField text={identity.data?.fullName ?? ""} label={translate("pages.settings.name")} copyValue />
                <TextField text={identity.data?.id.toString() ?? ""} label="ID" copyValue />
                <TextField text={identity.data?.email ?? ""} label="E-mail" />
            </div>
            <div className="flex justify-end">
                <Button
                    className="w-full text-title-1 sm:w-auto"
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
