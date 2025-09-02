import { CascadeSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useSheets } from "@/components/providers/SheetProvider";
import { Badge } from "@/components/ui/badge";
import { Button, ShowButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useLocaleState, useTranslate } from "react-admin";
import { PaymentTypeIcon } from "../../components/PaymentTypeIcon";

export const useGetCascadeColumns = () => {
    const [locale] = useLocaleState();
    const translate = useTranslate();
    const { openSheet } = useSheets();

    const handleCascadeShowOpen = (id: string) => {
        openSheet("cascade", { id });
    };

    const [createDialogOpen, setCreateDialogOpen] = useState(false);

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
            header: translate("resources.cascadeSettings.cascades.fields.cascade"),
            cell: ({ row }) => (
                <div>
                    <Button
                        variant={"resourceLink"}
                        onClick={() => {
                            openSheet("cascade", {
                                id: row.original.id
                            });
                        }}>
                        {row.original.name}
                    </Button>
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
            cell: ({ row }) => (
                <TextField
                    text={
                        row.original.type
                            ? translate(`resources.cascadeSettings.cascades.types.${row.original.type}`)
                            : ""
                    }
                    minWidth="50px"
                />
            )
        },
        {
            accessorKey: "src_currency_code",
            header: translate("resources.cascadeSettings.cascades.fields.src_currency_code"),
            cell: ({ row }) => (
                <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto">
                    <Badge variant="currency">{row.original.src_currency.code}</Badge>
                </div>
            )
        },
        {
            accessorKey: "cascade_kind",
            header: translate("resources.cascadeSettings.cascades.fields.cascade_kind"),
            cell: ({ row }) => (
                <TextField
                    text={
                        row.original.cascade_kind
                            ? translate(`resources.cascadeSettings.cascades.kinds.${row.original.cascade_kind}`)
                            : ""
                    }
                    minWidth="50px"
                />
            )
        },
        {
            accessorKey: "priority_policy.rank",
            header: translate("resources.cascadeSettings.cascades.fields.rank"),
            cell: ({ row }) => <TextField text={row.original.priority_policy.rank.toString()} minWidth="50px" />
        },
        {
            id: "payment_types",
            header: translate("resources.cascadeSettings.cascades.fields.payment_types"),
            cell: ({ row }) => {
                return (
                    <div className="max-w-auto flex flex-wrap gap-2">
                        {row.original.payment_types && row.original.payment_types.length > 0
                            ? row.original.payment_types?.map(pt => {
                                  return (
                                      <PaymentTypeIcon
                                          className="h-7 w-7"
                                          key={pt.code}
                                          type={pt.code}
                                          metaIcon={pt.meta?.["icon"]}
                                      />
                                  );
                              })
                            : "-"}
                    </div>
                );
            }
        },
        {
            accessorKey: "state",
            header: translate("resources.cascadeSettings.cascades.fields.state"),
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
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return <ShowButton onClick={() => handleCascadeShowOpen(row.original.id)} />;
            }
        }
    ];
    return {
        createDialogOpen,
        setCreateDialogOpen,
        columns
    };
};
