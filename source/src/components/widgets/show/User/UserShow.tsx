import { LoadingBlock } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { useCallback, useState } from "react";
import { useTranslate } from "react-admin";
import { Button } from "@/components/ui/Button";
import { EditUserDialog } from "./EditUserDialog";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { useAbortableShowController } from "@/hooks/useAbortableShowController";
import { useSheets } from "@/components/providers/SheetProvider";
import { useGetMerchantData } from "@/hooks/useGetMerchantData";

// const styles = ["bg-green-50", "bg-red-50", "bg-extra-2", "bg-extra-8"];
// const translations = ["active", "frozen", "blocked", "deleted"];

interface UserShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const UserShow = ({ id, onOpenChange }: UserShowProps) => {
    const context = useAbortableShowController<Users.User>({ resource: "users", id });
    const translate = useTranslate();
    const { openSheet } = useSheets();
    const { getMerchantIdAndName, isLoadingMerchants } = useGetMerchantData();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [showEditUser, setShowEditUser] = useState(false);

    const handleEditClicked = useCallback(() => {
        setShowEditUser(prev => !prev);
    }, []);

    if (context.isLoading || context.isFetching || !context.record || isLoadingMerchants) {
        return <LoadingBlock />;
    }
    const merch = getMerchantIdAndName(context.record.merchant_id);
    const userName = `${context.record.first_name || ""} ${context.record.last_name || ""}`.trimEnd();

    return (
        <div className="relative">
            <div className="flex flex-row flex-wrap justify-between gap-2 px-4 pb-1 md:flex-nowrap md:px-[42px] md:pb-[25px]">
                <TextField text={id} copyValue className="text-neutral-70 dark:text-neutral-30" />

                <div className="flex items-center justify-center">
                    <span
                        className={`rounded-20 px-3 py-0.5 text-center text-base font-normal text-white ${
                            context.record.activity ? "bg-green-50" : "bg-extra-2"
                        }`}>
                        {translate(
                            `resources.accounts.fields.states.${context.record.activity ? "active" : "blocked"}`
                        )}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-y-1 px-4 pb-4 sm:grid-cols-2 md:gap-y-6 md:px-[42px] md:pb-[24px]">
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
                />

                <div>
                    <span className="text-sm text-neutral-60">{translate("resources.users.fields.merchant")}</span>

                    {context.record.merchant_name && <TextField text={context.record.merchant_name} />}
                    <TextField
                        text={merch.id ? (merch.name ?? "") : (context.record.merchant_name ?? "")}
                        copyValue
                        onClick={
                            merch.id
                                ? () => openSheet("merchant", { id: merch.id, merchantName: merch.name })
                                : undefined
                        }
                    />
                </div>
            </div>

            <div className="mb-4 flex flex-col justify-end gap-2 px-4 font-normal text-white sm:flex-row sm:px-[42px] md:gap-4">
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
