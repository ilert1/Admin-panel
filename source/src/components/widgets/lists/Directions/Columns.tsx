import { Direction, Merchant } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useSheets } from "@/components/providers/SheetProvider";
import { Button, ShowButton, TrashButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { CurrencyWithId } from "@/data/currencies";
import { ProviderWithId } from "@/data/providers";
import { useGetMerchantIdByName } from "@/hooks/useGetMerchantName";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useState } from "react";
import { useTranslate } from "react-admin";
import { DirectionActivityBtn } from "./DirectionActivityBtn";

export const useGetDirectionsColumns = ({ isFetching = false }: { isFetching?: boolean }) => {
    const translate = useTranslate();
    const { openSheet, closeSheet } = useSheets();
    const { getMerchantId, isLoadingMerchants } = useGetMerchantIdByName();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [chosenId, setChosenId] = useState("");

    const onCloseSheet = () => {
        closeSheet("direction");
    };

    const handleDeleteClicked = useCallback((id: string) => {
        setChosenId(id);
        setDeleteDialogOpen(prev => !prev);
    }, []);

    const handleDirectionShowOpen = (id: string) => {
        openSheet("direction", { id });
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

                const merchId = getMerchantId(merchant.id);

                return (
                    <div>
                        <TextField
                            text={merchant.name ?? ""}
                            onClick={
                                merchId
                                    ? () =>
                                          openSheet("merchant", {
                                              id: merchant.id ?? "",
                                              merchantName: merchant.name
                                          })
                                    : undefined
                            }
                        />
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
                    <DirectionActivityBtn
                        id={row.original.id}
                        directionName={row.original.name}
                        activityState={row.original.state === "active"}
                        isFetching={isFetching}
                    />
                );
            }
        },
        {
            id: "delete_field",
            header: () => {
                return <div className="text-center">{translate("app.ui.actions.delete")}</div>;
            },
            cell: ({ row }) => {
                return <TrashButton onClick={() => handleDeleteClicked(row.original.id)} />;
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
        columns,
        deleteDialogOpen,
        isLoadingMerchants,
        chosenId,
        setDeleteDialogOpen,
        onCloseSheet
    };
};
