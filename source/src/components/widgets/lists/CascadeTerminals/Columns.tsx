import { CascadeTerminalSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useSheets } from "@/components/providers/SheetProvider";
import { Badge } from "@/components/ui/badge";
import { Button, ShowButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useLocaleState, useTranslate } from "react-admin";

export const useGetCascadeTerminalsColumns = () => {
    const [locale] = useLocaleState();
    const translate = useTranslate();
    const { openSheet } = useSheets();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const columns: ColumnDef<CascadeTerminalSchema>[] = [
        {
            accessorKey: "created_at",
            header: translate("resources.cascadeSettings.cascadeTerminals.fields.created_at"),
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
            accessorKey: "updated_at",
            header: translate("resources.cascadeSettings.cascadeTerminals.fields.updated_at"),
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
            accessorKey: "id",
            header: translate("resources.cascadeSettings.cascadeTerminals.fields.id"),
            cell: ({ row }) => (
                <TextField text={row.original.id} wrap copyValue lineClamp linesCount={1} minWidth="50px" />
            )
        },
        {
            accessorKey: "cascade",
            header: translate("resources.cascadeSettings.cascadeTerminals.fields.cascade"),
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
            accessorKey: "terminal",
            header: translate("resources.cascadeSettings.cascadeTerminals.fields.terminal"),
            cell: ({ row }) => (
                <div>
                    <TextField text={row.original.terminal.verbose_name} />
                    <TextField
                        className="text-neutral-70"
                        text={row.original.terminal.terminal_id}
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
            accessorKey: "terminal_state",
            header: translate("resources.cascadeSettings.cascadeTerminals.fields.terminal_state"),
            cell: ({ row }) => <TextField text={row.original.terminal.state || ""} />
        },
        {
            accessorKey: "provider",
            header: translate("resources.cascadeSettings.cascadeTerminals.fields.provider"),
            cell: ({ row }) => (
                <Button
                    variant={"resourceLink"}
                    onClick={() => {
                        if (row.original.terminal.provider.id) {
                            openSheet("provider", {
                                id: row.original.terminal.provider.id
                            });
                        }
                    }}>
                    {row.original.terminal.provider.name}
                </Button>
            )
        },
        {
            accessorKey: "src_currency",
            header: translate("resources.cascadeSettings.cascadeTerminals.fields.src_currency"),
            cell: ({ row }) => (
                <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto">
                    <Badge variant="currency">{row.original.terminal.src_currency_code}</Badge>
                </div>
            )
        },
        {
            accessorKey: "dst_currency",
            header: translate("resources.cascadeSettings.cascadeTerminals.fields.dst_currency"),
            cell: ({ row }) => (
                <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto">
                    <Badge variant="currency">{row.original.terminal.dst_currency_code}</Badge>
                </div>
            )
        },
        {
            accessorKey: "weight",
            header: translate("resources.cascadeSettings.cascadeTerminals.fields.weight"),
            cell: ({ row }) => <TextField text={row.original.condition?.weight?.toString() || ""} />
        },
        {
            accessorKey: "rank",
            header: translate("resources.cascadeSettings.cascadeTerminals.fields.rank"),
            cell: ({ row }) => <TextField text={row.original.condition?.rank?.toString() || ""} />
        },
        {
            accessorKey: "extra",
            header: translate("resources.cascadeSettings.cascadeTerminals.fields.extra"),
            cell: ({ row }) => <TextField text={row.original.condition?.extra?.toString() || ""} />
        },
        {
            accessorKey: "ttl_min",
            header: translate("resources.cascadeSettings.cascadeTerminals.fields.ttl_min"),
            cell: ({ row }) => <TextField text={row.original.condition?.ttl?.min?.toString() || ""} />
        },
        {
            accessorKey: "ttl_max",
            header: translate("resources.cascadeSettings.cascadeTerminals.fields.ttl_max"),
            cell: ({ row }) => <TextField text={row.original.condition?.ttl?.max?.toString() || ""} />
        },
        {
            accessorKey: "state",
            header: translate("resources.cascadeSettings.cascadeTerminals.fields.state"),
            cell: ({ row }) => <TextField text={row.original.state || ""} />
        },
        {
            id: "actions",
            cell: () => {
                return (
                    <ShowButton
                        onClick={() => {
                            // handleCascadeShowOpen(row.original.id);
                        }}
                    />
                );
            }
        }
    ];
    return {
        createDialogOpen,
        setCreateDialogOpen,
        columns
    };
};
