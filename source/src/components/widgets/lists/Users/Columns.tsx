import { ShowButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslate } from "react-admin";

// const styles = ["bg-green-50", "bg-red-50", "bg-extra-2", "bg-extra-8"];
// const translations = ["active", "frozen", "blocked", "deleted"];

export const useGetUserColumns = () => {
    const translate = useTranslate();
    // const [locale] = useLocaleState();

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
            id: "keycloak_id",
            accessorKey: "keycloak_id",
            header: translate("resources.users.fields.keycloak_id"),
            cell: ({ row }) => <TextField text={row.original.id} copyValue lineClamp linesCount={1} minWidth="50px" />
        },
        {
            id: "name",
            accessorKey: "name",
            header: translate("resources.users.fields.name"),
            cell: ({ row }) => {
                const userName = `${row.original.first_name || ""} ${row.original.last_name || ""}`.trimEnd();
                return (
                    <div>
                        {userName && <TextField text={userName} />}
                        {row.original.email && (
                            <TextField
                                text={row.original.email}
                                copyValue
                                lineClamp
                                linesCount={1}
                                minWidth="50px"
                                className="text-neutral-70"
                            />
                        )}
                    </div>
                );
            }
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
                return row.original.roles?.map((role, index) => (
                    <TextField key={index} text={translate(`resources.users.roles.${role.name}`)} />
                ));
            }
        },
        {
            id: "merchant",
            accessorKey: "merchant",
            header: translate("resources.users.fields.merchant"),
            // cell: ({ row }) => <TextField text={row.original.merchant_id} copyValue wrap />

            cell: ({ row }) => (
                <div>
                    {row.original.merchant_name && <TextField text={row.original.merchant_name} wrap />}
                    <TextField
                        className="text-neutral-70"
                        text={row.original.merchant_id}
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
            id: "active",
            accessorKey: "active",
            header: translate("resources.users.fields.active"),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        <span
                            className={`px-3 py-0.5 rounded-20 font-normal text-white text-base text-center ${
                                row.original.activity ? "bg-green-50" : "bg-extra-2"
                            }`}>
                            {translate(
                                `resources.accounts.fields.states.${row.original.activity ? "active" : "blocked"}`
                            )}
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
