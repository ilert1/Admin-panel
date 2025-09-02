import { useTranslate } from "react-admin";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/Button";
import { CascadeTerminalRead } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { useSheets } from "@/components/providers/SheetProvider";

export const useGetCascadeShowColumns = () => {
    const translate = useTranslate();
    const { openSheet } = useSheets();

    const cascadeTerminalColumns: ColumnDef<CascadeTerminalRead>[] = [
        {
            accessorKey: "terminal",
            header: translate("resources.cascadeSettings.cascadeTerminals.fields.terminal"),
            cell: ({ row }) => (
                <div>
                    <Button
                        variant={"resourceLink"}
                        onClick={() => {
                            openSheet("terminal", {
                                id: row.original.terminal.terminal_id
                            });
                        }}>
                        {row.original.terminal.verbose_name}
                    </Button>
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
                    <Badge variant="currency">{row.original.terminal.src_currency?.code}</Badge>
                </div>
            )
        },
        {
            accessorKey: "dst_currency",
            header: translate("resources.cascadeSettings.cascadeTerminals.fields.dst_currency"),
            cell: ({ row }) => (
                <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto">
                    <Badge variant="currency">{row.original.terminal.dst_currency?.code}</Badge>
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
            header: translate("resources.cascadeSettings.cascadeTerminals.fields.rankSmall"),
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
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    {row.original.state === "active" && (
                        <span className="whitespace-nowrap rounded-20 bg-green-50 px-3 py-0.5 text-center text-title-2 font-normal">
                            {translate("resources.cascadeSettings.cascades.state.active")}
                        </span>
                    )}
                    {row.original.state === "inactive" && (
                        <span className="whitespace-nowrap rounded-20 bg-red-50 px-3 py-0.5 text-center text-title-2 font-normal">
                            {translate("resources.cascadeSettings.cascades.state.inactive")}
                        </span>
                    )}
                </div>
            )
        }
    ];

    return { cascadeTerminalColumns };
};
