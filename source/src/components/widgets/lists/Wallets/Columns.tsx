import { useSheets } from "@/components/providers/SheetProvider";
import { ShowButton } from "@/components/ui/Button";
import { LoadingBalance, LoadingBlock } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslate } from "react-admin";
import { useQuery } from "@tanstack/react-query";
import { AccountsDataProvider } from "@/data";

export const useGetWalletsColumns = (data: Wallets.Wallet[], balances: Map<string, Wallets.WalletBalance>) => {
    const translate = useTranslate();
    const { openSheet } = useSheets();

    const accountsDataProvider = AccountsDataProvider;

    const handleOpenSheet = (id: string) => {
        openSheet("wallet", { id });
    };

    const fetchOneAccount = async (id: string) => {
        try {
            const account = await accountsDataProvider.getOne("accounts", {
                id
            });
            return account.data?.id ?? "";
        } catch (error) {
            return "";
        }
    };

    const AccountIdCell: React.FC<{ accountId: string }> = ({ accountId }: { accountId: string }) => {
        const { data: accId, isLoading } = useQuery({
            queryKey: ["account", accountId],
            queryFn: () => fetchOneAccount(accountId),
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
            enabled: !!accountId
        });

        return isLoading ? (
            <div className="overflow-hidden px-4">
                <LoadingBlock className="!h-4 !w-4" />
            </div>
        ) : (
            <TextField
                text={accId ? accId : (accountId ?? "")}
                wrap
                copyValue
                lineClamp
                linesCount={1}
                minWidth="50px"
                onClick={accId ? () => openSheet("account", { id: accId }) : undefined}
            />
        );
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
                console.log(row.original.account_id);

                return <AccountIdCell accountId={row.original.account_id} />;
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
