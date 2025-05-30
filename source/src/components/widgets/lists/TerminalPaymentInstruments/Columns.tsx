import { ColumnDef } from "@tanstack/react-table";
import { useTranslate } from "react-admin";
import { PaymentTypeWithId } from "@/data/payment_types";

export const useGetTerminalPaymentInstrumentsListColumns = () => {
    const translate = useTranslate();

    const columns: ColumnDef<PaymentTypeWithId>[] = [
        {
            id: "code",
            accessorKey: "code",
            header: translate("resources.paymentTools.paymentType.fields.code")
        },
        {
            id: "title",
            accessorKey: "title",
            header: translate("resources.paymentTools.paymentType.fields.title")
        }
    ];
    return {
        columns
    };
};
