import { useDataProvider, useShowController, useTranslate } from "react-admin";
import { useQuery } from "react-query";
import { SimpleTable } from "@/components/widgets/shared";
import { ColumnDef } from "@tanstack/react-table";
import { Loading } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";

export const MerchantShow = (props: { id: string }) => {
    const dataProvider = useDataProvider();
    const { data } = useQuery(["dictionaries"], () => dataProvider.getDictionaries());
    const translate = useTranslate();
    const context = useShowController({ id: props.id });

    if (context.isLoading || !context.record) {
        return <Loading />;
    } else {
        return (
            <div className="flex flex-col gap-2">
                <TextField label={translate("resources.merchants.fields.id")} text={context.record.id} />
                <TextField label={translate("resources.merchants.fields.name")} text={context.record.name} />
                <TextField label={translate("resources.merchants.fields.descr")} text={context.record.description} />
                <TextField label={"Keycloak ID"} text={context.record.keycloak_id} />
            </div>
        );
    }
};
