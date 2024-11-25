import { ListContextProvider, useInfiniteGetList, useListController, useTranslate } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { UIEvent, useMemo, useState } from "react";
import {} from "react-responsive";
import { Loading, LoadingAlertDialog } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TerminalsListFilter = ({ selectProvider }: { selectProvider: (provider: string) => void }) => {
    const {
        data: providersData,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage: providersNextPage
    } = useInfiniteGetList("provider", {
        pagination: { perPage: 25, page: 1 },
        filter: { sort: "name", asc: "ASC" }
    });

    const translate = useTranslate();

    const [providerName, setProviderName] = useState("");
    const providersLoadingProcess = useMemo(() => isFetchingNextPage && hasNextPage, [isFetchingNextPage, hasNextPage]);

    const onProviderChanged = (provider: string) => {
        setProviderName(provider);
        selectProvider(provider);
    };

    const providerScrollHandler = async (e: UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;

        if (target.scrollHeight - target.scrollTop === target.clientHeight) {
            providersNextPage();
        }
    };

    return (
        <div className="flex flex-col justify-between sm:flex-row sm:items-center md:items-end gap-2 sm:gap-x-4 sm:gap-y-3 flex-wrap">
            <div className="flex flex-1 md:flex-col gap-2 items-center md:items-start min-w-52">
                <span className="md:text-nowrap">{translate("resources.terminals.selectHeader")}</span>

                <Select onValueChange={onProviderChanged} value={providerName}>
                    <SelectTrigger className="text-ellipsis">
                        <SelectValue placeholder={translate("resources.terminals.selectPlaceholder")} />
                    </SelectTrigger>

                    <SelectContent align="start" onScrollCapture={providerScrollHandler}>
                        {providersData?.pages.map(page => {
                            return page.data.map(provider => (
                                <SelectItem key={provider.name} value={provider.name}>
                                    <p className="truncate max-w-36">{provider.name}</p>
                                </SelectItem>
                            ));
                        })}

                        {providersLoadingProcess && (
                            <SelectItem value="null" disabled className="flex max-h-8">
                                <LoadingAlertDialog className="-scale-[.25]" />
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

const TerminalTable = ({ provider, columns }: { provider: string; columns: ColumnDef<Directions.Terminal>[] }) => {
    const terminalsContext = useListController({
        resource: `provider/${provider}/terminal`
    });

    return (
        <ListContextProvider value={terminalsContext}>
            <DataTable columns={columns} />
        </ListContextProvider>
    );
};

export const TerminalsList = () => {
    const providerContext = useListController<Provider>({ resource: "provider" });
    const translate = useTranslate();
    const [provider, setProvider] = useState("");

    const columns: ColumnDef<Directions.Terminal>[] = [
        {
            id: "index",
            header: "№",
            cell: ({ row }) => row.index + 1
        },
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
        {
            id: "auth",
            accessorKey: "auth",
            header: translate("resources.terminals.fields.auth"),
            cell: ({ row }) => {
                return <TextField text={row.original.auth?.qqq} lineClamp linesCount={1} minWidth="50px" copyValue />;
            }
        },
        {
            id: "update_field",
            header: () => {
                return <div className="text-center">{translate("app.ui.actions.edit")}</div>;
            },
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        <Button onClick={() => console.log(row.original.terminal_id)} variant={"clearBtn"}>
                            <Pencil className="text-green-50" />
                        </Button>
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
                return (
                    <div className="flex items-center justify-center">
                        <Button onClick={() => console.log(row.original.terminal_id)} variant={"clearBtn"}>
                            <Trash2 className="text-green-50" />
                        </Button>
                    </div>
                );
            }
        }
    ];

    if (providerContext.isLoading || !providerContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <div className="flex flex-col md:flex-row gap-2 md:items-end justify-between mb-4">
                    <ListContextProvider value={providerContext}>
                        <TerminalsListFilter selectProvider={setProvider} />
                    </ListContextProvider>

                    <Button
                        onClick={() => console.log("create")}
                        variant="default"
                        className="flex gap-[4px] items-center">
                        <PlusCircle className="h-[16px] w-[16px]" />
                        <span className="text-title-1">{translate("resources.terminals.create")}</span>
                    </Button>
                </div>

                {provider ? <TerminalTable provider={provider} columns={columns} /> : <DataTable columns={columns} />}
            </>
        );
    }
};
