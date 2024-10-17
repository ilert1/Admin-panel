import { useDataProvider, ListContextProvider, useListController, useTranslate, useRefresh } from "react-admin";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/widgets/shared";
import { CirclePlus, PencilIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { TextField } from "@/components/ui/text-field";
import { Loading, LoadingAlertDialog } from "@/components/ui/loading";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CurrencyCreate } from "../create";
import { CurrencyEdit } from "../edit";

export const CurrenciesList = () => {
    const listContext = useListController<Currencies.Currency>();

    const translate = useTranslate();
    const refresh = useRefresh();
    const { toast } = useToast();

    const [chosenCurrency, setChosenCurrency] = useState<Currencies.Currency | undefined>(undefined);

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showAddCurrencyDialog, setShowAddCurrencyDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleOkClicked = async (id: string) => {
        try {
            await dataProvider.delete("currency", {
                id
            });

            toast({
                description: translate("app.ui.delete.deletedSuccessfully"),
                variant: "success",
                title: "Success"
            });

            setChosenCurrency(undefined);
            setShowDeleteDialog(false);
            refresh();
        } catch (error) {
            toast({
                description: translate("resources.currency.errors.alreadyInUse"),
                variant: "destructive",
                title: "Error"
            });
        }
    };

    const columns: ColumnDef<Currencies.Currency>[] = [
        {
            id: "id",
            accessorKey: "code",
            header: translate("resources.currency.fields.currency")
        },
        {
            id: "is_coin",
            accessorKey: "is_coin",
            header: translate("resources.currency.fields.type"),
            cell: ({ row }) => {
                return (
                    <TextField
                        text={
                            row.getValue("is_coin") === false
                                ? translate("resources.currency.fields.fiat")
                                : translate("resources.currency.fields.crypto")
                        }
                    />
                );
            }
        },
        {
            id: "symbol",
            accessorKey: "symbol",
            header: translate("resources.currency.fields.symbol")
        },
        {
            id: "position",
            accessorKey: "position",
            header: translate("resources.currency.fields.symbPos"),
            cell: ({ row }) => {
                return (
                    <TextField
                        text={
                            row.getValue("position") === "before"
                                ? translate("resources.currency.fields.before")
                                : translate("resources.currency.fields.after")
                        }
                    />
                );
            }
        },
        {
            id: "exmaple",
            header: translate("resources.currency.fields.example"),
            cell: ({ row }) => {
                return row.original.position === "before" ? `${row.original.symbol}100` : `100${row.original.symbol}`;
            }
        },
        {
            id: "actionEdit",
            header: () => <div className="flex justify-center">{translate("resources.currency.fields.edit")}</div>,
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center">
                        <Button
                            onClick={() => {
                                setChosenCurrency(row.original);
                                setShowEditDialog(true);
                            }}
                            variant="textBtn"
                            className="h-8 w-8 p-0">
                            <PencilIcon className="h-6 w-6" />
                        </Button>
                    </div>
                );
            }
        },
        {
            id: "actionDelete",
            header: () => <div className="flex justify-center">{translate("resources.currency.fields.delete")}</div>,
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center">
                        <Button
                            onClick={() => {
                                setChosenCurrency(row.original);
                                setShowDeleteDialog(true);
                            }}
                            variant="textBtn"
                            className="h-8 w-8 p-0">
                            <Trash2 className="h-6 w-6" />
                        </Button>
                    </div>
                );
            }
        }
    ];

    const dataProvider = useDataProvider();

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <div className="flex flex-end justify-end mb-4">
                    <Button
                        onClick={() => setShowAddCurrencyDialog(true)}
                        className="flex items-center justify-center gap-1 font-normal">
                        <CirclePlus width={16} height={16} />
                        <span>{translate("resources.currency.create")}</span>
                    </Button>
                </div>

                <Dialog open={showAddCurrencyDialog} onOpenChange={setShowAddCurrencyDialog}>
                    <DialogContent className="flex flex-col gap-6" aria-describedby={undefined}>
                        <DialogHeader>
                            <DialogTitle className="text-xl">
                                {translate("resources.currency.createDialogTitle")}
                            </DialogTitle>
                        </DialogHeader>

                        <CurrencyCreate
                            closeDialog={() => {
                                setShowAddCurrencyDialog(false);
                                refresh();
                            }}
                        />
                    </DialogContent>
                </Dialog>

                <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                    <DialogContent className="flex flex-col gap-6" aria-describedby={undefined}>
                        <DialogHeader>
                            <DialogTitle className="text-xl">
                                {translate("resources.currency.editDialogTitle")}
                            </DialogTitle>
                        </DialogHeader>

                        <CurrencyEdit
                            record={chosenCurrency}
                            closeDialog={() => {
                                setShowEditDialog(false);
                                setChosenCurrency(undefined);
                                refresh();
                            }}
                        />
                    </DialogContent>
                </Dialog>

                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogContent className="flex flex-col gap-4 w-auto" aria-describedby={undefined}>
                        <DialogHeader>
                            <DialogTitle className="text-xl">
                                {translate("resources.currency.deleteDialogTitle")}
                            </DialogTitle>
                        </DialogHeader>

                        {chosenCurrency?.id ? (
                            <div className="flex items-center gap-8">
                                <Button onClick={() => handleOkClicked(chosenCurrency.id)} variant="default">
                                    {translate("app.ui.actions.delete")}
                                </Button>
                                <Button
                                    onClick={() => {
                                        setShowDeleteDialog(false);
                                        setChosenCurrency(undefined);
                                    }}
                                    variant="secondary"
                                    className="border border-green-50 rounded-4 hover:border-green-40">
                                    {translate("app.ui.actions.cancel")}
                                </Button>
                            </div>
                        ) : (
                            <LoadingAlertDialog />
                        )}
                    </DialogContent>
                </Dialog>

                <ListContextProvider value={listContext}>
                    <DataTable columns={columns} data={[]} />
                </ListContextProvider>
            </>
        );
    }
};
