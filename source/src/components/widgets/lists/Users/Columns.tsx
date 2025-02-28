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
        /* {
            id: "created_at",
            accessorKey: "created_at",
            header: translate("resources.users.fields.created_at"),
            cell: ({ row }) => (
                <>
                    <p className="text-nowrap">{new Date(row.original.created_at).toLocaleDateString(locale)}</p>
                    <p className="text-nowrap">{new Date(row.original.created_at).toLocaleTimeString(locale)}</p>
                </>
            )
        }, */
        {
            id: "keycloack_id",
            accessorKey: "keycloack_id",
            header: translate("resources.users.fields.keycloack_id"),
            cell: ({ row }) => <TextField text={row.original.id} copyValue lineClamp linesCount={1} minWidth="50px" />
        },
        {
            id: "name",
            accessorKey: "name",
            header: translate("resources.users.fields.name"),
            cell: ({ row }) => (
                <div>
                    <TextField text={row.original.name} />
                    <TextField
                        text={row.original.email}
                        copyValue
                        lineClamp
                        linesCount={1}
                        minWidth="50px"
                        className="text-neutral-70"
                    />
                </div>
            )
        },
        {
            id: "login",
            accessorKey: "login",
            header: translate("resources.users.fields.login"),
            cell: ({ row }) => <TextField text={row.original.login} copyValue wrap />
        },
        {
            id: "roles",
            accessorKey: "roles",
            header: translate("resources.users.fields.roles"),
            cell: ({ row }) => {
                return row.original.roles?.map(role => <TextField text={role.name} />);
            }
        },
        {
            id: "merchant",
            accessorKey: "merchant",
            header: translate("resources.users.fields.merchant"),
            cell: ({ row }) => <TextField text={row.original.mercahnt_id} copyValue wrap />
        },
        /* {
            id: "active",
            accessorKey: "active",
            header: translate("resources.users.fields.active"),
            cell: ({ row }) => <TextField text={row.original.state == 1 ? "+" : "-"} />
        }, */
        /* {
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
        }, */
        {
            id: "actions",
            cell: ({ row }) => {
                console.log("User", row.original);
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
