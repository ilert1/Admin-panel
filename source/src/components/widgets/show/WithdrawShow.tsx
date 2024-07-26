import { useShowController, useTranslate } from "react-admin";
import { TextField } from "@/components/ui/text-field";
import { RotatingLines } from "react-loader-spinner";
import { Loading } from "@/components/ui/loading";

export const WithdrawShow = (props: { id: string }) => {
    const translate = useTranslate();

    const context = useShowController({ id: props.id });

    if (context.isLoading || context.isFetching || !context.record) {
        return <Loading />;
    } else {
        return (
            <div className="relative w-[540] overflow-x-auto flex flex-col gap-2">
                <TextField label={translate("resources.withdraw.fields.id")} text={context.record.id} copyValue />
                <TextField label={translate("resources.withdraw.fields.created_at")} text={context.record.created_at} />
                <TextField
                    label={translate("resources.withdraw.fields.destination.id")}
                    text={context.record.destination.id}
                    copyValue
                />
                <TextField
                    label={translate("resources.withdraw.fields.payload.hash")}
                    text={context.record.payload.hash}
                />
                <TextField
                    type="link"
                    label={translate("resources.withdraw.fields.payload.hash_link")}
                    text={context.record.payload.hash_link}
                />
                <TextField
                    label={translate("resources.withdraw.fields.destination.amount.value")}
                    text={(
                        (context.record.destination.amount.value.quantity || 0) /
                        context.record.destination.amount.value.accuracy
                    ).toFixed(Math.log10(context.record.destination.amount.value.accuracy))}
                />
                <TextField
                    label={translate("resources.withdraw.fields.destination.amount.currency")}
                    text={context.record.destination.amount.currency}
                />
            </div>
        );
    }
};
