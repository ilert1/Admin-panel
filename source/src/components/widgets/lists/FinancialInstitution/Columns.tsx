import { ColumnDef } from "@tanstack/react-table";
import { useTranslate } from "react-admin";
import { FinancialInstitution } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { TextField } from "@/components/ui/text-field";
import { EyeIcon } from "lucide-react";
import { useSheets } from "@/components/providers/SheetProvider";
import { PaymentTypeIcon } from "../../components/PaymentTypeIcon";
import { useFetchFinancialInstitutionTypes } from "@/hooks/useFetchFinancialInstitutionTypes";

export const useGetFinancialInstitutionColumns = () => {
    const translate = useTranslate();
    const { openSheet } = useSheets();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const { data: financialInstitutionTypes } = useFetchFinancialInstitutionTypes();

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
                                ? financialInstitutionTypes?.find(type => type.value === row.original.institution_type)
                                      ?.label || ""
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
                    <div>
                        <Button
                            variant={"resourceLink"}
                            onClick={() => {
                                openSheet("financialInstitution", {
                                    id: row.original.id
                                });
                            }}>
                            {row.original.name}
                        </Button>
                    </div>
                );
            }
        },
        {
            id: "short_name",
            accessorKey: "short_name",
            header: translate("resources.paymentTools.financialInstitution.fields.short_name"),
            cell: ({ row }) => {
                return <TextField text={row.original.short_name || ""} />;
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
                            return (
                                <PaymentTypeIcon
                                    className="h-7 w-7"
                                    key={pt.code}
                                    type={pt.code}
                                    metaIcon={pt.meta?.["icon"] as string}
                                    tooltip
                                />
                            );
                        })}
                    </div>
                );
            }
        },
        {
            id: "nspk_code",
            header: translate("resources.paymentTools.financialInstitution.fields.nspk_member_id"),
            accessorKey: "nspk_member_id"
        },
        {
            id: "country_code",
            accessorKey: "country_code",
            header: translate("resources.paymentTools.financialInstitution.fields.country_code")
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
        createDialogOpen,
        columns,
        setCreateDialogOpen
    };
};
