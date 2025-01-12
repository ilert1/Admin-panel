import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslate } from "react-admin";

const realm = import.meta.env.VITE_KEYCLOAK_REALM;
const kk = import.meta.env.VITE_KEYCLOAK_URL;
const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;

interface AccountConfigDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
}

export const AccountConfigDialog = (props: AccountConfigDialogProps) => {
    const { open, onOpenChange } = props;
    const translate = useTranslate();

    const configureKKLink = `${kk}/realms/${realm}/protocol/openid-connect/auth?client_id=${clientId}&redirect_uri=${window.location.href}&response_type=code&scope=openid`;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-16 max-h-80 xl:max-h-none h-auto overflow-hidden w-[350px]">
                <DialogHeader>
                    <DialogTitle className="text-center">{translate("app.login.accountConfigTitle")}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex flex-col sm:flex-row justify-around gap-4 sm:gap-[35px] w-full">
                        <a href={configureKKLink} target="_blank" rel="noopener noreferrer">
                            <Button
                                onClick={() => {
                                    onOpenChange(false);
                                }}
                                className="w-full sm:w-40">
                                {translate("app.login.accountConfigConfirm")}
                            </Button>
                        </a>
                        <Button
                            onClick={() => {
                                onOpenChange(false);
                            }}
                            variant="secondary"
                            className="w-full !ml-0 px-3 sm:w-24">
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
