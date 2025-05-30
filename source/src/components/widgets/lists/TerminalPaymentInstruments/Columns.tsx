import { ColumnDef } from "@tanstack/react-table";
import { useTranslate } from "react-admin";
import { TerminalPaymentInstrument } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { TextField } from "@/components/ui/text-field";
import { TerminalPaymentInstrumentsActivityBtn } from "./TerminalPaymentInstrumentsActivityBtn";

export const useGetTerminalPaymentInstrumentsListColumns = ({ isFetching = false }: { isFetching?: boolean }) => {
    const translate = useTranslate();

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
                    <TextField
                        wrap
                        copyValue
                        lineClamp
                        linesCount={1}
                        minWidth="150px"
                        text={row.original.terminal_id}
                    />
                );
            }
        },
        {
            id: "system_payment_instrument_id",
            accessorKey: "system_payment_instrument_id",
            header: translate("resources.paymentTools.terminalPaymentInstruments.fields.system_payment_instrument_id"),
            cell: ({ row }) => {
                return (
                    <TextField
                        wrap
                        copyValue
                        lineClamp
                        linesCount={1}
                        minWidth="150px"
                        text={row.original.system_payment_instrument_id}
                    />
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
        }
    ];

    return {
        columns
    };
};
