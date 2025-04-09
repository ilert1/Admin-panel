import { Direction } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useSheets } from "@/components/providers/SheetProvider";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { CurrencyWithId } from "@/data/currencies";
import { ProviderWithId } from "@/data/providers";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslate } from "react-admin";
import { DirectionActivityBtn } from "../../lists/Directions/DirectionActivityBtn";

export const useGetMerchantShowColumns = ({ isFetching = false }: { isFetching?: boolean }) => {
    const translate = useTranslate();
    const { openSheet } = useSheets();

    const columns: ColumnDef<Direction>[] = [
        {
            id: "name",
            header: translate("resources.direction.fields.name"),
            cell: ({ row }) => {
                return (
                    <Button
                        variant={"resourceLink"}
                        onClick={() => {
                            openSheet("direction", { id: row.original.id });
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
                return <TextField text={row.original.id} wrap copyValue />;
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
            id: "provider",
            accessorKey: "provider",
            header: translate("resources.direction.provider"),
            cell: ({ row }) => {
                const obj: ProviderWithId = row.getValue("provider");
                return <TextField text={obj.name} wrap />;
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
                    <DirectionActivityBtn
                        id={row.original.id}
                        directionName={row.original.name}
                        activityState={row.original.state === "active"}
                        isFetching={isFetching}
                    />
                );
            }
        }
    ];
    return { columns };
};
