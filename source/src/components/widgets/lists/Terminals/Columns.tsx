import { terminalEndpointsInitProviderAccountsEnigmaV1ProviderProviderNameTerminalTerminalIdInitAccountsPost } from "@/api/enigma/terminal/terminal";
import { useSheets } from "@/components/providers/SheetProvider";
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
    const { openSheet } = useSheets();

    const [showAuthKeyOpen, setShowAuthKeyOpen] = useState(false);
    const [chosenId, setChosenId] = useState("");
    // const [authData, setAuthData] = useState("");
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [createButtonClicked, setCreateButtonClicked] = useState(false);

    const handleEditClicked = (id: string) => {
        setChosenId(id);
        setEditDialogOpen(true);
    };

    const handleDeleteClicked = async (id: string) => {
        setChosenId(id);
        setDeleteDialogOpen(true);
    };

    const handleOpenShowClicked = (id: string, provider: string) => {
        openSheet("terminal", {
            id,
            provider
        });
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
            header: translate("resources.terminals.fields.verbose_name"),
            cell: ({ row }) => {
                return (
                    <Button
                        variant={"resourceLink"}
                        onClick={() => {
                            handleOpenShowClicked(row.original.terminal_id ?? "", row.original.provider);
                        }}>
                        {row.original.verbose_name ?? ""}
                    </Button>
                );
            }
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
        {
            id: "feesIn",
            header: translate("resources.terminals.fields.feePayIn"),
            cell: ({ row }) => {
                const entries = Object.entries(row.original.fees ?? {});
                const d1 = entries.find(el => el[1].direction === 1);

                return <TextField text={d1 ? String((d1[1].value.quantity ?? 0) / (d1[1].value.accuracy ?? 1)) : ""} />;
            }
        },

        {
            id: "feesOut",
            header: translate("resources.terminals.fields.feePayOut"),
            cell: ({ row }) => {
                const entries = Object.entries(row.original.fees ?? {});
                const d2 = entries.find(el => el[1].direction === 2);
                return <TextField text={d2 ? String((d2[1].value.quantity ?? 0) / (d2[1].value.accuracy ?? 1)) : ""} />;
            }
        },
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
                                    openSheet("account", { id: row.original.terminal_id });
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
                                <TextField
                                    className="text-neutral-0"
                                    text={translate("resources.terminals.fields.createAccount")}
                                />
                            </Button>
                        )}
                    </div>
                );
            }
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
        },
        {
            id: "show",
            cell: ({ row }) => (
                <ShowButton
                    onClick={() => {
                        handleOpenShowClicked(row.original.terminal_id ?? "", row.original.provider);
                    }}
                />
            )
        }
    ];

    return {
        columns,
        showAuthKeyOpen,
        chosenId,
        // authData,
        editDialogOpen,
        deleteDialogOpen,
        setEditDialogOpen,
        setShowAuthKeyOpen,
        setDeleteDialogOpen
    };
};
