import { ColumnDef } from "@tanstack/react-table";
import { useLocale, useTranslate } from "react-admin";
import { useState } from "react";
import { SystemPaymentInstrument } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { TextField } from "@/components/ui/text-field";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ShowButton, TrashButton } from "@/components/ui/Button";
import { useSheets } from "@/components/providers/SheetProvider";

export const useGetSystemPaymentInstrumentsColumns = () => {
    const translate = useTranslate();
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const locale = useLocale();
    const [chosenId, setChosenId] = useState<string>("");
    const [showEditDialogOpen, setShowEditDialogOpen] = useState(false);
    const [showDeleteDialogOpen, setShowDeleteDialogOpen] = useState(false);
    const { openSheet } = useSheets();
    // const handleDirectionShowOpen = (id: string) => {
    //     setShowDirectionId(id);
    //     setShowDirectionDialog(true);
    // };

    const handleDeleteClicked = (id: string) => {
        setChosenId(id);
        setShowDeleteDialogOpen(true);
    };

    const columns: ColumnDef<SystemPaymentInstrument>[] = [
        {
            accessorKey: "created_at",
            header: translate("resources.paymentTools.systemPaymentInstruments.list.createdAt"),
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
            header: translate("resources.paymentTools.systemPaymentInstruments.list.updatedAt"),
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
            id: "ID",
            accessorKey: "id",
            header: translate("resources.paymentTools.systemPaymentInstruments.list.id"),
            cell: ({ row }) => {
                return <TextField text={row.original.id} wrap copyValue lineClamp linesCount={1} minWidth="50px" />;
            }
        },
        {
            id: "instrument",
            header: translate("resources.paymentTools.systemPaymentInstruments.list.paymentType"),
            cell: ({ row }) => {
                return (
                    <TextField
                        text={row.original.payment_type_code}
                        copyValue
                        lineClamp
                        linesCount={1}
                        minWidth="50px"
                    />
                );
            }
        },
        {
            id: "payment_type_code",
            header: translate("resources.paymentTools.systemPaymentInstruments.list.paymentTypeCode"),
            cell: ({ row }) => {
                return (
                    <TextField
                        text={row.original.payment_type.code}
                        copyValue
                        lineClamp
                        linesCount={1}
                        minWidth="50px"
                    />
                );
            }
        },
        {
            id: "financial_institution_id",
            accessorKey: "financial_institution_id",
            header: translate("resources.paymentTools.systemPaymentInstruments.list.financialInstitution"),
            cell: ({ row }) => {
                return (
                    <TextField
                        text={row.original.financial_institution.name}
                        onClick={() => {}}
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
            id: "direction",
            header: translate("resources.paymentTools.systemPaymentInstruments.list.direction"),
            cell: ({ row }) => {
                return <TextField text={row.original.direction} />;
            }
        },
        {
            id: "status",
            header: () => (
                <div className="flex items-center justify-center">
                    {translate("resources.paymentTools.systemPaymentInstruments.fields.status")}
                </div>
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        <Badge
                            className={cn("rounded-[20px] px-[12px] py-[6px] !text-title-2", {
                                "bg-green-50 hover:bg-green-50": row.original.status === "active",
                                "bg-red-50 hover:bg-red-50": row.original.status === "inactive",
                                "bg-extra-2 hover:bg-extra-2": row.original.status === "test_only"
                            })}
                            variant="default">
                            {translate(
                                `resources.paymentTools.systemPaymentInstruments.statuses.${row.original.status}`
                            )}
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
                return <TrashButton onClick={() => handleDeleteClicked(row.original.id)} />;
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <ShowButton
                        onClick={() => {
                            openSheet("systemPaymentInstrument", { id: row.original.id });
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
