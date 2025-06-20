import { ColumnDef } from "@tanstack/react-table";
import { ListControllerResult, useTranslate } from "react-admin";
import { TerminalPaymentInstrument } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { TextField } from "@/components/ui/text-field";
import { TerminalPaymentInstrumentsActivityBtn } from "./TerminalPaymentInstrumentsActivityBtn";
import { useState } from "react";
import { Button, EditButton } from "@/components/ui/Button";
import { useSheets } from "@/components/providers/SheetProvider";
import { EyeIcon, Save, X } from "lucide-react";
import { Input } from "@/components/ui/Input/input";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { TerminalPaymentInstrumentsProvider } from "@/data/terminalPaymentInstruments";

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
    const [editRowIndex, setEditRowIndex] = useState<number>();
    const [terminalСurrencyСode, setTerminalСurrencyСode] = useState("");
    const [terminalFinancialInstitutionCode, setTerminalFinancialInstitutionCode] = useState("");
    const [terminalPaymentTypeCode, setTerminalPaymentTypeCode] = useState("");

    const onEditClose = () => {
        setTerminalСurrencyСode("");
        setTerminalFinancialInstitutionCode("");
        setTerminalPaymentTypeCode("");
        setEditRowIndex(undefined);
    };

    const onSubmit = async (id: string) => {
        const data: Pick<
            TerminalPaymentInstrument,
            "terminal_currency_code" | "terminal_financial_institution_code" | "terminal_payment_type_code"
        > = {
            terminal_currency_code: terminalСurrencyСode,
            terminal_financial_institution_code: terminalFinancialInstitutionCode,
            terminal_payment_type_code: terminalPaymentTypeCode
        };

        try {
            await terminalPaymentInstrumentsProvider.update("terminalPaymentInstruments", {
                id,
                data,
                previousData: undefined
            });

            appToast("success", translate("app.ui.edit.editSuccess"));

            listContext.refetch();
            onEditClose();
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
            cell: ({ row }) =>
                editRowIndex === row.index ? (
                    <Input className="w-32" value={row.original.terminal.provider} disabled />
                ) : (
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
            cell: ({ row }) =>
                editRowIndex === row.index ? (
                    <Input value={row.original.system_payment_instrument.name} disabled />
                ) : (
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
            cell: ({ row }) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const [value, setValue] = useState(terminalСurrencyСode);

                return editRowIndex === row.index ? (
                    <Input
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        onBlur={() => setTerminalСurrencyСode(value)}
                    />
                ) : (
                    <TextField text={row.original.terminal_currency_code || ""} />
                );
            }
        },
        {
            id: "terminal_financial_institution_code",
            accessorKey: "terminal_financial_institution_code",
            header: translate(
                "resources.paymentSettings.terminalPaymentInstruments.fields.terminal_financial_institution_code"
            ),
            cell: ({ row }) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const [value, setValue] = useState(terminalFinancialInstitutionCode);

                return editRowIndex === row.index ? (
                    <Input
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        onBlur={() => setTerminalFinancialInstitutionCode(value)}
                    />
                ) : (
                    <TextField text={row.original.terminal_financial_institution_code || ""} />
                );
            }
        },
        {
            id: "terminal_payment_type_code",
            accessorKey: "terminal_payment_type_code",
            header: translate("resources.paymentSettings.terminalPaymentInstruments.fields.terminal_payment_type_code"),
            cell: ({ row }) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const [value, setValue] = useState(terminalPaymentTypeCode);

                return editRowIndex === row.index ? (
                    <Input
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        onBlur={() => setTerminalPaymentTypeCode(value)}
                    />
                ) : (
                    <TextField text={row.original.terminal_payment_type_code || ""} />
                );
            }
        },
        {
            id: "direction",
            header: translate("resources.paymentSettings.systemPaymentInstruments.list.direction"),
            cell: ({ row }) =>
                editRowIndex === row.index ? (
                    <Input
                        disabled
                        value={
                            row.original.direction
                                ? translate(`resources.direction.types.${row.original.direction}`)
                                : ""
                        }
                    />
                ) : (
                    <TextField
                        text={
                            row.original.direction
                                ? translate(`resources.direction.types.${row.original.direction}`)
                                : ""
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
                    isFetching={listContext.isFetching || editRowIndex === row.index}
                />
            )
        },
        {
            id: "edit",
            header: translate("app.ui.actions.edit"),
            cell: ({ row }) => {
                return editRowIndex === row.index ? (
                    <div className="my-1.5 flex justify-center">
                        <Button
                            onClick={() => onSubmit(row.original.id)}
                            variant="text_btn"
                            disabled={listContext.isFetching}
                            className="h-8 w-8 bg-transparent p-0 disabled:grayscale">
                            <Save className="h-6 w-6" />
                        </Button>
                    </div>
                ) : (
                    <EditButton
                        disabled={listContext.isFetching}
                        onClick={() => {
                            setTerminalСurrencyСode(row.original.terminal_currency_code || "");
                            setTerminalFinancialInstitutionCode(row.original.terminal_financial_institution_code || "");
                            setTerminalPaymentTypeCode(row.original.terminal_payment_type_code || "");
                            setEditRowIndex(row.index);
                        }}
                    />
                );
            }
        },
        {
            id: "show",
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    {editRowIndex === row.index ? (
                        <Button onClick={onEditClose} variant="text_btn" className="h-8 w-8 bg-transparent p-0">
                            <X className="h-6 w-6" />
                        </Button>
                    ) : (
                        <Button
                            onClick={() => openSheet("terminalPaymentInstruments", { id: row.original.id })}
                            variant={"text_btn"}>
                            <EyeIcon className="text-green-50 hover:text-green-40" />
                        </Button>
                    )}
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
