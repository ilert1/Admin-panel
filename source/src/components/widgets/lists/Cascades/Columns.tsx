import { CascadeSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { ShowButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { useLocaleState, useTranslate } from "react-admin";

export const useGetCascadeColumns = () => {
    const [locale] = useLocaleState();
    const translate = useTranslate();
    // const { openSheet } = useSheets();

    // const handleCascadeShowOpen = (id: string) => {
    //     openSheet("cascade", { id });
    // };

    const columns: ColumnDef<CascadeSchema>[] = [
        {
            accessorKey: "created_at",
            header: translate("resources.cascadeSettings.cascades.fields.created_at"),
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
            header: translate("resources.cascadeSettings.cascades.fields.updated_at"),
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
            accessorKey: "name",
            header: translate("resources.cascadeSettings.cascades.fields.name"),
            cell: ({ row }) => (
                <div>
                    <TextField text={row.original.name} />
                    <TextField
                        className="text-neutral-70"
                        text={row.original.id}
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
            cell: ({ row }) => <TextField text={row.original.type ?? ""} minWidth="50px" />
        },
        {
            accessorKey: "src_currency_code",
            header: translate("resources.cascadeSettings.cascades.fields.src_currency_code"),
            cell: ({ row }) => <TextField text={row.original.src_currency_code} minWidth="50px" />
        },
        {
            accessorKey: "cascade_kind",
            header: translate("resources.cascadeSettings.cascades.fields.cascade_kind"),
            cell: ({ row }) => <TextField text={row.original.cascade_kind ?? ""} minWidth="50px" />
        },
        {
            accessorKey: "priority_policy.rank",
            header: translate("resources.cascadeSettings.cascades.fields.rank"),
            cell: ({ row }) => <TextField text={row.original.priority_policy.rank.toString()} minWidth="50px" />
        },
        {
            accessorKey: "state",
            header: translate("resources.cascadeSettings.cascades.fields.state"),
            cell: ({ row }) => <TextField text={row.original.state ?? ""} minWidth="50px" />
        },
        {
            accessorKey: "login",
            header: translate("resources.cascadeSettings.cascades.fields.login"),
            cell: ({ row }) => <TextField text={""} minWidth="50px" />
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <ShowButton
                    // onClick={() => {
                    //     handleCascadeShowOpen(row.original.id);
                    // }}
                    />
                );
            }
        }
    ];
    return {
        columns
    };
};
