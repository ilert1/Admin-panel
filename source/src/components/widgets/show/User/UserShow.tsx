import { LoadingAlertDialog } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { useState } from "react";
import { useShowController, useTranslate } from "react-admin";
import { Button } from "@/components/ui/button";
import { EditUserDialog } from "./EditUserDialog";
import { DeleteUserDialog } from "./DeleteUserDialog";

const styles = ["bg-green-50", "bg-red-50", "bg-extra-2", "bg-extra-8"];
const translations = ["active", "frozen", "blocked", "deleted"];

interface UserShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const UserShow = ({ id, onOpenChange }: UserShowProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [showEditUser, setShowEditUser] = useState(false);

    const translate = useTranslate();
    const context = useShowController<Users.User>({
        id,
        queryOptions: { refetchOnWindowFocus: false, refetchInterval: false }
    });

    if (context.isLoading || context.isFetching || !context.record) {
        return <LoadingAlertDialog />;
    }
    const index = context.record.state - 1;

    return (
        <div className="relative">
            <div className="px-[42px] pb-[25px] flex flex-col sm:flex-row justify-between">
                <TextField text={id} copyValue />

                <div className="flex items-center justify-center">
                    <span className={`px-3 py-0.5 rounded-20 font-normal text-base text-center ${styles[index]}`}>
                        {translate(`resources.accounts.fields.states.${translations[index]}`)}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 px-[42px] gap-y-2 sm:gap-y-6 pb-[24px]">
                <TextField label={translate("resources.users.fields.name")} text={context.record.name} copyValue />

                <div className="max-w-96">
                    <TextField
                        label={translate("resources.users.fields.public_key")}
                        text={context.record.public_key}
                        copyValue
                    />
                </div>

                <TextField label={translate("resources.users.fields.login")} text={context.record.login} />

                <TextField label={translate("resources.users.fields.email")} text={context.record.email} />

                <TextField label={translate("resources.users.fields.currency")} text={context.record.shop_currency} />
            </div>

            <div className="flex justify-end gap-4 px-[42px] mb-4">
                <Button disabled={index !== 0} onClick={() => setShowEditUser(true)} className="text-title-1">
                    {translate("resources.users.edit")}
                </Button>

                <Button
                    variant={"outline"}
                    className="border-[1px] border-neutral-50 text-neutral-50 bg-transparent"
                    onClick={() => setDialogOpen(true)}>
                    {translate("resources.users.delete")}
                </Button>
            </div>

            <EditUserDialog open={showEditUser} onOpenChange={setShowEditUser} id={id} record={context.record} />

            <DeleteUserDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onQuickShowOpenChange={onOpenChange}
                id={id}
            />
        </div>
    );
};
