import { terminalEndpointsInitProviderAccountsEnigmaV1ProviderProviderNameTerminalTerminalIdInitAccountsPost } from "@/api/enigma/terminal/terminal";
import { Button, EditButton, ShowButton, TrashButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { TerminalWithId } from "@/data/terminals";
import { ColumnDef } from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useRefresh, useTranslate } from "react-admin";

export type MerchantTypeToShow = "fees" | "directions" | undefined;

export const useGetTerminalColumns = () => {
    const translate = useTranslate();
    const refresh = useRefresh();
    const appToast = useAppToast();

    const [showAuthKeyOpen, setShowAuthKeyOpen] = useState(false);
    const [chosenId, setChosenId] = useState("");
    const [chosenProvider, setChosenProvider] = useState("");
    const [authData, setAuthData] = useState("");
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [showTerminal, setShowTerminal] = useState(false);
    const [showAccountClicked, setShowAccountClicked] = useState(false);
    const [createButtonClicked, setCreateButtonClicked] = useState(false);

    const handleEditClicked = (id: string) => {
        setChosenId(id);
        setEditDialogOpen(true);
    };

    const handleDeleteClicked = async (id: string) => {
        setChosenId(id);
        setDeleteDialogOpen(true);
    };

    const handleCreateAccountClicked = async (provider: string, terminal_id: string) => {
        setCreateButtonClicked(true);
        try {
            const { data } =
                await terminalEndpointsInitProviderAccountsEnigmaV1ProviderProviderNameTerminalTerminalIdInitAccountsPost(
                    provider,
                    terminal_id,
                    {
                        headers: {
                            authorization: `Bearer ${localStorage.getItem("access-token")}`
                        }
                    }
                );
            if (!("data" in data)) {
                throw new Error("Http error");
            }

            if (data.success) {
                appToast("success", translate("resources.terminals.accountCreatedSuccessfully"));
            } else {
                throw new Error(data.error?.error_message);
            }
            refresh();
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
        }
        setCreateButtonClicked(false);
    };

    const columns: ColumnDef<TerminalWithId>[] = [
        {
            id: "id",
            accessorKey: "id",
            header: translate("resources.terminals.fields.id"),
            cell: ({ row }) => {
                return (
                    <TextField
                        text={row.original.terminal_id}
                        wrap
                        copyValue
                        lineClamp
                        linesCount={1}
                        minWidth="50px"
                    />
                );
            }
        },
        {
            id: "verbose_name",
            accessorKey: "verbose_name",
            header: translate("resources.terminals.fields.verbose_name")
        },
        {
            id: "description",
            accessorKey: "description",
            header: translate("resources.terminals.fields.description"),
            cell: ({ row }) => {
                return <TextField text={row.original.description ? row.original?.description : ""} wrap />;
            }
        },
        {
            id: "provider",
            accessorKey: "provider",
            header: translate("resources.terminals.fields.provider"),
            cell: ({ row }) => {
                return <TextField text={row.original.provider} />;
            }
        },
        /* {
            id: "auth",
            accessorKey: "auth",
            header: translate("resources.terminals.fields.auth"),
            cell: ({ row }) => {
                const buttonDisabeled = Object.keys(row.original.auth || {}).length === 0;
                return (
                    <ShowButton
                        disabled={buttonDisabeled}
                        onClick={() => {
                            setAuthData(JSON.stringify(row.original.auth));
                            setShowAuthKeyOpen(true);
                        }}
                    />
                );
            }
        }, */
        {
            id: "account",
            header: () => {
                return <div className="text-center">{translate("resources.terminals.fields.account")}</div>;
            },
            cell: ({ row }) => {
                const isAcount = row.original.account_created;

                return (
                    <div className="flex justify-center">
                        {isAcount ? (
                            <ShowButton
                                onClick={() => {
                                    setChosenId(row.original.terminal_id);
                                    setChosenProvider(row.original.provider);
                                    setShowAccountClicked(true);
                                }}
                            />
                        ) : (
                            <Button
                                className="flex gap-1"
                                disabled={createButtonClicked}
                                onClick={() =>
                                    handleCreateAccountClicked(row.original.provider, row.original.terminal_id)
                                }>
                                <PlusCircle className="h-4 w-4" />
                                <TextField text={translate("resources.terminals.fields.createAccount")} />
                            </Button>
                        )}
                    </div>
                );
            }
        },
        {
            id: "show",
            header: () => {
                return <div className="text-center">{translate("app.ui.actions.show")}</div>;
            },
            cell: ({ row }) => (
                <ShowButton
                    onClick={() => {
                        setChosenId(row.original.terminal_id);
                        setChosenProvider(row.original.provider);
                        setShowTerminal(true);
                    }}
                />
            )
        },
        {
            id: "update_field",
            header: () => {
                return <div className="text-center">{translate("app.ui.actions.edit")}</div>;
            },
            cell: ({ row }) => {
                return <EditButton onClick={() => handleEditClicked(row.original.terminal_id)} />;
            }
        },
        {
            id: "delete_field",
            header: () => {
                return <div className="text-center">{translate("app.ui.actions.delete")}</div>;
            },
            cell: ({ row }) => {
                return <TrashButton onClick={() => handleDeleteClicked(row.original.terminal_id)} />;
            }
        }
    ];

    return {
        columns,
        showAuthKeyOpen,
        showTerminal,
        chosenId,
        authData,
        editDialogOpen,
        deleteDialogOpen,
        chosenProvider,
        showAccountClicked,
        setShowAccountClicked,
        setEditDialogOpen,
        setShowAuthKeyOpen,
        setDeleteDialogOpen,
        setShowTerminal
    };
};
