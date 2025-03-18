import { useSheets } from "@/components/providers/SheetProvider";
import { ShowButton } from "@/components/ui/Button";
import { LoadingBalance } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslate } from "react-admin";

export const useGetWalletsColumns = (data: Wallets.Wallet[], balances: Map<string, Wallets.WalletBalance>) => {
    const translate = useTranslate();
    const { openSheet } = useSheets();

    const handleOpenSheet = (id: string) => {
        openSheet("wallet", { id });
    };

    const columns: ColumnDef<Wallets.Wallet>[] = [
        {
            id: "type",
            accessorKey: "type",
            header: translate("resources.wallet.manage.fields.walletType")
        },
        {
            id: "address",
            accessorKey: "address",
            header: translate("resources.wallet.manage.fields.walletAddress"),
            cell: ({ row }) => {
                return (
                    <TextField
                        text={row.original.address ?? ""}
                        wrap
                        copyValue
                        lineClamp
                        linesCount={1}
                        minWidth="50px"
                        className="!text-green-50 dark:!text-green-40 hover:!text-green-40 dark:hover:!text-green-50 !cursor-pointer transition-all duration-300"
                        onClick={() => openSheet("wallet", { id: row.original.id })}
                    />
                );
            }
        },
        {
            id: "account_id",
            accessorKey: "account_id",
            header: translate("resources.wallet.manage.fields.accountNumber"),
            cell: ({ row }) => {
                return (
                    <TextField
                        text={row.original.account_id}
                        wrap
                        copyValue
                        lineClamp
                        linesCount={1}
                        minWidth="50px"
                        className="!text-green-50 dark:!text-green-40 hover:!text-green-40 dark:hover:!text-green-50 !cursor-pointer transition-all duration-300"
                        onClick={() => openSheet("account", { id: row.original.account_id })}
                    />
                );
            }
        },

        {
            id: "Balance",
            header: translate("resources.wallet.manage.fields.balance"),
            cell: ({ row }) => {
                return balances.get(row.original.id) ? (
                    <div className="flex flex-col items-left justify-center">
                        {balances.get(row.original.id)?.usdt_amount != 0 && (
                            <TextField text={`${balances.get(row.original.id)?.usdt_amount} USDT`} />
                        )}
                        {balances.get(row.original.id)?.trx_amount !== 0 && (
                            <TextField text={`${balances.get(row.original.id)?.trx_amount} TRX`} />
                        )}
                        {balances.get(row.original.id)?.usdt_amount === 0 &&
                            balances.get(row.original.id)?.trx_amount === 0 &&
                            "-"}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <LoadingBalance className="w-[15px] h-[15px] overflow-hidden" />
                    </div>
                );
            }
        },
        {
            id: "currency",
            accessorKey: "currency",
            header: translate("resources.wallet.manage.fields.currency"),
            cell: ({ row }) => {
                return <TextField text={row.original.currency} />;
            }
        },
        {
            id: "description",
            accessorKey: "description",
            header: translate("resources.wallet.manage.fields.descr"),
            cell: ({ row }) => {
                return (
                    <TextField text={row.original.description || ""} wrap lineClamp linesCount={1} minWidth="50px" />
                );
            }
        },
        {
            id: "actions",
            header: () => {
                return <div className="text-center">{translate("resources.wallet.manage.fields.more")}</div>;
            },
            cell: ({ row }) => {
                return (
                    <ShowButton
                        onClick={() => {
                            handleOpenSheet(row.original.id);
                        }}
                    />
                );
            }
        }
    ];
    return { columns };
};
