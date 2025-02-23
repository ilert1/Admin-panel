import { ShowButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useLocaleState, useTranslate } from "react-admin";

const styles = ["bg-green-50", "bg-red-50", "bg-extra-2", "bg-extra-8"];
const translations = ["active", "frozen", "blocked", "deleted"];

export const useGetUserColumns = () => {
    const translate = useTranslate();
    const [locale] = useLocaleState();

    const [userId, setUserId] = useState("");
    const [showOpen, setShowOpen] = useState(false);

    const openSheet = (id: string) => {
        setUserId(id);
        setShowOpen(true);
    };

    const columns: ColumnDef<Users.User>[] = [
        {
            id: "created_at",
            accessorKey: "created_at",
            header: translate("resources.users.fields.created_at"),
            cell: ({ row }) => (
                <>
                    <p className="text-nowrap">{new Date(row.original.created_at).toLocaleDateString(locale)}</p>
                    <p className="text-nowrap">{new Date(row.original.created_at).toLocaleTimeString(locale)}</p>
                </>
            )
        },
        {
            id: "merchant_id",
            accessorKey: "merchant_id",
            header: translate("resources.users.fields.id"),
            cell: ({ row }) => <TextField text={row.original.id} copyValue lineClamp linesCount={1} minWidth="50px" />
        },
        {
            id: "name",
            accessorKey: "name",
            header: translate("resources.users.fields.name"),
            cell: ({ row }) => <TextField text={row.original.name} copyValue wrap />
        },
        {
            accessorKey: "active",
            header: () => {
                return <div className="text-center">{translate("resources.users.fields.active")}</div>;
            },
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        <span
                            className={`px-3 py-0.5 rounded-20 font-normal text-white text-base text-center ${
                                row.original.state > translations.length ? "" : styles[row.original.state - 1]
                            }`}>
                            {row.original.state > translations.length
                                ? "-"
                                : translate(`resources.accounts.fields.states.${translations[row.original.state - 1]}`)}
                        </span>
                    </div>
                );
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return <ShowButton onClick={() => openSheet(row.original.id)} />;
            }
        }
    ];

    return {
        columns,
        userId,
        showOpen,
        setShowOpen
    };
};
