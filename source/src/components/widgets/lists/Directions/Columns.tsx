import { Direction, Merchant } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useSheets } from "@/components/providers/SheetProvider";
import { Button, ShowButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { CurrencyWithId } from "@/data/currencies";
import { ProviderWithId } from "@/data/providers";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslate } from "react-admin";

export const useGetDirectionsColumns = () => {
    const translate = useTranslate();
    const { openSheet } = useSheets();

    const handleDirectionShowOpen = (id: string) => {
        openSheet("direction", { id });
    };

    const handleMerchantShowOpen = (merchant: Merchant) => {
        openSheet("merchant", {
            id: merchant.id ?? "",
            merchantName: merchant.name
        });
    };

    const handleTerminalShowOpen = (id: string, providerName: string) => {
        openSheet("terminal", {
            id,
            provider: providerName
        });
    };

    const columns: ColumnDef<Direction>[] = [
        {
            id: "name",
            header: translate("resources.direction.fields.name"),
            cell: ({ row }) => {
                return (
                    <Button
                        variant={"resourceLink"}
                        onClick={() => {
                            handleDirectionShowOpen(row.original.id);
                        }}>
                        {row.original.name ?? ""}
                    </Button>
                );
            }
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
                            variant={"resourceLink"}
                            onClick={() => {
                                handleMerchantShowOpen(merchant);
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
                const providerName = row.original.provider.name;
                return (
                    <Button
                        variant={"resourceLink"}
                        onClick={() => {
                            const id = row.original.terminal?.terminal_id ?? "";
                            handleTerminalShowOpen(id, providerName);
                        }}>
                        {row.original.terminal?.verbose_name ?? ""}
                    </Button>
                );
            }
        },
        {
            id: "weight",
            accessorKey: "weight",
            header: translate("resources.direction.weight")
        },
        {
            id: "type",
            header: () => (
                <div className="flex items-center justify-center">{translate("resources.direction.types.type")}</div>
            ),
            cell: ({ row }) => {
                const type = row.original.type;
                return type ? translate(`resources.direction.types.${row.original.type}`) : "-";
            }
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
                        {row.original.state === "active" ? (
                            <span className="whitespace-nowrap rounded-20 bg-green-50 px-3 py-0.5 text-center text-title-2 font-normal">
                                {translate("resources.direction.fields.stateActive")}
                            </span>
                        ) : (
                            <span className="whitespace-nowrap rounded-20 bg-red-50 px-3 py-0.5 text-center text-title-2 font-normal">
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
                            handleDirectionShowOpen(row.original.id);
                        }}
                    />
                );
            }
        }
    ];
    return {
        columns
    };
};
