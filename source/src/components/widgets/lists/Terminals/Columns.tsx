import { useSheets } from "@/components/providers/SheetProvider";
import { Button, ShowButton, TrashButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { TerminalWithId } from "@/data/terminals";
import { ColumnDef } from "@tanstack/react-table";
import { Copy, PlusCircle } from "lucide-react";
import { useState } from "react";
import { ListControllerResult, useRefresh, useTranslate } from "react-admin";
import { PaymentTypeIcon } from "../../components/PaymentTypeIcon";
import { terminalEndpointsInitProviderAccountsEnigmaV1TerminalTerminalIdInitAccountsPost } from "@/api/enigma/terminal/terminal";
import { Badge } from "@/components/ui/badge";
import { ColumnSortingButton, SortingState } from "../../shared";
import { StateViewer } from "@/components/ui/StateViewer";
import { CountryTextField } from "../../components/CountryTextField";
import { useCountryCodes } from "@/hooks";

export type MerchantTypeToShow = "fees" | "directions" | undefined;

export const useGetTerminalColumns = ({ listContext }: { listContext: ListControllerResult }) => {
    const translate = useTranslate();
    const refresh = useRefresh();
    const appToast = useAppToast();
    const { openSheet } = useSheets();
    const { countryCodesWithFlag } = useCountryCodes();

    const [sort, setSort] = useState<SortingState>({
        field: listContext.sort.field || "",
        order: listContext.sort.order || "ASC"
    });
    const [showAuthKeyOpen, setShowAuthKeyOpen] = useState(false);
    const [chosenId, setChosenId] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [createButtonClicked, setCreateButtonClicked] = useState(false);

    const handleDeleteClicked = async (id: string) => {
        setChosenId(id);
        setDeleteDialogOpen(true);
    };

    const handleOpenShowClicked = (id: string) => {
        openSheet("terminal", {
            id
        });
    };

    const handleCreateAccountClicked = async (terminal_id: string) => {
        setCreateButtonClicked(true);
        try {
            const { data } = await terminalEndpointsInitProviderAccountsEnigmaV1TerminalTerminalIdInitAccountsPost(
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
            id: "verbose_name",
            accessorKey: "verbose_name",
            header: ({ column }) => (
                <ColumnSortingButton
                    title={translate("resources.terminals.terminal")}
                    order={sort.field === column.id ? sort.order : undefined}
                    onChangeOrder={order => {
                        setSort({ field: column.id, order });
                        listContext.setSort({ field: column.id, order });
                    }}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div>
                        <Button
                            variant={"resourceLink"}
                            onClick={() => {
                                openSheet("terminal", {
                                    id: row.original.terminal_id
                                });
                            }}>
                            {row.original.verbose_name ?? ""}
                        </Button>

                        <TextField
                            className="text-neutral-70"
                            text={row.original.terminal_id}
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
            id: "provider",
            accessorKey: "provider",
            header: translate("resources.terminals.fields.provider"),
            cell: ({ row }) => {
                return (
                    <Button
                        variant={"resourceLink"}
                        onClick={() => {
                            openSheet("provider", {
                                id: row.original.provider.id as string
                            });
                        }}>
                        {row.original.provider.name}
                    </Button>
                );
            }
        },
        {
            id: "allocation_timeout_seconds",
            accessorKey: "allocation_timeout_seconds",
            header: translate("resources.terminals.fields.timeout"),
            cell: ({ row }) => {
                return <TextField text={row.original.allocation_timeout_seconds?.toString() ?? ""} wrap />;
            }
        },
        {
            id: "fees",
            header: () => {
                return (
                    <div className="flex flex-col justify-start">
                        <span className="text-[16px]">{translate("resources.terminals.fields.fees")}</span>
                        <span className="text-[16px]">{translate("resources.terminals.fields.pays")}</span>
                    </div>
                );
            },
            cell: ({ row }) => {
                const entries = Object.entries(row.original.fees ?? {});
                const d1 = entries.find(el => el[1].direction === 1);
                const payInValue = d1 && `${String(((d1[1].value.quantity ?? 0) * 100) / (d1[1].value.accuracy ?? 1))}`;
                const d2 = entries.find(el => el[1].direction === 2);
                const payOutValue =
                    d2 && `${String(((d2[1].value.quantity ?? 0) * 100) / (d2[1].value.accuracy ?? 1))}`;

                return (
                    <div className="flex justify-start gap-1">
                        {d1 ? (
                            <span className="">
                                <span className="mr-[1px]">{payInValue}</span>
                                <span className="text-note-2 text-neutral-80 dark:text-neutral-40">%</span>
                            </span>
                        ) : (
                            <span className="flex items-center justify-center text-note-2 text-neutral-80 dark:text-neutral-40">
                                -
                            </span>
                        )}
                        <span>{"/"}</span>
                        {d2 ? (
                            <span className="">
                                <span className="mr-[1px]">{payOutValue}</span>
                                <span className="text-note-2 text-neutral-80 dark:text-neutral-40">%</span>
                            </span>
                        ) : (
                            <span className="flex items-center justify-center text-note-2 text-neutral-80 dark:text-neutral-40">
                                -
                            </span>
                        )}
                    </div>
                );
            }
        },
        {
            id: "source currency",
            accessorKey: "source_currency",
            header: translate("resources.direction.sourceCurrency"),
            cell: ({ row }) => {
                const src_cur = row.original.src_currency?.code;
                return src_cur ? <Badge variant="currency">{src_cur}</Badge> : "-";
            }
        },
        {
            id: "destination currency",
            accessorKey: "destination_currency",
            header: translate("resources.direction.destinationCurrency"),
            cell: ({ row }) => {
                const dst_cur = row.original.dst_currency?.code;
                return dst_cur ? <Badge variant="currency">{dst_cur}</Badge> : "-";
            }
        },
        {
            id: "dst_country_code",
            accessorKey: "dst_country_code",
            header: translate("resources.direction.destinationCountry"),
            cell: ({ row }) => {
                const dst_country = countryCodesWithFlag.find(item => item.alpha2 === row.original.dst_country_code);

                return <CountryTextField text={dst_country?.name || ""} />;
            }
        },
        {
            id: "state",
            accessorKey: "state",
            header: translate("resources.direction.fields.active"),
            cell: ({ row }) =>
                row.original.state ? (
                    <StateViewer value={row.original.state} className="flex w-full justify-center" />
                ) : (
                    <TextField text="" />
                )
        },
        {
            id: "copy_field",
            header: () => {
                return <div className="text-center">{"Callback"}</div>;
            },
            cell: ({ row }) => {
                return row.original.callback_url ? (
                    <Button
                        variant={"text_btn"}
                        className="flex w-full items-center justify-center"
                        onClick={() => {
                            navigator.clipboard.writeText(row.original.callback_url ?? "");
                            appToast("success", "", translate("app.ui.textField.copied"));
                        }}>
                        <Copy className="text-green-50" />
                    </Button>
                ) : (
                    <span className="flex w-full items-center justify-center">-</span>
                );
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
                                onClick={() => handleCreateAccountClicked(row.original.terminal_id)}>
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
            id: "payment_types",
            header: translate("resources.paymentSettings.paymentType.fields.payment_types"),
            cell: ({ row }) => {
                return (
                    <div className="max-w-auto flex min-w-[150px] flex-wrap gap-2">
                        {row.original.payment_types && row.original.payment_types.length > 0
                            ? row.original.payment_types?.map(pt => {
                                  return (
                                      <PaymentTypeIcon
                                          className="h-7 w-7"
                                          key={pt.code}
                                          type={pt.code}
                                          metaIcon={pt.meta?.["icon"]}
                                      />
                                  );
                              })
                            : "-"}
                    </div>
                );
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
                        handleOpenShowClicked(row.original.terminal_id);
                    }}
                />
            )
        }
    ];

    return {
        columns,
        showAuthKeyOpen,
        chosenId,
        deleteDialogOpen,
        setShowAuthKeyOpen,
        setDeleteDialogOpen
    };
};
