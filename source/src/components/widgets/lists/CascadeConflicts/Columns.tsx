import { MergedCascadeView } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useSheets } from "@/components/providers/SheetProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslate } from "react-admin";

export const useGetCascadeConflictsColumns = () => {
    const translate = useTranslate();
    const { openSheet } = useSheets();

    const handleCascadeShowOpen = (id: string) => {
        openSheet("cascade", { id });
    };

    const columns: ColumnDef<MergedCascadeView>[] = [
        {
            accessorKey: "name",
            header: translate("resources.cascadeSettings.cascades.fields.cascade"),
            cell: ({ row }) => (
                <div>
                    <Button
                        variant={"resourceLink"}
                        onClick={() => handleCascadeShowOpen(row.original.merged_cascade.id)}>
                        {row.original.merged_cascade.name}
                    </Button>
                    <TextField
                        className="text-neutral-70"
                        text={row.original.merged_cascade.id}
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
            accessorKey: "type",
            header: translate("resources.cascadeSettings.cascades.fields.type"),
            cell: ({ row }) => <TextField text={row.original.merged_cascade.type ?? ""} minWidth="50px" />
        },
        {
            accessorKey: "cascade_kind",
            header: translate("resources.cascadeSettings.cascades.fields.cascade_kind"),
            cell: ({ row }) => <TextField text={row.original.merged_cascade.cascade_kind ?? ""} minWidth="50px" />
        },
        {
            accessorKey: "priority_policy.rank",
            header: translate("resources.cascadeSettings.cascades.fields.rank"),
            cell: ({ row }) => (
                <TextField text={row.original.merged_cascade.priority_policy.rank.toString()} minWidth="50px" />
            )
        },
        {
            accessorKey: "src_currency_code",
            header: translate("resources.cascadeSettings.cascades.fields.src_currency_code"),
            cell: ({ row }) => (
                <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto">
                    <Badge variant="currency">{row.original.merged_cascade.src_currency.code}</Badge>
                </div>
            )
        },
        {
            accessorKey: "state",
            header: translate("resources.cascadeSettings.cascades.fields.state"),
            cell: ({ row }) => <TextField text={row.original.merged_cascade.state ?? ""} minWidth="50px" />
        }
    ];
    return {
        columns
    };
};
