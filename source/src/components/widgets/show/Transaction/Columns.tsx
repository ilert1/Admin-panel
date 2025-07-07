import { Fee } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useSheets } from "@/components/providers/SheetProvider";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { ColumnDef } from "@tanstack/react-table";
import { useLocaleState, useTranslate } from "react-admin";

export const useGetTransactionShowColumns = () => {
    const translate = useTranslate();
    const [locale] = useLocaleState();
    const dataDictionaries = fetchDictionaries();
    const { openSheet } = useSheets();

    function computeValue(quantity: number | undefined, accuracy: number | undefined) {
        if (quantity && accuracy) {
            const value = (quantity || 0) / accuracy;
            if (isNaN(value)) return "-";
            return value.toFixed(Math.log10(accuracy));
        }

        return "-";
    }

    const feesColumns: ColumnDef<Fee>[] = [
        {
            id: "recipient",
            accessorKey: "recipient",
            header: translate("resources.transactions.fields.recipient")
        },
        {
            id: "type",
            accessorKey: "type",
            header: translate("resources.transactions.fields.feeType"),
            cell: ({ row }) =>
                translate(
                    `resources.transactions.types.${dataDictionaries?.feeTypes[
                        row.original.type
                    ]?.type_descr.toLowerCase()}`
                ) || ""
        },
        {
            id: "value",
            accessorKey: "value",
            header: translate("resources.transactions.fields.feeValue"),
            cell: ({ row }) =>
                `${computeValue(row.original.value.quantity, row.original.value.accuracy)} ${row.original.currency}`
        }
    ];

    const briefHistory: ColumnDef<Transaction.Transaction>[] = [
        {
            id: "createdAt",
            accessorKey: "created_at",
            header: translate("resources.transactions.fields.created_at"),
            cell: ({ row }) => {
                return (
                    <>
                        <p className="text-nowrap">{new Date(row.original.created_at).toLocaleDateString(locale)}</p>
                        <p className="text-nowrap text-neutral-70">
                            {new Date(row.original.created_at).toLocaleTimeString(locale)}
                        </p>
                    </>
                );
            }
        },
        {
            id: "type",
            accessorKey: "type",
            header: translate("resources.transactions.fields.type"),
            cell: ({ row }) =>
                translate(
                    `resources.transactions.types.${dataDictionaries?.transactionTypes[
                        row.original.type
                    ]?.type_descr.toLowerCase()}`
                ) || ""
        },
        {
            id: "state",
            accessorKey: "state",
            header: translate("resources.transactions.fields.state.title"),
            cell: ({ row }) => {
                return (
                    translate(
                        `resources.transactions.states.${row.original.state?.state_description?.toLowerCase()}`
                    ) || ""
                );
            }
        },
        {
            id: "source_amount",
            header: translate("resources.transactions.fields.source.amount.sendAmount"),
            cell: ({ row }) => {
                const val = row.original.source.amount.value.quantity / row.original.source.amount.value.accuracy;
                return (
                    <div className="text-center">
                        <span>{val ? val + " " + row.original.source.amount.currency : "-"}</span>
                    </div>
                );
            }
        },
        {
            id: "destination_amount",
            header: translate("resources.transactions.fields.destination.amount.getAmount"),
            cell: ({ row }) => {
                const val =
                    row.original.destination.amount.value.quantity / row.original.destination.amount.value.accuracy;
                return (
                    <div className="text-center">
                        <span>{val ? val + " " + row.original.destination.amount.currency : "-"}</span>
                    </div>
                );
            }
        }
    ];

    const stateUpdateColumns: ColumnDef<Transaction.TransactionStateUpdate>[] = [
        {
            id: "id",
            accessorKey: "id",
            header: translate("resources.transactions.stateUpdate.fields.id"),
            cell: ({ row }) => (
                <TextField text={row.original.id} copyValue wrap lineClamp linesCount={1} minWidth="50px" />
            )
        },
        {
            id: "state",
            header: translate("resources.transactions.stateUpdate.fields.state"),
            cell: ({ row }) => <TextField text={row.original.state.state_description} />
        },
        {
            id: "amount",
            header: translate("resources.transactions.stateUpdate.fields.amount"),
            cell: ({ row }) => (
                <TextField
                    text={`${computeValue(row.original.amount.value.quantity, row.original.amount.value.accuracy)} ${row.original.amount.currency}`}
                />
            )
        },
        {
            id: "provider",
            header: translate("resources.transactions.stateUpdate.fields.provider"),
            cell: ({ row }) => {
                return (
                    <Button
                        variant={"resourceLink"}
                        onClick={() => {
                            openSheet("provider", {
                                id: row.original.provider
                            });
                        }}>
                        {row.original.provider}
                    </Button>
                );
            }
        },
        {
            id: "external_id",
            header: translate("resources.transactions.stateUpdate.fields.external_id"),
            cell: ({ row }) => <TextField text={row.original.external_id} />
        },
        {
            id: "external_status",
            header: translate("resources.transactions.stateUpdate.fields.external_status"),
            cell: ({ row }) => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <TextField text={row.original.external_status} />
                        </TooltipTrigger>

                        <TooltipContent>{row.original.external_status_details}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        },
        {
            id: "callback_id",
            header: translate("resources.transactions.stateUpdate.fields.callback_id"),
            cell: ({ row }) => {
                return (
                    <Button
                        variant={"resourceLink"}
                        onClick={() => {
                            openSheet("callbridgeHistory", {
                                id: row.original.callback_id
                            });
                        }}>
                        {row.original.callback_id}
                    </Button>
                );
            }
        }
    ];

    return { feesColumns, briefHistory, stateUpdateColumns };
};
