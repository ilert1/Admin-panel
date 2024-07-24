import { BooleanFiled } from "@/components/ui/boolean-field";
import { TextField } from "@/components/ui/text-field";
import { useTranslate } from "react-admin";

export const UserShow = (props: { user: Users.User }) => {
    const translate = useTranslate();

    return (
        <div className="relative w-[540] overflow-x-auto flex flex-col gap-2">
            <TextField label={translate("resources.users.fields.name")} text={props.user.name} />
            <TextField label={translate("resources.users.fields.id")} text={props.user.id} copyValue />
            <TextField label={translate("resources.users.fields.created_at")} text={props.user.created_at} />

            <div className="flex gap-3 items-center">
                <small className="text-sm text-muted-foreground">{translate("resources.users.fields.active")}</small>
                {props.user.deleted_at ? <BooleanFiled value={false} /> : <BooleanFiled value={true} />}
            </div>
        </div>
    );
};
