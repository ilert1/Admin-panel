import { MerchantCascadeSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useSheets } from "@/components/providers/SheetProvider";
import { Badge } from "@/components/ui/badge";
import { Button, ShowButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { useGetMerchantData } from "@/hooks/useGetMerchantData";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useLocaleState, useTranslate } from "react-admin";

export const useGetCascadeMerchantColumns = () => {
    const [locale] = useLocaleState();
    const translate = useTranslate();
    const { openSheet } = useSheets();
    const { getMerchantId, isMerchantsLoading } = useGetMerchantData();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const columns: ColumnDef<MerchantCascadeSchema>[] = [
        {
            id: "id",
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => (
                <TextField
                    text={row.original.id}
                    wrap
                    copyValue
                    lineClamp
                    linesCount={1}
                    minWidth="50px"
                    onClick={() => openSheet("cascadeMerchant", { id: row.original.id })}
                />
            )
        },
        {
            id: "merchant",
            accessorKey: "merchant",
            header: translate("resources.cascadeSettings.cascadeMerchants.fields.merchant"),
            cell: ({ row }) => {
                const merchId = getMerchantId(row.original.merchant.id);

                return (
                    <div>
                        <TextField
                            text={row.original.merchant.name}
                            onClick={
                                merchId
                                    ? () =>
                                          openSheet("merchant", {
                                              id: row.original.merchant.id,
                                              merchantName: row.original.merchant.name
                                          })
                                    : undefined
                            }
                        />
                        <TextField
                            className="text-neutral-70"
                            text={row.original.merchant.id}
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
            id: "cascade",
            accessorKey: "cascade",
            header: translate("resources.cascadeSettings.cascadeMerchants.fields.cascade"),
            cell: ({ row }) => (
                <div>
                    <Button
                        variant={"resourceLink"}
                        onClick={() => {
                            openSheet("cascade", {
                                id: row.original.cascade.id
                            });
                        }}>
                        {row.original.cascade.name}
                    </Button>
                    <TextField
                        className="text-neutral-70"
                        text={row.original.cascade.id}
                        wrap
                        copyValue
                        lineClamp
                        linesCount={1}
                        minWidth="50px"
                    />
                </div>
            )
        },
        {
            id: "cascade_type",
            accessorKey: "cascade_type",
            header: translate("resources.cascadeSettings.cascadeMerchants.fields.type"),
            cell: ({ row }) => (
                <TextField text={translate("resources.cascadeSettings.cascades.types." + row.original.cascade.type)} />
            )
        },
        {
            id: "source_currency",
            accessorKey: "source_currency",
            header: translate("resources.cascadeSettings.cascadeMerchants.fields.src_currency"),
            cell: ({ row }) => {
                const currency_code = row.original.cascade.src_currency_code;
                return currency_code ? <Badge variant="currency">{currency_code}</Badge> : <TextField text="" />;
            }
        },
        {
            id: "cascade_kind",
            accessorKey: "cascade_kind",
            header: translate("resources.cascadeSettings.cascadeMerchants.fields.kind"),
            cell: ({ row }) => (
                <TextField
                    text={translate("resources.cascadeSettings.cascades.kinds." + row.original.cascade.cascade_kind)}
                />
            )
        },
        {
            id: "cascade_state",
            accessorKey: "cascade_state",
            header: translate("resources.cascadeSettings.cascadeMerchants.fields.cascade_state"),
            cell: ({ row }) => (
                <TextField text={translate("resources.cascadeSettings.cascades.state." + row.original.cascade.state)} />
            )
        },
        {
            id: "state",
            accessorKey: "state",
            header: translate("resources.cascadeSettings.cascadeMerchants.fields.state"),
            cell: ({ row }) => (
                <TextField text={translate("resources.cascadeSettings.cascades.state." + row.original.state)} />
            )
        },
        {
            accessorKey: "created_at",
            header: translate("resources.cascadeSettings.cascadeMerchants.fields.created_at"),
            cell: ({ row }) => (
                <>
                    <p className="text-nowrap">{new Date(row.original.created_at).toLocaleDateString(locale)}</p>
                    <p className="text-nowrap text-neutral-70">
                        {new Date(row.original.created_at).toLocaleTimeString(locale)}
                    </p>
                </>
            )
        },
        {
            id: "updated_at",
            accessorKey: "updated_at",
            header: translate("resources.cascadeSettings.cascadeMerchants.fields.updated_at"),
            cell: ({ row }) => (
                <>
                    <p className="text-nowrap">{new Date(row.original.updated_at).toLocaleDateString(locale)}</p>
                    <p className="text-nowrap text-neutral-70">
                        {new Date(row.original.updated_at).toLocaleTimeString(locale)}
                    </p>
                </>
            )
        },
        {
            id: "changed_by",
            accessorKey: "changed_by",
            header: translate("resources.cascadeSettings.cascadeMerchants.fields.changed_by"),
            cell: () => <TextField text={""} />
            // cell: ({ row }) => <TextField text={row.original.cascade.changed_by || ""} />
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <ShowButton
                        onClick={() => {
                            openSheet("cascadeMerchant", { id: row.original.id });
                        }}
                    />
                );
            }
        }
    ];

    return {
        createDialogOpen,
        isMerchantsLoading,
        setCreateDialogOpen,
        columns
    };
};
