import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef, Row } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { useLocaleState, usePermissions, useTranslate } from "react-admin";

export type MerchantTypeToShow = "fees" | "directions" | undefined;

export const useGetTransactionColumns = () => {
    const translate = useTranslate();
    const [locale] = useLocaleState();
    const { permissions } = usePermissions();

    // const [chartOpen, setChartOpen] = useState(false)
    const [showOpen, setShowOpen] = useState(false);
    const [showTransactionId, setShowTransactionId] = useState<string>("");

    const openSheet = (id: string) => {
        setShowTransactionId(id);
        setShowOpen(true);
    };

    const columns: ColumnDef<Transaction.TransactionView>[] = [
        {
            accessorKey: "created_at",
            header: translate("resources.transactions.fields.createdAt"),
            cell: ({ row }) => (
                <>
                    <p className="text-nowrap">{new Date(row.original.created_at).toLocaleDateString(locale)}</p>
                    <p className="text-nowrap">{new Date(row.original.created_at).toLocaleTimeString(locale)}</p>
                </>
            )
        },
        {
            accessorKey: "id",
            header: translate("resources.transactions.fields.id"),
            cell: ({ row }) => (
                <TextField text={row.original.id} wrap copyValue lineClamp linesCount={1} minWidth="50px" />
            ),
            filterFn: "includesString"
        },
        {
            accessorKey: "meta.customer_data.customer_id",
            header: translate("resources.transactions.fields.meta.customer_id"),
            cell: ({ row }) => {
                return <TextField text={row.original.customer_id} wrap />;
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
        ...(permissions === "admin"
            ? [
                  {
                      header: translate("resources.withdraw.fields.merchant"),
                      cell: ({ row }: { row: Row<Transaction.TransactionView> }) => {
                          return (
                              <div>
                                  <TextField text={row.original.participant_name} wrap />
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
            cell: ({ row }) => translate(`resources.transactions.states.${row.original.state_text.toLowerCase()}`) || ""
        },
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
            accessorKey: "rate_info",
            header: translate("resources.transactions.fields.rateInfo"),
            cell: ({ row }) => (
                <>
                    <p className="text-neutral-60 dark:text-neutral-70">{`${row.original.rate_source_currency} / ${row.original.rate_destination_currency}:`}</p>
                    <p>{row.original.rate}</p>
                </>
            )
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <Button onClick={() => openSheet(row.original.id)} variant="text_btn" className="w-full p-0">
                        <span className="sr-only">Open menu</span>
                        <EyeIcon className="text-green-50 size-7" />
                    </Button>
                );
            }
        }
    ];

    return {
        columns,
        showOpen,
        setShowOpen,
        showTransactionId
    };
};
