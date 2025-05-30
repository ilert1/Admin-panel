import { ColumnDef } from "@tanstack/react-table";
import { useTranslate } from "react-admin";
import { TerminalPaymentInstrument } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { TextField } from "@/components/ui/text-field";
import { TerminalPaymentInstrumentsActivityBtn } from "./TerminalPaymentInstrumentsActivityBtn";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useSheets } from "@/components/providers/SheetProvider";
import { EyeIcon } from "lucide-react";

export const useGetTerminalPaymentInstrumentsListColumns = ({ isFetching = false }: { isFetching?: boolean }) => {
    const translate = useTranslate();
    const { openSheet } = useSheets();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const columns: ColumnDef<TerminalPaymentInstrument>[] = [
        {
            id: "id",
            accessorKey: "id",
            header: translate("resources.paymentTools.terminalPaymentInstruments.fields.id"),
            cell: ({ row }) => {
                return <TextField wrap copyValue lineClamp linesCount={1} minWidth="150px" text={row.original.id} />;
            }
        },
        {
            id: "terminal_id",
            accessorKey: "terminal_id",
            header: translate("resources.paymentTools.terminalPaymentInstruments.fields.terminal_id"),
            cell: ({ row }) => {
                return (
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
                );
            }
        },
        {
            id: "system_payment_instrument_id",
            accessorKey: "system_payment_instrument_id",
            header: translate("resources.paymentTools.terminalPaymentInstruments.fields.system_payment_instrument_id"),
            cell: ({ row }) => {
                return (
                    <div>
                        <Button
                            variant={"resourceLink"}
                            onClick={() => {
                                openSheet("systemPaymentInstrument", {
                                    id: row.original.system_payment_instrument_id
                                });
                            }}>
                            {row.original.system_payment_instrument.name}
                        </Button>

                        <TextField
                            className="text-neutral-70"
                            text={row.original.system_payment_instrument_id}
                            wrap
                            copyValue
                            lineClamp
                            linesCount={1}
                            minWidth="50px"
                        />
                    </div>
                );
            }
        },
        {
            id: "terminal_currency_code",
            accessorKey: "terminal_currency_code",
            header: translate("resources.paymentTools.terminalPaymentInstruments.fields.terminal_currency_code"),
            cell: ({ row }) => <TextField text={row.original.terminal_currency_code || ""} />
        },
        {
            id: "terminal_financial_institution_code",
            accessorKey: "terminal_financial_institution_code",
            header: translate(
                "resources.paymentTools.terminalPaymentInstruments.fields.terminal_financial_institution_code"
            ),
            cell: ({ row }) => <TextField text={row.original.terminal_financial_institution_code || ""} />
        },
        {
            id: "status",
            accessorKey: "status",
            header: translate("resources.paymentTools.terminalPaymentInstruments.fields.status"),
            cell: ({ row }) => {
                return (
                    <TerminalPaymentInstrumentsActivityBtn
                        id={row.original.id}
                        terminalPaymentInstrumentName={row.original.id}
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
                            onClick={() => openSheet("terminalPaymentInstruments", { id: row.original.id })}
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
        columns,
        createDialogOpen,
        setCreateDialogOpen
    };
};
