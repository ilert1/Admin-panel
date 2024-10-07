import { useDataProvider, useShowController, useTranslate, useGetManyReference, usePermissions } from "react-admin";
import { useQuery } from "react-query";
import { SimpleTable } from "@/components/widgets/shared";
import { ColumnDef } from "@tanstack/react-table";
import { BooleanField } from "@/components/ui/boolean-field";
import { TextField } from "@/components/ui/text-field";
import { useEffect, useMemo, useState } from "react";
import { LoadingAlertDialog } from "@/components/ui/loading";
import { TableTypes } from "../shared/SimpleTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const TransactionShow = (props: { id: string; type?: "compact" }) => {
    const dataProvider = useDataProvider();
    const { data } = useQuery(["dictionaries"], () => dataProvider.getDictionaries());
    const translate = useTranslate();
    const { permissions, isLoading } = usePermissions();
    const context = useShowController({ id: props.id });

    const [newState, setNewState] = useState("");

    const trnId = useMemo<string>(() => context.record?.id, [context]);

    const { data: history } = useGetManyReference("transactions", {
        target: "id",
        id: trnId
    });

    function computeValue(quantity: number, accuracy: number) {
        const value = (quantity || 0) / accuracy;
        if (isNaN(value)) return "-";
        return value.toFixed(Math.log10(accuracy));
    }

    const feesColumns: ColumnDef<Transaction.Fee>[] = [
        {
            id: "recipient",
            accessorKey: "id",
            header: translate("resources.transactions.fields.recipient")
        },
        {
            id: "type",
            accessorKey: "type",
            header: translate("resources.transactions.fields.type"),
            cell: ({ row }) => data?.feeTypes[row.original.type]?.type_descr || ""
        },
        {
            id: "currency",
            accessorKey: "currency",
            header: translate("resources.transactions.fields.currency")
        },
        {
            id: "value",
            accessorKey: "value",
            header: translate("resources.transactions.fields.value"),
            cell: ({ row }) => computeValue(row.original.value.quantity, row.original.value.accuracy)
        }
    ];

    const historyColumns: ColumnDef<Transaction.Fee>[] = [
        {
            id: "id",
            accessorKey: "id",
            header: translate("resources.transactions.fields.id")
        },
        {
            id: "createdAt",
            accessorKey: "created_at",
            header: translate("resources.transactions.fields.created_at")
        },
        {
            id: "type",
            accessorKey: "type",
            header: translate("resources.transactions.fields.type"),
            cell: ({ row }) => data?.transactionTypes[row.original.type]?.type_descr || ""
        },
        {
            id: "state",
            accessorKey: "state.state_description",
            header: translate("resources.transactions.fields.state.title")
        },
        {
            id: "final",
            accessorKey: "state.final",
            header: translate("resources.transactions.fields.state.final")
        },
        {
            id: "committed",
            accessorKey: "committed",
            header: translate("resources.transactions.fields.committed")
        },
        {
            id: "dispute",
            accessorKey: "dispute",
            header: translate("resources.transactions.fields.dispute")
        },
        {
            id: "external_status",
            accessorKey: "meta.external_status",
            header: translate("resources.transactions.fields.meta.external_status")
        }
    ];
    const briefHistory = historyColumns.slice(0, 5);
    useEffect(() => {
        setNewState(context?.record?.state.state_description);
    }, [context?.record?.state.state_description]);

    if (context.isLoading || context.isFetching || !context.record || isLoading) {
        return <LoadingAlertDialog />;
    } else if (props.type === "compact") {
        console.log(newState);
        return (
            <div className="p-[42px] pt-0 flex flex-col gap-6 top-[82px] overflow-auto">
                {permissions === "admin" && (
                    <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <span>{translate("resources.transactions.fields.state.state_description")}</span>
                            <Select value={newState} onValueChange={setNewState}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Theme" />
                                </SelectTrigger>
                                <SelectContent className="bg-neutral-0">
                                    <SelectItem value="Created">Created</SelectItem>
                                    <SelectItem value="Processing">Processing</SelectItem>
                                    <SelectItem value="Fail">Fail</SelectItem>
                                    <SelectItem value="Success">Success</SelectItem>
                                    <SelectItem value="FromOutside">FromOutside</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button>{translate("app.ui.actions.save")}</Button>
                        </div>
                        <div className="flex gap-6">
                            <Button>{translate("resources.transactions.show.openDispute")}</Button>
                            <Button variant={"secondary"}>{translate("resources.transactions.show.commit")}</Button>
                        </div>
                    </div>
                )}
                <div className="flex gap-6">
                    <div className="flex flex-col">
                        <span className="opacity-60 text-title-1">
                            {translate("resources.transactions.fields.type")}
                        </span>
                        <span>{data?.transactionTypes[context.record.type]?.type_descr}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="opacity-60 text-title-1">
                            {translate("resources.transactions.fields.state.state_description")}
                        </span>
                        <span>{context.record.state.state_description}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="opacity-60 text-title-1">
                            {translate("resources.transactions.fields.destination.header")}
                        </span>
                        <span>{context.record.destination.meta?.caption}</span>
                    </div>
                </div>
                <SimpleTable columns={briefHistory} data={history ? history : []} tableType={TableTypes.COLORED} />
                <div className="flex flex-col gap-2 min-h-[100px]">
                    <span>{translate("resources.transactions.fields.fees")}</span>
                    <SimpleTable columns={feesColumns} data={context.record.fees} tableType={TableTypes.COLORED} />
                </div>
            </div>
        );
    } else {
        return (
            <div className="relative w-[540] overflow-x-auto flex flex-col gap-2">
                <div className={"flex flex-row flex-wrap justify-between gap-2"}>
                    <div className="flex flex-col gap-2">
                        <TextField
                            label={translate("resources.transactions.fields.id")}
                            text={context.record.id}
                            copyValue
                        />
                        <TextField
                            label={translate("resources.transactions.fields.meta.customer_id")}
                            text={context.record.meta.customer_id}
                        />
                        <TextField
                            label={translate("resources.transactions.fields.meta.customer_payment_id")}
                            text={context.record.meta.customer_payment_id}
                            copyValue
                        />
                        <TextField
                            label={translate("resources.transactions.fields.type")}
                            text={data?.transactionTypes[context.record.type]?.type_descr}
                        />
                        <TextField
                            label={translate("resources.transactions.fields.state.state_description")}
                            text={context.record.state.state_description}
                        />
                        <BooleanField
                            value={context.record.state.final}
                            label={translate("resources.transactions.fields.state.final")}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-muted-foreground mt-5">
                            {translate("resources.transactions.fields.source.header")}
                        </h3>
                        <TextField
                            label={translate("resources.transactions.fields.source.meta.caption")}
                            text={context.record.source.meta?.caption}
                        />
                        <TextField
                            label={translate("resources.transactions.fields.source.amount.value")}
                            text={computeValue(
                                context.record.source.amount.value.quantity,
                                context.record.source.amount.value.accuracy
                            )}
                        />
                        <TextField
                            label={translate("resources.transactions.fields.source.amount.currency")}
                            text={context.record.source.amount.currency}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-muted-foreground mt-5">
                            {translate("resources.transactions.fields.destination.header")}
                        </h3>
                        <TextField
                            label={translate("resources.transactions.fields.destination.meta.caption")}
                            text={context.record.destination.meta?.caption}
                        />
                        <TextField
                            label={translate("resources.transactions.fields.destination.amount.value")}
                            text={computeValue(
                                context.record.destination.amount.value.quantity,
                                context.record.destination.amount.value.accuracy
                            )}
                        />
                        <TextField
                            label={translate("resources.transactions.fields.destination.amount.currency")}
                            text={context.record.destination.amount.currency}
                        />
                    </div>
                </div>
                <div className="mt-5">
                    <small className="text-sm text-muted-foreground">
                        {translate("resources.transactions.fields.fees")}
                    </small>
                    <SimpleTable columns={feesColumns} data={context.record.fees} />
                </div>
                {history && history?.length > 0 && (
                    <div className="mt-5">
                        <small className="text-sm text-muted-foreground">
                            {translate("resources.transactions.fields.history")}
                        </small>
                        <SimpleTable columns={historyColumns} data={history} />
                    </div>
                )}
            </div>
        );
    }
};
