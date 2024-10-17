import { useShowController, useTranslate } from "react-admin";
import { SimpleTable } from "@/components/widgets/shared";
import { Loading } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { QuickShowDirections } from "./QuickShow/QuickShowDirections";
import { useGetDirectionsShowColumns } from "./Columns";
import { fetchMerchantDirections } from "./fetchMerchantDirections";

export interface DirectionsShowProps {
    id: string;
    type: string;
}

export const DirectionsShow = (props: DirectionsShowProps) => {
    const { id, type } = props;

    const context = useShowController<Directions.Direction>({ id });
    const translate = useTranslate();

    const { columns } = useGetDirectionsShowColumns();

    const [merchantDirections, setMerchantDirections] = useState<Directions.Direction[]>([]);

    useEffect(() => {
        async function refetch() {
            if (context) {
                setMerchantDirections(await fetchMerchantDirections({ context }));
            }
        }
        refetch();
    }, [context, context.record]);

    if (context.isLoading || !context.record) {
        return <Loading />;
    }

    if (type === "compact") {
        return <QuickShowDirections context={context} />;
    } else {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <TextField label={translate("resources.direction.fields.id")} text={context.record.id} />
                <TextField label={translate("resources.direction.fields.name")} text={context.record.name} />
                <TextField
                    label={translate("resources.direction.fields.description")}
                    text={context.record.description ? context.record.description : ""}
                />

                <TextField
                    label={translate("resources.direction.fields.srcCurr")}
                    text={context.record.src_currency.code}
                />
                <TextField
                    label={translate("resources.direction.fields.destCurr")}
                    text={context.record.dst_currency.code}
                />
                <TextField
                    label={translate("resources.direction.fields.active")}
                    text={
                        context.record.active
                            ? translate("resources.direction.fields.stateActive")
                            : translate("resources.direction.fields.stateInactive")
                    }
                />

                <TextField label={translate("resources.direction.merchant")} text={context.record.merchant.name} />
                <TextField label={translate("resources.direction.provider")} text={context.record.provider.name} />
                <TextField label={translate("resources.direction.weight")} text={String(context.record.weight)} />

                <div className="col-span-1 sm:col-span-2 md:col-span-3">
                    <Label htmlFor="api_key" className="text-muted-foreground">
                        {translate("resources.direction.fields.api_key")}
                    </Label>
                    <Textarea
                        id="api_key"
                        value={
                            JSON.stringify(context.record.auth_data) || translate("resources.direction.pleaseCreate")
                        }
                        disabled
                        className="w-full h-40 disabled:cursor-default"
                    />
                </div>
                <div className="mt-5 w-full col-span-1 sm:col-span-2 md:col-span-3">
                    <small className="text-sm text-muted-foreground">
                        {translate("resources.direction.fields.merchantsDirections") + context.record.merchant.name}
                    </small>
                    <SimpleTable columns={columns} data={merchantDirections} />
                </div>
            </div>
        );
    }
};
