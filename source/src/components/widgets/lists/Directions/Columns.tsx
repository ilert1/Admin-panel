import { Direction, Merchant } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Button, ShowButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { CurrencyWithId } from "@/data/currencies";
import { ProviderWithId } from "@/data/providers";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslate } from "react-admin";

export const useGetDirectionsColumns = () => {
    const translate = useTranslate();

    const [chosenId, setChosenId] = useState("");

    const [quickShowOpen, setQuickShowOpen] = useState(false);

    const [chosenMerchantId, setChosenMerchantId] = useState("");
    const [chosenMerchantName, setChosenMerchantName] = useState("");
    const [showMerchants, setShowMerchants] = useState(false);

    const openSheet = (id: string) => {
        setChosenId(id);
        setQuickShowOpen(true);
    };

    const columns: ColumnDef<Direction>[] = [
        {
            id: "name",
            accessorKey: "name",
            header: translate("resources.direction.fields.name")
        },
        {
            id: "id",
            accessorKey: "id",
            header: translate("resources.direction.fields.id"),
            cell: ({ row }) => {
                return <TextField text={row.original.id} wrap copyValue lineClamp linesCount={1} minWidth="50px" />;
            }
        },
        {
            id: "account_id",
            accessorKey: "account_id",
            header: translate("resources.direction.fields.accountNumber"),
            cell: ({ row }) => {
                return <TextField text={row.original.account_id || ""} wrap copyValue />;
            }
        },
        {
            id: "src_currency",
            accessorKey: "src_currency",
            header: translate("resources.direction.fields.srcCurr"),
            cell: ({ row }) => {
                const obj: CurrencyWithId = row.getValue("src_currency");
                return <TextField text={obj.code} />;
            }
        },
        {
            id: "dst_currency",
            accessorKey: "dst_currency",
            header: translate("resources.direction.fields.destCurr"),
            cell: ({ row }) => {
                const obj: CurrencyWithId = row.getValue("dst_currency");
                return <TextField text={obj.code} />;
            }
        },
        {
            id: "merchant",
            accessorKey: "merchant",
            header: translate("resources.direction.fields.merchant"),
            cell: ({ row }) => {
                const merchant: Merchant = row.getValue("merchant");

                return (
                    <div>
                        <Button
                            variant={"merchantLink"}
                            onClick={() => {
                                setChosenMerchantId(merchant.id ?? "");
                                setChosenMerchantName(merchant.name);
                                setShowMerchants(true);
                            }}>
                            {merchant.name ?? ""}
                        </Button>
                        <TextField
                            className="text-neutral-70"
                            text={merchant.id}
                            wrap
                            copyValue
                            lineClamp
                            linesCount={1}
                            minWidth="50px"
                        />
                    </div>
                );
            }
        },
        {
            id: "provider",
            accessorKey: "provider",
            header: translate("resources.direction.provider"),
            cell: ({ row }) => {
                const obj: ProviderWithId = row.getValue("provider");
                return <TextField text={obj.name} wrap />;
            }
        },
        {
            id: "terminal",
            header: translate("resources.direction.fields.terminal"),
            cell: ({ row }) => {
                return <TextField text={row.original.terminal?.verbose_name ?? ""} wrap />;
            }
        },
        {
            id: "weight",
            accessorKey: "weight",
            header: translate("resources.direction.weight")
        },
        {
            id: "active",
            accessorKey: "active",
            header: () => {
                return <div className="text-center">{translate("resources.direction.fields.isActive")}</div>;
            },
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center text-white">
                        {row.original.active ? (
                            <span className="px-3 py-0.5 bg-green-50 rounded-20 font-normal text-title-2 text-center whitespace-nowrap">
                                {translate("resources.direction.fields.stateActive")}
                            </span>
                        ) : (
                            <span className="px-3 py-0.5 bg-red-50 rounded-20 font-normal text-title-2 text-center whitespace-nowrap">
                                {translate("resources.direction.fields.stateInactive")}
                            </span>
                        )}
                    </div>
                );
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <ShowButton
                        onClick={() => {
                            setChosenId(row.original.id);
                            openSheet(row.original.id);
                        }}
                    />
                );
            }
        }
    ];
    return {
        columns,
        chosenId,
        quickShowOpen,
        chosenMerchantId,
        showMerchants,
        chosenMerchantName,
        setShowMerchants,
        setQuickShowOpen
    };
};
