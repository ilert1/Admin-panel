import { ColumnDef } from "@tanstack/react-table";
import { useLocale, useTranslate } from "react-admin";
import { useState } from "react";
import { SystemPaymentInstrument } from "@/api/enigma/blowFishEnigmaAPIService.schemas";

export const useGetSystemPaymentInstrumentsColumns = () => {
    const translate = useTranslate();
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const locale = useLocale();

    const columns: ColumnDef<SystemPaymentInstrument>[] = [
        {
            accessorKey: "created_at",
            header: translate("resources.paymentTools.systemPaymentInstruments.fields.createdAt"),
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
            id: "code",
            accessorKey: "code",
            header: translate("resources.paymentTools.systemPaymentInstruments.fields.code"),
            cell: ({ row }) => {
                console.log(row.original);
            }
        },
        {
            id: "title",
            accessorKey: "title",
            header: translate("resources.paymentTools.systemPaymentInstruments.fields.title")
        }
    ];
    return {
        columns,
        createDialogOpen,
        setCreateDialogOpen
    };
};
