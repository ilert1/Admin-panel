import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { useTranslate } from "react-admin";
enum WalletTypes {
    INTERNAL = "internal",
    LINKED = "linked",
    EXTERNAL = "external"
}
export const useGetWalletsColumns = () => {
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
                return <TextField text={row.original.address ?? ""} wrap copyValue />;
            }
        },
        {
            id: "accountNumber",
            accessorKey: "accountNumber",
            header: translate("resources.wallet.manage.fields.accountNumber"),
            cell: ({ row }) => {
                if (row.original.type === WalletTypes.LINKED) return "-";
                return <TextField text={row.original.account_id} wrap copyValue />;
            }
        },
        {
            id: "merchantId",
            accessorKey: "merchantId",
            header: translate("resources.wallet.manage.fields.merchantId"),
            cell: ({ row }) => {
                if (row.original.type === WalletTypes.EXTERNAL) return "-";
                return <TextField text={row.original.account_id} wrap copyValue />;
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
                console.log(row.original);
                return <TextField text={row.original.description || ""} wrap />;
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
