import { useTranslate } from "react-admin";
import { TextField } from "@/components/ui/text-field";
import { Button, ShowButton } from "@/components/ui/Button";
import { CascadeTerminalRead } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { useSheets } from "@/components/providers/SheetProvider";

export const useGetCascadeShowColumns = () => {
    const translate = useTranslate();
    const { openSheet } = useSheets();

    const cascadeTerminalColumns: ColumnDef<CascadeTerminalRead>[] = [
        {
            id: "show",
            header: "",
            cell: ({ row }) => (
                <>
                    <ShowButton
                        onClick={() => {
                            openSheet("cascadeTerminal", { id: row.original.id });
                        }}
                    />
                    {row.original.condition?.extra && (
                        <span className="text-red-40 dark:text-red-40">
                            {translate("resources.cascadeSettings.cascadeTerminals.fields.extra")}
                        </span>
                    )}
                </>
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
            accessorKey: "currencies",
            header: translate("resources.cascadeSettings.cascadeTerminals.fields.currencies"),
            cell: ({ row }) => (
                <div className="flex max-h-32 items-center gap-2">
                    <Badge variant="currency">{row.original.terminal.src_currency?.code}</Badge>
                    {">"}
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
            accessorKey: "ttl_min",
            header: translate("resources.cascadeSettings.cascadeTerminals.fields.ttl_minmax"),
            cell: ({ row }) => (
                <TextField
                    text={`${row.original.condition?.ttl?.min?.toString() || ""} / ${row.original.condition?.ttl?.max?.toString() || ""}`}
                />
            )
        },
        {
            accessorKey: "state",
            header: translate("resources.cascadeSettings.cascadeTerminals.fields.state"),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    {row.original.state === "active" && (
                        <span className="whitespace-nowrap rounded-20 bg-green-50 px-3 py-0.5 text-center text-title-2 font-normal text-white">
                            {translate("resources.cascadeSettings.cascades.state.active")}
                        </span>
                    )}
                    {row.original.state === "inactive" && (
                        <span className="whitespace-nowrap rounded-20 bg-red-50 px-3 py-0.5 text-center text-title-2 font-normal text-white">
                            {translate("resources.cascadeSettings.cascades.state.inactive")}
                        </span>
                    )}
                </div>
            )
        }
    ];

    return { cascadeTerminalColumns };
};
