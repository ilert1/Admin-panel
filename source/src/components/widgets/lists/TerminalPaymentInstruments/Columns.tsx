/* eslint-disable react-hooks/rules-of-hooks */
import { Cell, ColumnDef } from "@tanstack/react-table";
import { ListControllerResult, useTranslate } from "react-admin";
import { TerminalPaymentInstrument } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { TextField } from "@/components/ui/text-field";
import { TerminalPaymentInstrumentsActivityBtn } from "./TerminalPaymentInstrumentsActivityBtn";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useSheets } from "@/components/providers/SheetProvider";
import { Check, EyeIcon, X } from "lucide-react";
import { Input } from "@/components/ui/Input/input";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { TerminalPaymentInstrumentsProvider } from "@/data/terminalPaymentInstruments";

interface IEditableCell<T> {
    initValue: string;
    cell: Cell<T, unknown>;
    showEdit: boolean;
    setShowEdit: (val: { row: number | undefined; column: number | undefined }) => void;
    onSubmit: (val: string) => void;
}

function EditableCell<T>({ initValue, cell, showEdit, setShowEdit, onSubmit }: IEditableCell<T>) {
    const [value, setValue] = useState(initValue);

    const onExit = () => {
        setShowEdit({ row: undefined, column: undefined });
        setValue(initValue);
    };

    return (
        <div className="flex w-40 items-center gap-2">
            {showEdit ? (
                <>
                    <Input value={value} onChange={e => setValue(e.target.value)} />

                    <div className="flex items-center gap-1">
                        <Button onClick={() => onSubmit(value)} variant="secondary" className="p-0">
                            <Check />
                        </Button>

                        <Button onClick={onExit} variant="secondary" className="p-0 text-red-50 hover:text-red-40">
                            <X />
                        </Button>
                    </div>
                </>
            ) : (
                <TextField
                    type="text"
                    onDoubleClick={() => setShowEdit({ row: cell.row.index, column: cell.column.getIndex() })}
                    lineClamp
                    text={value}
                />
            )}
        </div>
    );
}

export const useGetTerminalPaymentInstrumentsListColumns = ({
    listContext
}: {
    listContext: ListControllerResult<TerminalPaymentInstrument>;
}) => {
    const terminalPaymentInstrumentsProvider = new TerminalPaymentInstrumentsProvider();

    const translate = useTranslate();
    const appToast = useAppToast();
    const { openSheet } = useSheets();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [currentCellEdit, setCurrentCellEdit] = useState<{ row: number | undefined; column: number | undefined }>({
        row: undefined,
        column: undefined
    });

    const onSubmit = async (
        id: string,
        data: Pick<
            TerminalPaymentInstrument,
            "terminal_currency_code" | "terminal_financial_institution_code" | "terminal_payment_type_code"
        >
    ) => {
        try {
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
                                id: row.original.terminal_id,
                                provider: row.original.terminal.provider
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
            id: "system_payment_instrument_id",
            accessorKey: "system_payment_instrument_id",
            header: translate(
                "resources.paymentSettings.terminalPaymentInstruments.fields.system_payment_instrument_id"
            ),
            cell: ({ row }) => (
                <Button
                    variant={"resourceLink"}
                    onClick={() => {
                        openSheet("systemPaymentInstrument", {
                            id: row.original.system_payment_instrument_id
                        });
                    }}>
                    {row.original.system_payment_instrument.name}
                </Button>
            )
        },
        {
            id: "terminal_currency_code",
            accessorKey: "terminal_currency_code",
            header: translate("resources.paymentSettings.terminalPaymentInstruments.fields.terminal_currency_code"),
            cell: ({ row, cell }) => (
                <EditableCell
                    initValue={row.original.terminal_currency_code || ""}
                    cell={cell}
                    showEdit={
                        currentCellEdit.row === cell.row.index &&
                        currentCellEdit.column === cell.column.getIndex() &&
                        !listContext.isFetching
                    }
                    onSubmit={value => onSubmit(row.original.id, { terminal_currency_code: value })}
                    setShowEdit={setCurrentCellEdit}
                />
            )
        },
        {
            id: "terminal_financial_institution_code",
            accessorKey: "terminal_financial_institution_code",
            header: translate(
                "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_financial_institution_code"
            ),
            cell: ({ row, cell }) => (
                <EditableCell
                    initValue={row.original.terminal_financial_institution_code || ""}
                    cell={cell}
                    showEdit={
                        currentCellEdit.row === cell.row.index &&
                        currentCellEdit.column === cell.column.getIndex() &&
                        !listContext.isFetching
                    }
                    onSubmit={value => onSubmit(row.original.id, { terminal_financial_institution_code: value })}
                    setShowEdit={setCurrentCellEdit}
                />
            )
        },
        {
            id: "terminal_payment_type_code",
            accessorKey: "terminal_payment_type_code",
            header: translate("resources.paymentSettings.terminalPaymentInstruments.fields.terminal_payment_type_code"),
            cell: ({ row, cell }) => (
                <EditableCell
                    initValue={row.original.terminal_payment_type_code || ""}
                    cell={cell}
                    showEdit={
                        currentCellEdit.row === cell.row.index &&
                        currentCellEdit.column === cell.column.getIndex() &&
                        !listContext.isFetching
                    }
                    onSubmit={value => onSubmit(row.original.id, { terminal_payment_type_code: value })}
                    setShowEdit={setCurrentCellEdit}
                />
            )
        },
        {
            id: "direction",
            header: translate("resources.paymentSettings.systemPaymentInstruments.list.direction"),
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
            header: translate("resources.paymentSettings.terminalPaymentInstruments.fields.status"),
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
        setCreateDialogOpen
    };
};
