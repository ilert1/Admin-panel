import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
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
            id: "id",
            accessorKey: "id",
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
                return (
                    <Button onClick={() => openSheet(row.original.id)} variant="text_btn" className="w-full p-0">
                        <span className="sr-only">Open menu</span>
                        <EyeIcon className="text-green-50 size-7" />
                    </Button>
                );
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
