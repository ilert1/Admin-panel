import { useSheets } from "@/components/providers/SheetProvider";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { useLocaleState, useTranslate } from "react-admin";

export const useGetAccountShowColumns = () => {
    const translate = useTranslate();
    const [locale] = useLocaleState();
    const { openSheet } = useSheets();

    const historyColumns: ColumnDef<AccountHistory>[] = [
        {
            id: "created_at",
            accessorKey: "created_at",
            header: translate("resources.transactions.fields.created_at"),
            cell: ({ row }) => {
                return (
                    <>
                        <p className="text-nowrap">{new Date(row?.original?.created_at).toLocaleDateString(locale)}</p>
                        <p className="text-nowrap text-neutral-70">
                            {new Date(row?.original?.created_at).toLocaleTimeString(locale)}
                        </p>
                    </>
                );
            }
        },
        {
            id: "updated_at",
            accessorKey: "updated_at",
            header: translate("resources.transactions.fields.updated_at"),
            cell: ({ row }) => {
                return (
                    <>
                        <p className="text-nowrap">{new Date(row?.original?.updated_at).toLocaleDateString(locale)}</p>
                        <p className="text-nowrap text-neutral-70">
                            {new Date(row?.original?.updated_at).toLocaleTimeString(locale)}
                        </p>
                    </>
                );
            }
        },
        {
            id: "transaction_id",
            accessorKey: "transaction_id",
            header: translate("resources.transactions.fields.id"),
            cell: ({ row }) => (
                <TextField
                    text={row.original.transaction_id ?? ""}
                    copyValue
                    wrap
                    lineClamp
                    linesCount={1}
                    minWidth="50px"
                    className="mb-[4px] h-auto p-0 text-green-50 underline outline-none transition-colors hover:text-green-40 focus-visible:text-neutral-60 active:text-green-60 dark:text-green-40 dark:hover:text-green-50 dark:focus-visible:text-neutral-70 dark:active:text-green-20"
                    onClick={
                        row.original.transaction_id
                            ? () => {
                                  openSheet("transaction", { id: row.original.transaction_id });
                              }
                            : undefined
                    }
                />
            )
        },
        /* {
            id: "account_id",
            accessorKey: "account_id",
            header: translate("resources.transactions.fields.account_id"),
            cell: ({ row }) => row.original.account_id
        }, */
        {
            id: "account_balance",
            accessorKey: "account_balance",
            header: translate("resources.transactions.fields.accountBalance"),
            cell: ({ row }) => <TextField text={row.original.account_balance} />
        },
        {
            id: "amount_value",
            accessorKey: "amount_value",
            header: translate("resources.transactions.fields.amount_value"),
            cell: ({ row }) => <TextField text={row.original.amount_value} />
        },
        {
            id: "amount_currency",
            accessorKey: "amount_currency",
            header: translate("resources.transactions.fields.currency"),
            cell: ({ row }) => <TextField text={row.original.amount_currency} />
        }
    ];

    return { historyColumns };
};
