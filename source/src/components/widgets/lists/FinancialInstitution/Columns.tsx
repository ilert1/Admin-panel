import { ColumnDef } from "@tanstack/react-table";
import { useTranslate } from "react-admin";
import { FinancialInstitution } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { TextField } from "@/components/ui/text-field";
import { EyeIcon } from "lucide-react";
import { useSheets } from "@/components/providers/SheetProvider";
import { PaymentTypeIcon } from "../../components/PaymentTypeIcon";
import { FinancialInstitutionActivityBtn } from "./FinancialInstitutionActivityBtn";

export const useGetFinancialInstitutionColumns = ({ isFetching = false }: { isFetching?: boolean }) => {
    const translate = useTranslate();
    const { openSheet } = useSheets();

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const columns: ColumnDef<FinancialInstitution>[] = [
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
            id: "currencies",
            accessorKey: "currencies",
            header: translate("resources.paymentTools.financialInstitution.fields.currencies"),
            cell: ({ row }) => {
                return (
                    <TextField
                        text={
                            row.original.currencies && row.original.currencies?.length > 0
                                ? row.original.currencies?.map(item => item.code).join(", ")
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
                return (
                    <div className="max-w-auto flex min-w-28 flex-wrap gap-2">
                        {row.original.payment_types?.map(pt => {
                            return <PaymentTypeIcon key={pt.code} type={pt.code} className="h-7 w-7" tooltip />;
                        })}
                    </div>
                );
            }
        },
        {
            id: "country_code",
            accessorKey: "country_code",
            header: translate("resources.paymentTools.financialInstitution.fields.country_code")
        },
        {
            id: "status",
            accessorKey: "status",
            header: translate("resources.paymentTools.financialInstitution.fields.status"),
            cell: ({ row }) => {
                return (
                    <FinancialInstitutionActivityBtn
                        id={row.original.id}
                        financialInstitutionName={row.original.name}
                        activityState={row.original.status === "ACTIVE" ? true : false}
                        isFetching={isFetching}
                    />
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
