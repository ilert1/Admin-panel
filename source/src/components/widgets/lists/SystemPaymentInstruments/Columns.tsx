import { ColumnDef } from "@tanstack/react-table";
import { ListControllerResult, useTranslate } from "react-admin";
import { useState } from "react";
import { SystemPaymentInstrument } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { TextField } from "@/components/ui/text-field";
import { Button, ShowButton, TrashButton } from "@/components/ui/Button";
import { useSheets } from "@/components/providers/SheetProvider";
import { PaymentTypeIcon } from "../../components/PaymentTypeIcon";
import { Badge } from "@/components/ui/badge";
import { ColumnSortingButton, SortingState } from "../../shared";

export const useGetSystemPaymentInstrumentsColumns = ({ listContext }: { listContext: ListControllerResult }) => {
    const translate = useTranslate();
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [chosenId, setChosenId] = useState<string>("");
    const [showEditDialogOpen, setShowEditDialogOpen] = useState(false);
    const [showDeleteDialogOpen, setShowDeleteDialogOpen] = useState(false);
    const { openSheet } = useSheets();
    const [sort, setSort] = useState<SortingState>({
        field: listContext.sort.field || "",
        order: listContext.sort.order || "ASC"
    });

    const handleDeleteClicked = (id: string) => {
        setChosenId(id);
        setShowDeleteDialogOpen(true);
    };

    const columns: ColumnDef<SystemPaymentInstrument>[] = [
        {
            id: "code",
            accessorKey: "code",
            header: translate("resources.paymentSettings.systemPaymentInstruments.list.code"),
            cell: ({ row }) => {
                return (
                    <Button
                        variant={"resourceLink"}
                        onClick={() => {
                            openSheet("systemPaymentInstrument", { id: row.original.code });
                        }}>
                        {row.original.code ?? ""}
                    </Button>
                );
            }
        },
        {
            id: "payment_type_code",
            accessorKey: "payment_type_code",
            header: ({ column }) => (
                <ColumnSortingButton
                    title={translate("resources.paymentSettings.systemPaymentInstruments.list.paymentType")}
                    order={sort.field === column.id ? sort.order : undefined}
                    onChangeOrder={order => {
                        setSort({ field: column.id, order });
                        listContext.setSort({ field: column.id, order });
                    }}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        <PaymentTypeIcon type={row.original.payment_type_code} />
                    </div>
                );
            }
        },
        {
            id: "financial_institution_code",
            accessorKey: "financial_institution_code",
            header: ({ column }) => (
                <ColumnSortingButton
                    title={translate("resources.paymentSettings.systemPaymentInstruments.list.financialInstitution")}
                    order={sort.field === column.id ? sort.order : undefined}
                    onChangeOrder={order => {
                        setSort({ field: column.id, order });
                        listContext.setSort({ field: column.id, order });
                    }}
                />
            ),
            cell: ({ row }) => {
                return (
                    <TextField
                        text={row.original.financial_institution.name}
                        onClick={() => {
                            openSheet("financialInstitution", { id: row.original.financial_institution_code });
                        }}
                        wrap
                        copyValue
                        lineClamp
                        linesCount={1}
                        minWidth="50px"
                    />
                );
            }
        },
        {
            id: "currency_code",
            accessorKey: "currency_code",
            header: ({ column }) => (
                <ColumnSortingButton
                    title={translate("resources.paymentSettings.systemPaymentInstruments.fields.currency_code")}
                    order={sort.field === column.id ? sort.order : undefined}
                    onChangeOrder={order => {
                        setSort({ field: column.id, order });
                        listContext.setSort({ field: column.id, order });
                    }}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto">
                        <Badge key={row.original.currency_code} variant="currency">
                            {row.original.currency_code}
                        </Badge>
                    </div>
                );
            }
        },
        {
            id: "delete_field",
            header: () => {
                return <div className="text-center">{translate("app.ui.actions.delete")}</div>;
            },
            cell: ({ row }) => {
                return <TrashButton onClick={() => handleDeleteClicked(row.original.code)} />;
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <ShowButton
                        onClick={() => {
                            openSheet("systemPaymentInstrument", { id: row.original.code });
                        }}
                    />
                );
            }
        }
    ];
    return {
        columns,
        createDialogOpen,
        setCreateDialogOpen,
        showEditDialogOpen,
        setShowEditDialogOpen,
        showDeleteDialogOpen,
        setShowDeleteDialogOpen,
        chosenId,
        setChosenId
    };
};
