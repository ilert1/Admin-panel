import { useDataProvider, ListContextProvider, useListController, useTranslate, useRefresh } from "react-admin";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/widgets/shared";
import { CirclePlus, PencilIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { TextField } from "@/components/ui/text-field";
import { Loading } from "@/components/ui/loading";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alertdialog";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { CurrencyCreate } from "../create";
import { CurrencyEdit } from "../edit";

export const CurrenciesList = () => {
    const listContext = useListController<Currencies.Currency>();

    const translate = useTranslate();
    const refresh = useRefresh();

    const [showAddCurrencyDialog, setShowAddCurrencyDialog] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [chosenId, setChosenId] = useState("");
    const { toast } = useToast();

    const handleDelete = async (id: string) => {
        setChosenId(id);
        setDialogOpen(true);
    };

    const handleOkClicked = async () => {
        await dataProvider.delete("currency", {
            id: chosenId
        });
        toast({
            description: translate("app.ui.delete.deletedSuccessfully"),
            variant: "success",
            title: "Success"
        });
        setChosenId("");
        refresh();
    };

    const columns: ColumnDef<Currencies.Currency>[] = [
        {
            id: "id",
            accessorKey: "code",
            header: () => <div className="flex justify-center">{translate("resources.currency.fields.currency")}</div>
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
            header: () => <div className="flex justify-center">{translate("resources.currency.fields.symbol")}</div>
        },
        {
            id: "position",
            accessorKey: "position",
            header: () => <div className="flex justify-center">{translate("resources.currency.fields.symbPos")}</div>,
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
            header: () => <div className="flex justify-center">{translate("resources.currency.fields.example")}</div>,
            cell: ({ row }) => {
                return row.original.position === "before" ? `${row.original.symbol}100` : `100${row.original.symbol}`;
            }
        },
        {
            id: "actionEdit",
            header: () => <div className="flex justify-center">{translate("resources.currency.fields.edit")}</div>,
            cell: function Cell({ row }) {
                const [showEdit, setShowEdit] = useState(false);

                return (
                    <Dialog open={showEdit} onOpenChange={setShowEdit}>
                        <DialogTrigger asChild>
                            <Button variant="textBtn" className="h-8 w-8 p-0">
                                <PencilIcon className="h-6 w-6" />
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="flex flex-col gap-6" aria-describedby={undefined}>
                            <DialogHeader>
                                <DialogTitle className="text-xl">
                                    {translate("resources.currency.editDialogTitle")}
                                </DialogTitle>
                            </DialogHeader>

                            <CurrencyEdit
                                record={row.original}
                                close={val => {
                                    setShowEdit(val);
                                    refresh();
                                }}
                            />
                        </DialogContent>
                    </Dialog>
                );
            }
        },
        {
            id: "actionDelete",
            header: () => <div className="flex justify-center">{translate("resources.currency.fields.delete")}</div>,
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center">
                        <Button onClick={() => handleDelete(row.original.id)} variant="textBtn" className="h-8 w-8 p-0">
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

                    <Dialog open={showAddCurrencyDialog} onOpenChange={setShowAddCurrencyDialog}>
                        <DialogContent className="flex flex-col gap-6" aria-describedby={undefined}>
                            <DialogHeader>
                                <DialogTitle className="text-xl">
                                    {translate("resources.currency.createDialogTitle")}
                                </DialogTitle>
                            </DialogHeader>

                            <CurrencyCreate
                                close={val => {
                                    setShowAddCurrencyDialog(val);
                                    refresh();
                                }}
                            />
                        </DialogContent>
                    </Dialog>
                </div>

                <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{translate("app.ui.actions.areYouSure")}</AlertDialogTitle>
                            <AlertDialogDescription></AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={handleOkClicked}>
                                {translate("app.ui.actions.delete")}
                            </AlertDialogAction>
                            <AlertDialogCancel onClick={() => setChosenId("")}>
                                {translate("app.ui.actions.cancel")}
                            </AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <ListContextProvider value={listContext}>
                    <DataTable columns={columns} data={[]} />
                </ListContextProvider>
            </>
        );
    }
};
