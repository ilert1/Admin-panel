import { fetchUtils, useDataProvider, useShowController, useTranslate } from "react-admin";
import { useQuery } from "react-query";
import { SimpleTable } from "@/components/widgets/shared";
import { ColumnDef } from "@tanstack/react-table";
import { Loading } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_ENIGMA_URL;

export const DirectionsShow = (props: { id: string }) => {
    const dataProvider = useDataProvider();
    const { data } = useQuery(["dictionaries"], () => dataProvider.getDictionaries());
    const translate = useTranslate();
    const context = useShowController({ id: props.id });
    const [merchantDirections, setMerchantDirections] = useState([]);

    useEffect(() => {
        const fetchMerchantDirections = async () => {
            try {
                const { json } = await fetchUtils.fetchJson(
                    `${API_URL}/direction/merchant/${context?.record.merchant.id}`,
                    {
                        user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` },
                        cache: "no-cache"
                    }
                );

                setMerchantDirections(json.data);
            } catch (error) {
                console.error("Failed to fetch merchant directions:", error);
            }
        };

        if (context.record) {
            fetchMerchantDirections();
        }
    }, [context.record]);
    console.log(merchantDirections);

    const columns: ColumnDef<Direction>[] = [
        {
            id: "id",
            accessorKey: "id",
            header: translate("resources.directions.fields.id")
        },
        {
            id: "name",
            accessorKey: "name",
            header: translate("resources.directions.fields.name")
        },
        {
            id: "active",
            accessorKey: "active",
            header: translate("resources.directions.fields.active"),
            cell: ({ row }) => {
                return (
                    <TextField
                        text={
                            row.getValue("active")
                                ? translate("resources.directions.fields.stateActive")
                                : translate("resources.directions.fields.stateInactive")
                        }
                    />
                );
            }
        },
        {
            id: "src_currency",
            accessorKey: "src_currency",
            header: translate("resources.directions.fields.srcCurr"),
            cell: ({ row }) => {
                const obj: Omit<Currencies.Currency, "id"> = row.getValue("src_currency");
                return <TextField text={obj.code} />;
            }
        },
        {
            id: "dst_currency",
            accessorKey: "dst_currency",
            header: translate("resources.directions.fields.destCurr"),
            cell: ({ row }) => {
                console.log(row);
                const obj: Omit<Currencies.Currency, "id"> = row.getValue("dst_currency");
                return <TextField text={obj.code} />;
            }
        },
        {
            id: "merchant",
            accessorKey: "merchant",
            header: translate("resources.directions.fields.merchant"),
            cell: ({ row }) => {
                const obj: Merchant = row.getValue("merchant");
                return <TextField text={obj.name} />;
            }
        },
        {
            id: "provider",
            accessorKey: "provider",
            header: translate("resources.directions.provider"),
            cell: ({ row }) => {
                const obj: Provider = row.getValue("provider");
                return <TextField text={obj.name} />;
            }
        },
        {
            id: "weight",
            accessorKey: "weight",
            header: translate("resources.directions.weight")
        }
    ];

    console.log(context?.record.weight);
    if (context.isLoading || !context.record) {
        return <Loading />;
    } else {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <TextField label={translate("resources.directions.fields.id")} text={context.record.id} />
                <TextField label={translate("resources.directions.fields.name")} text={context.record.name} />
                <TextField
                    label={translate("resources.directions.fields.description")}
                    text={context.record.description}
                />

                <TextField
                    label={translate("resources.directions.fields.srcCurr")}
                    text={context.record.src_currency.code}
                />
                <TextField
                    label={translate("resources.directions.fields.destCurr")}
                    text={context.record.dst_currency.code}
                />
                <TextField
                    label={translate("resources.directions.fields.active")}
                    text={
                        context.record.active
                            ? translate("resources.directions.fields.stateActive")
                            : translate("resources.directions.fields.stateInactive")
                    }
                />

                <TextField label={translate("resources.directions.merchant")} text={context.record.merchant.name} />
                <TextField label={translate("resources.directions.provider")} text={context.record.provider.name} />
                <TextField label={translate("resources.directions.weight")} text={String(context.record.weight)} />

                <div className="col-span-1 sm:col-span-2 md:col-span-3">
                    <Label htmlFor="api_key" className="text-muted-foreground">
                        {translate("resources.directions.fields.api_key")}
                    </Label>
                    <Textarea
                        id="api_key"
                        value={context.record.auth_data.api_key || translate("resources.providers.pleaseCreate")}
                        disabled
                        className="w-full h-40 disabled:cursor-default"
                    />
                </div>
                <div className="mt-5 w-full col-span-1 sm:col-span-2 md:col-span-3">
                    <small className="text-sm text-muted-foreground">
                        {translate("resources.directions.fields.merchantsDirections") + context.record.merchant.name}
                    </small>
                    <SimpleTable columns={columns} data={merchantDirections} />
                </div>
            </div>
        );
    }
};
