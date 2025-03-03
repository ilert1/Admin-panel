import { LoadingBlock } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { useCallback, useState } from "react";
import { useShowController, useTranslate } from "react-admin";
import { Button } from "@/components/ui/Button";
import { EditUserDialog } from "./EditUserDialog";
import { DeleteUserDialog } from "./DeleteUserDialog";

// const styles = ["bg-green-50", "bg-red-50", "bg-extra-2", "bg-extra-8"];
// const translations = ["active", "frozen", "blocked", "deleted"];

interface UserShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const UserShow = ({ id, onOpenChange }: UserShowProps) => {
    const context = useShowController<Users.User>({
        resource: "users",
        id,
        queryOptions: {
            onError: e => {
                console.log(e);
            }
        }
    });
    const translate = useTranslate();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [showEditUser, setShowEditUser] = useState(false);

    const handleEditClicked = useCallback(() => {
        setShowEditUser(prev => !prev);
    }, []);

    if (context.isLoading || context.isFetching || !context.record) {
        return <LoadingBlock />;
    }
    const userName = `${context.record.first_name || ""} ${context.record.last_name || ""}`.trimEnd();

    return (
        <div className="relative">
            <div className="px-[42px] pb-[25px] flex flex-col sm:flex-row justify-between">
                <TextField text={id} copyValue className="text-neutral-70 dark:text-neutral-30" />

                <div className="flex items-center justify-center">
                    <span
                        className={`px-3 py-0.5 rounded-20 font-normal text-white text-base text-center ${
                            context.record.activity ? "bg-green-50" : "bg-extra-2"
                        }`}>
                        {translate(
                            `resources.accounts.fields.states.${context.record.activity ? "active" : "blocked"}`
                        )}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 px-[42px] gap-y-2 sm:gap-y-6 pb-[24px]">
                <TextField label={translate("resources.users.fields.name")} text={userName} copyValue />

                <TextField label={translate("resources.users.fields.login")} text={context.record.login} copyValue />

                {context.record.email && (
                    <TextField
                        label={translate("resources.users.fields.email")}
                        text={context.record.email}
                        copyValue
                    />
                )}

                <TextField
                    label={translate("resources.users.fields.roles")}
                    text={context.record.roles.map(role => translate(`resources.users.roles.${role.name}`)).join(", ")}
                    // copyValue
                />
                <div className="flex flex-col">
                    <span className="text-neutral-60 dark:text-neutral-40">
                        {translate("resources.users.fields.merchant")}
                    </span>
                    {context.record.merchant_name && (
                        <TextField
                            // label={translate("resources.users.fields.merchant")}
                            text={context.record.merchant_name}
                            // copyValue
                        />
                    )}
                    <TextField
                        // label={translate("resources.users.fields.merchant")}
                        text={context.record.merchant_id}
                        className="text-neutral-70"
                        copyValue
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4 px-[42px] mb-4 text-white font-normal">
                <Button onClick={handleEditClicked} className="text-title-1">
                    {translate("resources.users.edit")}
                </Button>

                <Button variant={"outline_gray"} onClick={() => setDialogOpen(true)}>
                    {translate("resources.users.delete")}
                </Button>
            </div>

            <EditUserDialog record={context.record} open={showEditUser} onOpenChange={setShowEditUser} id={id} />

            <DeleteUserDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onQuickShowOpenChange={onOpenChange}
                id={id}
            />
        </div>
    );
};
