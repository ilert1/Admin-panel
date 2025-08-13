import { useSheets } from "@/components/providers/SheetProvider";
import { ShowButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { useGetMerchantData } from "@/hooks/useGetMerchantData";
import { getStateByRole } from "@/helpers/getStateByRole";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useLocaleState, usePermissions, useTranslate } from "react-admin";
import { useFetchDictionaries } from "@/hooks";
import { useMemo } from "react";

export type MerchantTypeToShow = "fees" | "directions" | undefined;

export const useGetTransactionColumns = () => {
    const translate = useTranslate();
    const [locale] = useLocaleState();
    const { getMerchantId, isMerchantsLoading } = useGetMerchantData();
    const { permissions } = usePermissions();
    const adminOnly = useMemo(() => permissions === "admin", [permissions]);
    const data = useFetchDictionaries();
    const { openSheet } = useSheets();

    const handleOpenSheet = (id: string) => {
        openSheet("transaction", { id });
    };

    const columns: ColumnDef<Transaction.TransactionView>[] = [
        {
            accessorKey: "created_at",
            header: translate("resources.transactions.fields.createdAt"),
            cell: ({ row }) => (
                <>
                    <p className="text-nowrap">{new Date(row.original.created_at).toLocaleDateString(locale)}</p>
                    <p className="text-nowrap text-neutral-70">
                        {new Date(row.original.created_at).toLocaleTimeString(locale)}
                    </p>
                </>
            )
        },
        {
            accessorKey: "id",
            header: translate("resources.transactions.fields.id"),
            cell: ({ row }) => (
                <TextField
                    text={row.original.id}
                    wrap
                    copyValue
                    lineClamp
                    linesCount={1}
                    minWidth="50px"
                    className="!cursor-pointer !text-green-50 transition-all duration-300 hover:!text-green-40 dark:!text-green-40 dark:hover:!text-green-50"
                    onClick={() => handleOpenSheet(row.original.id)}
                />
            ),
            filterFn: "includesString"
        },
        {
            accessorKey: "meta.customer_data.customer_id",
            header: translate("resources.transactions.fields.meta.customer_id"),
            cell: ({ row }) => {
                return (
                    <TextField
                        text={row.original.customer_id}
                        wrap
                        copyValue
                        lineClamp
                        linesCount={1}
                        minWidth="50px"
                    />
                );
            }
        },
        {
            accessorKey: "meta.customer_data.customer_payment_id",
            header: translate("resources.transactions.fields.meta.customer_payment_id"),
            cell: ({ row }) => (
                <TextField
                    text={row.original.customer_payment_id}
                    wrap
                    copyValue
                    lineClamp
                    linesCount={1}
                    minWidth="50px"
                />
            )
        },
        ...(adminOnly
            ? [
                  {
                      header: translate("resources.withdraw.fields.merchant"),
                      cell: ({ row }: { row: Row<Transaction.TransactionView> }) => {
                          const merchantName = row.original.participant_name ?? "";
                          const id = getMerchantId(row.original.participant_id);

                          return (
                              <div>
                                  <TextField
                                      text={row.original.participant_name ?? ""}
                                      onClick={id ? () => openSheet("merchant", { id, merchantName }) : undefined}
                                  />
                                  <TextField
                                      className="text-neutral-70"
                                      text={row.original.participant_id}
                                      wrap
                                      copyValue
                                      lineClamp
                                      linesCount={1}
                                      minWidth="50px"
                                  />
                              </div>
                          );
                      }
                  }
              ]
            : []),
        {
            accessorKey: "type",
            header: translate("resources.transactions.fields.type"),
            cell: ({ row }) => translate(`resources.transactions.types.${row.original.type_text.toLowerCase()}`) || ""
        },
        {
            accessorKey: "state",
            header: translate("resources.transactions.fields.state.title"),
            cell: ({ row }) => (
                <div className="min-w-28">
                    {translate(
                        `resources.transactions.${getStateByRole(permissions, data, row.original.state_id_merchant, row.original.state_id)}`
                    ) || ""}
                </div>
            )
        },
        ...(adminOnly
            ? [
                  {
                      accessorKey: "state",
                      header: translate(
                          `resources.transactions.fields.state.${adminOnly ? "title" : "merchant_state"}`
                      ),
                      cell: ({ row }: { row: Row<Transaction.TransactionView> }) => {
                          return (
                              <div className="min-w-28">
                                  {translate(
                                      `resources.transactions.${getStateByRole("merchant", data, row.original.state_id_merchant, row.original.state_id)}`
                                  ) || ""}
                              </div>
                          );
                      }
                  }
              ]
            : []),
        {
            accessorKey: "sourceValue",
            header: translate("resources.transactions.fields.sourceValue"),
            cell: ({ row }) => {
                return `${row.original.source_amount_value} ${row.original.source_amount_currency || ""}`;
            }
        },
        {
            accessorKey: "destValue",
            header: translate("resources.transactions.fields.destValue"),
            cell: ({ row }) => {
                return `${row.original.destination_amount_value} ${row.original.destination_amount_currency || ""}`;
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return <ShowButton onClick={() => handleOpenSheet(row.original.id)} />;
            }
        }
    ];

    return {
        columns,
        isMerchantsLoading
    };
};
