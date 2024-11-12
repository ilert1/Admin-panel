import { BooleanField } from "@/components/ui/boolean-field";
import { LoadingAlertDialog } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useDelete, useRefresh, useShowController, useTranslate } from "react-admin";
import { Button } from "@/components/ui/button";
import { UserEdit } from "../edit";
import { useToast } from "@/components/ui/use-toast";

const styles = ["bg-green-50", "bg-red-50", "bg-extra-2", "bg-extra-8"];
const translations = ["active", "frozen", "blocked", "deleted"];

export const UserShow = (props: { id: string; isBrief: boolean; onOpenChange: (state: boolean) => void }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [showEditUser, setShowEditUser] = useState(false);

    const translate = useTranslate();
    const { id, isBrief, onOpenChange } = props;
    const context = useShowController({ id, queryOptions: { refetchOnWindowFocus: false, refetchInterval: false } });
    const localIsBrief = isBrief || false;

    const { toast } = useToast();

    const [deleteOne] = useDelete();
    const refresh = useRefresh();

    const handleDelete = () => {
        const deleteElem = async () => {
            try {
                await deleteOne("users", {
                    id
                });
                onOpenChange(false);
                refresh();
                setDialogOpen(false);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: translate("resources.users.create.error"),
                    description: translate("resources.users.create.deleteError")
                });
            }
        };
        deleteElem();
    };

    if (context.isLoading || context.isFetching || !context.record) {
        return <LoadingAlertDialog />;
    }
    const index = context.record.state - 1;

    if (isBrief) {
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
                    <TextField
                        label={translate("resources.users.fields.shop_api_key")}
                        text={context.record.shop_api_key}
                        copyValue
                    />
                    <TextField label={translate("resources.users.fields.email")} text={context.record.email} />
                    <TextField
                        label={translate("resources.users.fields.shop_sign_key")}
                        text={context.record.shop_sign_key}
                        copyValue
                    />
                    <TextField
                        label={translate("resources.users.fields.currency")}
                        text={context.record.shop_currency}
                    />
                    <TextField
                        label={translate("resources.users.fields.shop_balance_key")}
                        text={context.record.shop_balance_key}
                        copyValue
                    />
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

                <Dialog open={showEditUser} onOpenChange={setShowEditUser}>
                    <DialogContent aria-describedby={undefined}>
                        <DialogHeader>
                            <DialogTitle>Edit user</DialogTitle>
                        </DialogHeader>

                        <UserEdit record={context.record} id={id} closeDialog={() => setShowEditUser(false)} />
                    </DialogContent>
                </Dialog>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="w-[253px] px-[24px] bg-muted">
                        <DialogHeader>
                            <DialogTitle className="text-center">
                                {translate("resources.users.deleteThisUser")}
                            </DialogTitle>
                            <DialogDescription />
                        </DialogHeader>
                        <DialogFooter>
                            <div className="flex justify-around gap-[35px] w-full">
                                <Button onClick={() => handleDelete()}>{translate("app.ui.actions.delete")}</Button>
                                <Button onClick={() => setDialogOpen(false)} className="!ml-0 px-3">
                                    {translate("app.ui.actions.cancel")}
                                </Button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        );
    } else {
        return (
            <div className={localIsBrief ? "grid  grid-cols-1 gap-4" : "grid  grid-cols-1 lg:grid-cols-2 gap-4"}>
                <div className="grid gap-5">
                    <TextField label={translate("resources.users.fields.name")} text={context.record.name} />
                    <TextField label={translate("resources.users.fields.login")} text={context.record.login} />
                    <TextField label={translate("resources.users.fields.email")} text={context.record.email} />
                    <TextField
                        label={translate("resources.users.fields.currency")}
                        text={context.record.shop_currency}
                    />
                    <TextField label={translate("resources.users.fields.id")} text={context.record.id} copyValue />
                    <TextField
                        label={translate("resources.users.fields.created_at")}
                        text={context.record.created_at}
                    />

                    <div className="flex gap-3 items-center">
                        <small className="text-sm text-muted-foreground">
                            {translate("resources.users.fields.active")}
                        </small>
                        {context.record.deleted_at ? <BooleanField value={false} /> : <BooleanField value={true} />}
                    </div>
                </div>
                <div className="grid gap-5">
                    <div className="max-w-96">
                        <TextField
                            label={translate("resources.users.fields.public_key")}
                            text={context.record.public_key}
                            copyValue
                        />
                    </div>
                    <TextField
                        label={translate("resources.users.fields.shop_api_key")}
                        text={context.record.shop_api_key}
                        copyValue
                    />
                    <TextField
                        label={translate("resources.users.fields.shop_sign_key")}
                        text={context.record.shop_sign_key}
                        copyValue
                    />
                    <TextField
                        label={translate("resources.users.fields.shop_balance_key")}
                        text={context.record.shop_balance_key}
                        copyValue
                    />
                </div>
            </div>
        );
    }
};
