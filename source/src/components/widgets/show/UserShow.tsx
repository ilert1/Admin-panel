import { BooleanField } from "@/components/ui/boolean-field";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { useShowController, useTranslate } from "react-admin";

export const UserShow = (props: { id: string; isBrief: boolean }) => {
    const translate = useTranslate();
    const { id, isBrief } = props;
    const context = useShowController({ id });
    const localIsBrief = isBrief || false;

    if (context.isLoading || context.isFetching || !context.record) {
        return <Loading />;
    }
    if (isBrief) {
        return (
            <div>
                <div className="px-[42px] pb-[25px] flex justify-between">
                    <TextField text={id} copyValue />
                    <div className="flex items-center justify-center text-white">
                        {context.record.deleted_at ? (
                            <span className="px-3 py-0.5 bg-red-50 rounded-20 font-normal text-base text-center">
                                {translate("resources.users.fields.activeStateFalse")}
                            </span>
                        ) : (
                            <span className="px-3 py-0.5 bg-green-50 rounded-20 font-normal text-base text-center">
                                {translate("resources.users.fields.activeStateTrue")}
                            </span>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-2 px-[42px] gap-y-6 pb-[24px]">
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
                <div className="flex justify-end gap-4 px-[42px]">
                    <Button className="text-title-1">{translate("resources.users.edit")}</Button>
                    <Button
                        variant={"outline"}
                        className="border-[1px] border-neutral-50 text-neutral-50 bg-transparent">
                        {translate("resources.users.delete")}
                    </Button>
                </div>
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
