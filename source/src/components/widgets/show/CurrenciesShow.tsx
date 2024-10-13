import { useShowController, useTranslate } from "react-admin";
import { Loading } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";

export const CurrenciesShow = (props: { id: string }) => {
    const translate = useTranslate();
    const context = useShowController({ id: props.id });

    if (context.isLoading || !context.record) {
        return <Loading />;
    } else {
        return (
            <div className="flex flex-col gap-2">
                <TextField label={translate("resources.currency.fields.currency")} text={context.record.id} />
                <TextField
                    label={translate("resources.currency.fields.type")}
                    text={
                        context.record.is_coin
                            ? translate("resources.currency.fields.crypto")
                            : translate("resources.currency.fields.fiat")
                    }
                />
                <TextField label={translate("resources.currency.fields.symbol")} text={context.record.symbol} />
                <TextField
                    label={translate("resources.currency.fields.symbPos")}
                    text={
                        context.record.position === "before"
                            ? translate("resources.currency.fields.before")
                            : translate("resources.currency.fields.after")
                    }
                />
            </div>
        );
    }
};
