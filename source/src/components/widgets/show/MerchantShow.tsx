import { useShowController, useTranslate } from "react-admin";
import { Loading } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";

export const MerchantShow = (props: { id: string }) => {
    const translate = useTranslate();
    const context = useShowController({ id: props.id });

    if (context.isLoading || !context.record) {
        return <Loading />;
    } else {
        return (
            <div className="flex flex-col gap-2">
                <TextField label={translate("resources.merchant.fields.id")} text={context.record.id} />
                <TextField label={translate("resources.merchant.fields.name")} text={context.record.name} />
                <TextField label={translate("resources.merchant.fields.descr")} text={context.record.description} />
                <TextField label={"Keycloak ID"} text={context.record.keycloak_id} />
            </div>
        );
    }
};
