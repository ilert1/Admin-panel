import { TextField } from "@/components/ui/text-field";
import { useGetIdentity, useTranslate } from "react-admin";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { ChangePasswordDialog } from "./ChangePasswordDialog";

export const GeneralInfo = () => {
    const translate = useTranslate();
    const { data: identity } = useGetIdentity();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [changePasswordDialogOpenClicked, setChangePasswordDialogOpenClicked] = useState(false);

    return (
        <div className="flex w-full max-w-[585px] flex-col gap-[20px] rounded-16 bg-white p-[30px] dark:bg-black">
            <h4 className="w-full text-center text-display-4">{translate("pages.settings.generalInformation")}</h4>
            <div className="grid grid-cols-1 gap-y-[20px] sm:grid-cols-2">
                <TextField text={identity?.fullName ?? ""} label={translate("pages.settings.name")} copyValue />
                {/* <TextField text={identity?.id.toString() ?? ""} label="ID" copyValue /> */}
                {user?.preferred_username && (
                    <TextField
                        text={user?.preferred_username}
                        label={translate("pages.settings.loginName")}
                        copyValue
                    />
                )}
                {user?.email && <TextField text={user?.email} label="E-mail" copyValue />}
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
