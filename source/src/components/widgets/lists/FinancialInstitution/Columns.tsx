import { ColumnDef } from "@tanstack/react-table";
import { useLocaleState, useTranslate } from "react-admin";
import { FinancialInstitution } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { TextField } from "@/components/ui/text-field";
import { ToggleActiveUser } from "@/components/ui/toggle-active-user";
import { EyeIcon } from "lucide-react";
import { useSheets } from "@/components/providers/SheetProvider";

export const useGetFinancialInstitutionColumns = () => {
    const translate = useTranslate();
    const [locale] = useLocaleState();
    const { openSheet } = useSheets();

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const columns: ColumnDef<FinancialInstitution>[] = [
        {
            id: "created_at",
            accessorKey: "created_at",
            header: translate("resources.paymentTools.financialInstitution.fields.created_at"),
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
            header: translate("resources.paymentTools.financialInstitution.fields.updated_at"),
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
            id: "name",
            accessorKey: "name",
            header: translate("resources.paymentTools.financialInstitution.fields.name"),
            cell: ({ row }) => {
                return (
                    <TextField
                        wrap
                        copyValue
                        lineClamp
                        linesCount={1}
                        minWidth="150px"
                        text={row.original.name || ""}
                    />
                );
            }
        },
        {
            id: "short_name",
            accessorKey: "short_name",
            header: translate("resources.paymentTools.financialInstitution.fields.short_name"),
            cell: ({ row }) => {
                return (
                    <TextField
                        wrap
                        copyValue
                        lineClamp
                        linesCount={1}
                        minWidth="150px"
                        text={row.original.short_name || ""}
                    />
                );
            }
        },
        {
            id: "legal_name",
            accessorKey: "legal_name",
            header: translate("resources.paymentTools.financialInstitution.fields.legal_name"),
            cell: ({ row }) => {
                return (
                    <TextField
                        wrap
                        copyValue
                        lineClamp
                        linesCount={1}
                        minWidth="150px"
                        text={row.original.legal_name || ""}
                    />
                );
            }
        },
        {
            id: "id",
            accessorKey: "id",
            header: translate("resources.paymentTools.financialInstitution.fields.id"),
            cell: ({ row }) => (
                <TextField wrap copyValue lineClamp linesCount={1} minWidth="150px" text={row.original.id} />
            )
        },
        {
            id: "tax_id_number",
            accessorKey: "tax_id_number",
            header: translate("resources.paymentTools.financialInstitution.fields.tax_id_number"),
            cell: ({ row }) => {
                return (
                    <TextField
                        wrap
                        copyValue
                        lineClamp
                        linesCount={1}
                        minWidth="150px"
                        text={row.original.tax_id_number || ""}
                    />
                );
            }
        },
        {
            id: "registration_number",
            accessorKey: "registration_number",
            header: translate("resources.paymentTools.financialInstitution.fields.registration_number"),
            cell: ({ row }) => {
                return (
                    <TextField
                        wrap
                        copyValue
                        lineClamp
                        linesCount={1}
                        minWidth="150px"
                        text={row.original.registration_number || ""}
                    />
                );
            }
        },
        {
            id: "nspk_member_id",
            accessorKey: "nspk_member_id",
            header: translate("resources.paymentTools.financialInstitution.fields.nspk_member_id"),
            cell: ({ row }) => {
                return (
                    <TextField
                        wrap
                        copyValue
                        lineClamp
                        linesCount={1}
                        minWidth="150px"
                        text={row.original.nspk_member_id || ""}
                    />
                );
            }
        },
        {
            id: "institution_type",
            accessorKey: "institution_type",
            header: translate("resources.paymentTools.financialInstitution.fields.institution_type"),
            cell: ({ row }) => {
                return (
                    <TextField
                        text={
                            row.original.institution_type
                                ? translate(
                                      `resources.paymentTools.financialInstitution.fields.types.${row.original.institution_type}`
                                  )
                                : ""
                        }
                    />
                );
            }
        },
        {
            id: "payment_types",
            accessorKey: "payment_types",
            header: translate("resources.paymentTools.financialInstitution.fields.payment_types"),
            cell: ({ row }) => {
                return <TextField text={row.original.payment_types?.join(", ") || ""} />;
            }
        },
        {
            id: "country_code",
            accessorKey: "country_code",
            header: translate("resources.paymentTools.financialInstitution.fields.country_code")
        },
        {
            id: "bic",
            accessorKey: "bic",
            header: translate("resources.paymentTools.financialInstitution.fields.bic"),
            cell: ({ row }) => {
                return <TextField text={row.original.bic || ""} />;
            }
        },
        {
            id: "status",
            accessorKey: "status",
            header: translate("resources.paymentTools.financialInstitution.fields.status"),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        <ToggleActiveUser active={row.original.status === "ACTIVE" ? true : false} />
                    </div>
                );
            }
        },
        {
            id: "show",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        <Button
                            onClick={() => openSheet("financialInstitution", { id: row.original.id })}
                            variant={"text_btn"}>
                            <EyeIcon className="text-green-50 hover:text-green-40" />
                        </Button>
                    </div>
                );
            }
        }
    ];
    return {
        translate,
        editDialogOpen,
        deleteDialogOpen,
        createDialogOpen,
        columns,
        setDeleteDialogOpen,
        setEditDialogOpen,
        setCreateDialogOpen
    };
};
