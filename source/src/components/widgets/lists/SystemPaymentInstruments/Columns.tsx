import { ColumnDef } from "@tanstack/react-table";
import { useTranslate } from "react-admin";
import { useState } from "react";
import { SystemPaymentInstrument } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { TextField } from "@/components/ui/text-field";
import { Button, ShowButton, TrashButton } from "@/components/ui/Button";
import { useSheets } from "@/components/providers/SheetProvider";
import { PaymentTypeIcon } from "../../components/PaymentTypeIcon";

export const useGetSystemPaymentInstrumentsColumns = () => {
    const translate = useTranslate();
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
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
            id: "paymentType",
            header: translate("resources.paymentSettings.systemPaymentInstruments.list.paymentType"),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        {row.original.payment_type?.meta?.icon ? (
                            <img
                                src={`${row.original.payment_type?.meta["icon"]}`}
                                alt="icon"
                                className="h-6 w-6 fill-white object-contain"
                            />
                        ) : (
                            <PaymentTypeIcon type={row.original.payment_type_code} tooltip />
                        )}
                    </div>
                );
            }
        },
        {
            id: "financial_institution_code",
            accessorKey: "financial_institution_code",
            header: translate("resources.paymentSettings.systemPaymentInstruments.list.financialInstitution"),
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
            id: "Currency",
            header: translate("resources.paymentSettings.systemPaymentInstruments.fields.currency_code"),
            cell: ({ row }) => {
                return <TextField text={row.original.currency_code} />;
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
