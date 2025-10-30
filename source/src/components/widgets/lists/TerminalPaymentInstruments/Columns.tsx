import { ColumnDef } from "@tanstack/react-table";
import { ListControllerResult, useTranslate } from "react-admin";
import { TerminalPaymentInstrument } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { TextField } from "@/components/ui/text-field";
import { TerminalPaymentInstrumentsActivityBtn } from "./TerminalPaymentInstrumentsActivityBtn";
import { useEffect, useState } from "react";
import { Button, TrashButton } from "@/components/ui/Button";
import { useSheets } from "@/components/providers/SheetProvider";
import { EyeIcon } from "lucide-react";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { TerminalPaymentInstrumentsDataProvider } from "@/data/terminalPaymentInstruments";
import { TableEditableCell, CurrentCell, SortingState, ColumnSortingButton } from "../../shared";

export const useGetTerminalPaymentInstrumentsListColumns = ({
    listContext
}: {
    listContext: ListControllerResult<TerminalPaymentInstrument>;
}) => {
    const terminalPaymentInstrumentsProvider = new TerminalPaymentInstrumentsDataProvider();

    const translate = useTranslate();
    const appToast = useAppToast();
    const { openSheet } = useSheets();

    const [chosenId, setChosenId] = useState("");
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [showDeleteDialogOpen, setShowDeleteDialogOpen] = useState(false);
    const [isDataUpdating, setIsDataUpdating] = useState(false);

    const [sort, setSort] = useState<SortingState>({
        field: listContext.sort.field || "",
        order: listContext.sort.order || "ASC"
    });

    const [currentCellEdit, setCurrentCellEdit] = useState<CurrentCell>({
        row: undefined,
        column: undefined
    });

    const handleDeleteClicked = (id: string) => {
        setChosenId(id);
        setShowDeleteDialogOpen(true);
    };

    useEffect(() => {
        if (currentCellEdit.row || currentCellEdit.column) {
            setCurrentCellEdit({
                row: undefined,
                column: undefined
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listContext.filterValues]);

    const onSubmit = async (
        id: string,
        data: Pick<
            TerminalPaymentInstrument,
            | "terminal_currency_code"
            | "terminal_country"
            | "terminal_financial_institution_code"
            | "terminal_financial_institution_outgoing_code"
            | "terminal_payment_type_code"
        >
    ) => {
        try {
            setIsDataUpdating(true);

            await terminalPaymentInstrumentsProvider.update("terminalPaymentInstruments", {
                id,
                data,
                previousData: undefined
            });

            appToast("success", translate("app.ui.edit.editSuccess"));

            listContext.refetch();

            setCurrentCellEdit({
                row: undefined,
                column: undefined
            });
        } catch (error) {
            if (error instanceof Error) {
                appToast("error", error.message);
            } else {
                appToast("error", translate("app.ui.create.createError"));
            }
        } finally {
            setIsDataUpdating(false);
        }
    };

    const columns: ColumnDef<TerminalPaymentInstrument>[] = [
        {
            id: "terminal_id",
            accessorKey: "terminal_id",
            header: translate("resources.paymentSettings.terminalPaymentInstruments.fields.terminal_id"),
            cell: ({ row }) => (
                <div>
                    <Button
                        variant={"resourceLink"}
                        onClick={() => {
                            openSheet("terminal", {
                                id: row.original.terminal_id
                            });
                        }}>
                        {row.original.terminal.verbose_name}
                    </Button>

                    <TextField
                        className="text-neutral-70"
                        text={row.original.terminal_id}
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
            id: "system_payment_instrument_code",
            accessorKey: "system_payment_instrument_code",
            header: ({ column }) => (
                <ColumnSortingButton
                    title={translate(
                        "resources.paymentSettings.terminalPaymentInstruments.fields.system_payment_instrument_code"
                    )}
                    order={sort.field === column.id ? sort.order : undefined}
                    onChangeOrder={order => {
                        setSort({ field: column.id, order });
                        listContext.setSort({ field: column.id, order });
                    }}
                />
            ),
            cell: ({ row }) => (
                <Button
                    variant={"resourceLink"}
                    onClick={() => {
                        openSheet("systemPaymentInstrument", {
                            id: row.original.system_payment_instrument_code
                        });
                    }}>
                    {row.original.system_payment_instrument_code}
                </Button>
            )
        },
        {
            id: "terminal_currency_code",
            accessorKey: "terminal_currency_code",
            header: ({ column }) => (
                <ColumnSortingButton
                    title={translate(
                        "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_currency_code"
                    )}
                    order={sort.field === column.id ? sort.order : undefined}
                    onChangeOrder={order => {
                        setSort({ field: column.id, order });
                        listContext.setSort({ field: column.id, order });
                    }}
                />
            ),
            cell: ({ row, cell }) => {
                const currentCellBoolean =
                    currentCellEdit.row === cell.row.index && currentCellEdit.column === cell.column.getIndex();

                return (
                    <TableEditableCell
                        initValue={row.original.terminal_currency_code || ""}
                        cell={cell}
                        showEdit={currentCellBoolean && !listContext.isFetching}
                        isFetching={
                            (currentCellBoolean && listContext.isFetching) || (currentCellBoolean && isDataUpdating)
                        }
                        onSubmit={value => onSubmit(row.original.id, { terminal_currency_code: value })}
                        setShowEdit={setCurrentCellEdit}
                    />
                );
            }
        },
        {
            id: "terminal_country",
            accessorKey: "terminal_country",
            header: ({ column }) => (
                <ColumnSortingButton
                    title={translate("resources.paymentSettings.terminalPaymentInstruments.fields.terminal_country")}
                    order={sort.field === column.id ? sort.order : undefined}
                    onChangeOrder={order => {
                        setSort({ field: column.id, order });
                        listContext.setSort({ field: column.id, order });
                    }}
                />
            ),
            cell: ({ row, cell }) => {
                const currentCellBoolean =
                    currentCellEdit.row === cell.row.index && currentCellEdit.column === cell.column.getIndex();

                return (
                    <TableEditableCell
                        initValue={row.original.terminal_country || ""}
                        cell={cell}
                        showEdit={currentCellBoolean && !listContext.isFetching}
                        isFetching={
                            (currentCellBoolean && listContext.isFetching) || (currentCellBoolean && isDataUpdating)
                        }
                        onSubmit={value => onSubmit(row.original.id, { terminal_country: value })}
                        setShowEdit={setCurrentCellEdit}
                    />
                );
            }
        },
        {
            id: "terminal_financial_institution_code",
            accessorKey: "terminal_financial_institution_code",
            header: ({ column }) => (
                <ColumnSortingButton
                    title={translate(
                        "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_financial_institution_code"
                    )}
                    order={sort.field === column.id ? sort.order : undefined}
                    onChangeOrder={order => {
                        setSort({ field: column.id, order });
                        listContext.setSort({ field: column.id, order });
                    }}
                />
            ),
            cell: ({ row, cell }) => {
                const currentCellBoolean =
                    currentCellEdit.row === cell.row.index && currentCellEdit.column === cell.column.getIndex();

                return (
                    <TableEditableCell
                        initValue={row.original.terminal_financial_institution_code || ""}
                        cell={cell}
                        showEdit={currentCellBoolean && !listContext.isFetching}
                        isFetching={
                            (currentCellBoolean && listContext.isFetching) || (currentCellBoolean && isDataUpdating)
                        }
                        onSubmit={value => onSubmit(row.original.id, { terminal_financial_institution_code: value })}
                        setShowEdit={setCurrentCellEdit}
                    />
                );
            }
        },
        {
            id: "terminal_financial_institution_outgoing_code",
            accessorKey: "terminal_financial_institution_outgoing_code",
            header: ({ column }) => (
                <ColumnSortingButton
                    title={translate(
                        "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_financial_institution_outgoing_code"
                    )}
                    order={sort.field === column.id ? sort.order : undefined}
                    onChangeOrder={order => {
                        setSort({ field: column.id, order });
                        listContext.setSort({ field: column.id, order });
                    }}
                />
            ),
            cell: ({ row, cell }) => {
                const currentCellBoolean =
                    currentCellEdit.row === cell.row.index && currentCellEdit.column === cell.column.getIndex();

                return (
                    <TableEditableCell
                        initValue={row.original.terminal_financial_institution_outgoing_code || ""}
                        cell={cell}
                        showEdit={currentCellBoolean && !listContext.isFetching}
                        isFetching={
                            (currentCellBoolean && listContext.isFetching) || (currentCellBoolean && isDataUpdating)
                        }
                        onSubmit={value =>
                            onSubmit(row.original.id, { terminal_financial_institution_outgoing_code: value })
                        }
                        setShowEdit={setCurrentCellEdit}
                    />
                );
            }
        },
        {
            id: "terminal_payment_type_code",
            accessorKey: "terminal_payment_type_code",
            header: ({ column }) => (
                <ColumnSortingButton
                    title={translate(
                        "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_payment_type_code"
                    )}
                    order={sort.field === column.id ? sort.order : undefined}
                    onChangeOrder={order => {
                        setSort({ field: column.id, order });
                        listContext.setSort({ field: column.id, order });
                    }}
                />
            ),
            cell: ({ row, cell }) => {
                const currentCellBoolean =
                    currentCellEdit.row === cell.row.index && currentCellEdit.column === cell.column.getIndex();

                return (
                    <TableEditableCell
                        initValue={row.original.terminal_payment_type_code || ""}
                        cell={cell}
                        showEdit={currentCellBoolean && !listContext.isFetching}
                        isFetching={
                            (currentCellBoolean && listContext.isFetching) || (currentCellBoolean && isDataUpdating)
                        }
                        onSubmit={value => onSubmit(row.original.id, { terminal_payment_type_code: value })}
                        setShowEdit={setCurrentCellEdit}
                    />
                );
            }
        },
        {
            id: "direction",
            header: ({ column }) => (
                <ColumnSortingButton
                    title={translate("resources.paymentSettings.systemPaymentInstruments.list.direction")}
                    order={sort.field === column.id ? sort.order : undefined}
                    onChangeOrder={order => {
                        setSort({ field: column.id, order });
                        listContext.setSort({ field: column.id, order });
                    }}
                />
            ),
            cell: ({ row }) => (
                <TextField
                    text={
                        row.original.direction ? translate(`resources.direction.types.${row.original.direction}`) : ""
                    }
                />
            )
        },
        {
            id: "status",
            accessorKey: "status",
            header: ({ column }) => (
                <ColumnSortingButton
                    title={translate("resources.paymentSettings.terminalPaymentInstruments.fields.status")}
                    order={sort.field === column.id ? sort.order : undefined}
                    onChangeOrder={order => {
                        setSort({ field: column.id, order });
                        listContext.setSort({ field: column.id, order });
                    }}
                />
            ),
            cell: ({ row }) => (
                <TerminalPaymentInstrumentsActivityBtn
                    id={row.original.id}
                    terminalPaymentInstrumentName={row.original.id}
                    activityState={row.original.status === "ACTIVE" ? true : false}
                    isFetching={listContext.isFetching}
                />
            )
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
            id: "show",
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <Button
                        onClick={() => openSheet("terminalPaymentInstruments", { id: row.original.id })}
                        variant={"text_btn"}>
                        <EyeIcon className="text-green-50 hover:text-green-40" />
                    </Button>
                </div>
            )
        }
    ];

    return {
        translate,
        columns,
        createDialogOpen,
        setCreateDialogOpen,
        showDeleteDialogOpen,
        setShowDeleteDialogOpen,
        chosenId,
        setChosenId
    };
};
