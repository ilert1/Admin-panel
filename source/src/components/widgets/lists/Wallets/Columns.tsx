import { useSheets } from "@/components/providers/SheetProvider";
import { ShowButton } from "@/components/ui/Button";
import { LoadingBalance, LoadingBlock } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslate } from "react-admin";
import { useDataProvider } from "react-admin";
import { useQuery } from "@tanstack/react-query";

export const useGetWalletsColumns = (data: Wallets.Wallet[], balances: Map<string, Wallets.WalletBalance>) => {
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const { openSheet } = useSheets();

    const handleOpenSheet = (id: string) => {
        openSheet("wallet", { id });
    };
    const { data: accountsData, isLoading: isAccountsLoading } = useQuery({
        queryKey: ["accounts", "getListWithoutPagination"],
        queryFn: async ({ signal }) =>
            await dataProvider.getList("accounts", {
                pagination: { perPage: 10000, page: 1 },
                filter: { sort: "name", asc: "ASC" },
                signal
            }),
        select: data => data?.data
    });
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
                        className="!cursor-pointer !text-green-50 transition-all duration-300 hover:!text-green-40 dark:!text-green-40 dark:hover:!text-green-50"
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
                if (isAccountsLoading)
                    return (
                        <div className="flex justify-center overflow-hidden">
                            <LoadingBlock className="!h-4 !w-4" />
                        </div>
                    );

                const account = accountsData?.find(account => account.id === row?.original?.account_id);

                return (
                    <TextField
                        text={account?.id ?? ""}
                        wrap
                        copyValue
                        lineClamp
                        linesCount={1}
                        minWidth="50px"
                        onClick={account?.id ? () => openSheet("account", { id: row.original.account_id }) : undefined}
                    />
                );
            }
        },

        {
            id: "Balance",
            header: translate("resources.wallet.manage.fields.balance"),
            cell: ({ row }) => {
                return balances.get(row.original.id) ? (
                    <div className="items-left flex flex-col justify-center">
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
                        <LoadingBalance className="h-[15px] w-[15px] overflow-hidden" />
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
