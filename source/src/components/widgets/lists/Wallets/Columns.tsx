import { Button } from "@/components/ui/button";
import { LoadingBalance } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { useTranslate } from "react-admin";

export const useGetWalletsColumns = (data: Wallet[], balances: Map<string, WalletBalance>) => {
    const translate = useTranslate();
    const [chosenId, setChosenId] = useState("");
    const [quickShowOpen, setQuickShowOpen] = useState(false);

    const openSheet = (id: string) => {
        setChosenId(id);
        setQuickShowOpen(true);
    };

    const columns: ColumnDef<Wallet>[] = [
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
                    <TextField text={row.original.account_id} wrap copyValue lineClamp linesCount={1} minWidth="50px" />
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
                    <div className="flex items-center justify-center">
                        <Button
                            onClick={() => {
                                setChosenId(row.original.id);
                                openSheet(row.original.id);
                            }}
                            variant="secondary"
                            className="h-7 w-7 p-0 bg-transparent flex items-center">
                            <EyeIcon className="text-green-50 size-7" />
                        </Button>
                    </div>
                );
            }
        }
    ];
    return { columns, chosenId, quickShowOpen, setQuickShowOpen };
};
