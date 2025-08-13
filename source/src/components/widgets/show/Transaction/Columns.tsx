import { Fee } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useSheets } from "@/components/providers/SheetProvider";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getStateByRole } from "@/helpers/getStateByRole";
import { useFetchDictionaries } from "@/hooks";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useMemo } from "react";
import { useLocaleState, usePermissions, useTranslate } from "react-admin";

export const useGetTransactionShowColumns = () => {
    const translate = useTranslate();
    const [locale] = useLocaleState();
    const { permissions } = usePermissions();
    const adminOnly = useMemo(() => permissions === "admin", [permissions]);
    const dataDictionaries = useFetchDictionaries();
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
                        `resources.transactions.${getStateByRole(permissions, dataDictionaries, row.original.state.state_int_ingress, row.original.state.state_int)}`
                    ) || ""
                );
            }
        },
        ...(adminOnly
            ? [
                  {
                      accessorKey: "state",
                      header: translate(
                          `resources.transactions.fields.state.${permissions !== "admin" ? "title" : "merchant_state"}`
                      ),
                      cell: ({ row }: { row: Row<Transaction.Transaction> }) => {
                          return (
                              <div className="min-w-28">
                                  {translate(
                                      `resources.transactions.${getStateByRole("merchant", dataDictionaries, row.original.state.state_int_ingress)}`
                                  ) || ""}
                              </div>
                          );
                      }
                  }
              ]
            : []),
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
            accessorKey: "state",
            header: translate("resources.transactions.stateUpdate.fields.state"),
            cell: ({ row }) => {
                return (
                    translate(
                        `resources.transactions.${getStateByRole(permissions, dataDictionaries, row.original.state.state_int_ingress, row.original.state.state_int)}`
                    ) || ""
                );
            }
        },
        ...(adminOnly
            ? [
                  {
                      accessorKey: "state",
                      header: translate(`resources.transactions.fields.state.title`),
                      cell: ({ row }: { row: Row<Transaction.TransactionStateUpdate> }) => {
                          return (
                              <div className="min-w-28">
                                  {translate(
                                      `resources.transactions.${getStateByRole("merchant", dataDictionaries, row.original.state.state_int_ingress)}`
                                  ) || ""}
                              </div>
                          );
                      }
                  }
              ]
            : []),
        {
            id: "amount",
            header: translate("resources.transactions.stateUpdate.fields.amount"),
            cell: ({ row }) => {
                const val = row.original.amount.value.quantity / row.original.amount.value.accuracy;
                return (
                    <div className="text-center">
                        <span>{val ? val + " " + row.original.amount.currency : "-"}</span>
                    </div>
                );
            }
        },
        {
            id: "provider",
            header: translate("resources.transactions.stateUpdate.fields.provider"),
            cell: ({ row }) => {
                return <TextField text={row.original.provider} />;
            }
        },
        {
            id: "external_id",
            header: translate("resources.transactions.stateUpdate.fields.external_id"),
            cell: ({ row }) => (
                <TextField text={row.original.external_id} copyValue wrap lineClamp linesCount={1} minWidth="50px" />
            )
        },
        {
            id: "external_status",
            header: translate("resources.transactions.stateUpdate.fields.external_status"),
            cell: ({ row }) => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <p className="cursor-default">{row.original.external_status}</p>
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
