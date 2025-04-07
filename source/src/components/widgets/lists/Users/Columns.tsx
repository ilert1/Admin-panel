import { useSheets } from "@/components/providers/SheetProvider";
import { Button, ShowButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { ToggleActiveUser } from "@/components/ui/toggle-active-user";
import { useGetMerchantIdByName } from "@/hooks/useGetMerchantName";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslate } from "react-admin";

// const styles = ["bg-green-50", "bg-red-50", "bg-extra-2", "bg-extra-8"];
// const translations = ["active", "frozen", "blocked", "deleted"];

export const useGetUserColumns = () => {
    const translate = useTranslate();
    const { openSheet } = useSheets();
    const { getMerchantId, isLoadingMerchants } = useGetMerchantIdByName();

    // const [locale] = useLocaleState();

    const handleOpenSheet = (id: string) => {
        openSheet("user", { id });
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
                        {userName && (
                            <Button
                                variant={"resourceLink"}
                                onClick={() => {
                                    handleOpenSheet(row.original.id);
                                }}>
                                {userName ?? ""}
                            </Button>
                        )}
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

            cell: ({ row }) => {
                const merchId = getMerchantId(row.original.merchant_id);

                return (
                    <div>
                        {merchId && (
                            <TextField
                                text={row.original.merchant_name ?? ""}
                                onClick={
                                    merchId
                                        ? () => {
                                              openSheet("merchant", {
                                                  id: merchId,
                                                  merchantName: row.original.merchant_name
                                              });
                                          }
                                        : undefined
                                }
                            />
                        )}
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
                );
            }
        },
        {
            id: "active",
            accessorKey: "active",
            header: translate("resources.users.fields.active"),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        <ToggleActiveUser active={row.original.activity} />
                    </div>
                );
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return <ShowButton onClick={() => handleOpenSheet(row.original.id)} />;
            }
        }
    ];

    return {
        columns,
        isLoadingMerchants
    };
};
