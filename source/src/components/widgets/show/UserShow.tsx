import { BooleanFiled } from "@/components/ui/boolean-field";
import { TextField } from "@/components/ui/text-field";
import { useShowController, useTranslate } from "react-admin";

export const UserShow = (props: { id: string }) => {
    const translate = useTranslate();

    const context = useShowController({ id: props.id });

    if (context.isLoading || context.isFetching || !context.record) {
        return "Loading...";
    } else {
        return (
            <div className="relative w-[540] overflow-x-auto flex flex-col gap-2">
                <TextField label={translate("resources.users.fields.name")} text={context.record.name} />
                <TextField label={translate("resources.users.fields.id")} text={context.record.id} copyValue />
                <TextField label={translate("resources.users.fields.created_at")} text={context.record.created_at} />

                <div className="flex gap-3 items-center">
                    <small className="text-sm text-muted-foreground">
                        {translate("resources.users.fields.active")}
                    </small>
                    {context.record.deleted_at ? <BooleanFiled value={false} /> : <BooleanFiled value={true} />}
                </div>

                <TextField
                    label={translate("resources.users.fields.public_key")}
                    text={context.record.public_key}
                    copyValue
                />
            </div>
        );
    }
};
