import { ColumnDef } from "@tanstack/react-table";
import { useTranslate } from "react-admin";
import { useState } from "react";
import { SystemPaymentInstrument } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { TextField } from "@/components/ui/text-field";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button, ShowButton, TrashButton } from "@/components/ui/Button";
import { useSheets } from "@/components/providers/SheetProvider";
import { PaymentTypeIcon } from "../../components/PaymentTypeIcon";
import { SystemPaymentInstrumentsActivityBtn } from "./SystemPaymentInstrumentsActivityBtn";

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
            id: "instrument",
            accessorKey: "id",
            header: translate("resources.paymentTools.systemPaymentInstruments.list.name"),
            cell: ({ row }) => {
                return (
                    <div>
                        <Button
                            variant={"resourceLink"}
                            onClick={() => {
                                openSheet("systemPaymentInstrument", { id: row.original.id });
                            }}>
                            {row.original.name ?? ""}
                        </Button>
                        <TextField
                            text={row.original.id}
                            wrap
                            copyValue
                            lineClamp
                            linesCount={1}
                            minWidth="50px"
                            className="text-neutral-70"
                        />
                    </div>
                );
            }
        },
        {
            id: "paymentType",
            header: translate("resources.paymentTools.systemPaymentInstruments.list.paymentType"),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        {row.original.payment_type?.meta?.icon ? (
                            <img
                                src={row.original.payment_type?.meta["icon"]}
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
            id: "financial_institution_id",
            accessorKey: "financial_institution_id",
            header: translate("resources.paymentTools.systemPaymentInstruments.list.financialInstitution"),
            cell: ({ row }) => {
                return (
                    <TextField
                        text={row.original.financial_institution.name}
                        onClick={() => {
                            openSheet("financialInstitution", { id: row.original.financial_institution_id });
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
            id: "direction",
            header: translate("resources.paymentTools.systemPaymentInstruments.list.direction"),
            cell: ({ row }) => {
                return <TextField text={row.original.direction} />;
            }
        },
        {
            id: "Currency",
            header: translate("resources.paymentTools.systemPaymentInstruments.fields.currency_code"),
            cell: ({ row }) => {
                return <TextField text={row.original.currency_code} />;
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
                return row.original.status !== "test_only" ? (
                    <SystemPaymentInstrumentsActivityBtn
                        activityState={row.original.status === "active" ? true : false}
                        id={row.original.id}
                        systemPaymentInstrumentName={row.original.name}
                    />
                ) : (
                    <div className="flex items-center justify-center">
                        <Badge
                            className={cn("rounded-[20px] px-[12px] py-[6px] !text-title-2 text-white", {
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
