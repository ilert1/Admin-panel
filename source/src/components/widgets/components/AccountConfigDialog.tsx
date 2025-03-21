import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
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
            <DialogContent className="h-auto max-h-80 w-[350px] overflow-hidden rounded-16 xl:max-h-none">
                <DialogHeader>
                    <DialogTitle className="text-center">{translate("app.login.accountConfigTitle")}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex w-full flex-col justify-around gap-4 sm:flex-row sm:gap-[35px]">
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
                            className="!ml-0 w-full px-3 sm:w-24">
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
