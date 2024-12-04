import { ListContextProvider, useListController, useTranslate, RecordContextProvider } from "react-admin";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/widgets/shared";
import { XIcon, Copy, EyeIcon, Pen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AccountShow } from "@/components/widgets/show";
import { useState } from "react";
import { TextField } from "@/components/ui/text-field";
import { Loading } from "@/components/ui/loading";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { toast } from "sonner";
import { NumericFormat } from "react-number-format";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AccountEdit } from "../edit/AccountEdit";

const styles = ["bg-green-50", "bg-red-50", "bg-extra-2", "bg-extra-8"];
const translations = ["active", "frozen", "blocked", "deleted"];

export const AccountList = () => {
    const listContext = useListController<Account>();

    const translate = useTranslate();
    const data = fetchDictionaries();

    const [showOpen, setShowOpen] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showAccountId, setShowAccountId] = useState<string>("");
    const [showAccountCaption, setShowAccountCaption] = useState<string>("");

    const openSheet = (id: string, caption: string) => {
        setShowAccountId(id);
        setShowAccountCaption(caption);
        setShowOpen(true);
    };

    const columns: ColumnDef<Account>[] = [
        {
            id: "owner",
            accessorFn: row => [row.meta?.caption, row.owner_id],
            header: translate("resources.accounts.fields.owner"),
            cell: ({ row }) => (
                <RecordContextProvider value={row.original}>
                    <div className="flex flex-col justify-center gap-1">
                        <span className="text-title-1">{(row.getValue("owner") as Array<string>)[0]}</span>
                        <div className="flex flex-start text-neutral-60 dark:text-neutral-70 items-center gap-2">
                            <Copy
                                className="h-4 w-4 cursor-pointer"
                                onClick={() => {
                                    navigator.clipboard.writeText((row.getValue("owner") as Array<string>)[1]);
                                    toast.success(translate("app.ui.textField.copied"), {
                                        dismissible: true,
                                        duration: 1000
                                    });
                                }}
                            />

                            <span>{(row.getValue("owner") as Array<string>)[1]}</span>
                        </div>
                    </div>
                </RecordContextProvider>
            )
        },
        {
            id: "state",
            accessorKey: "state",
            header: translate("resources.accounts.fields.state"),
            cell: ({ row }) => {
                const index = row.original.state - 1;

                return (
                    <div className="flex items-center justify-center">
                        <span
                            className={`px-3 py-0.5 rounded-20 text-white font-normal text-base text-center ${styles[index]}`}>
                            {translate(`resources.accounts.fields.states.${translations[index]}`)}
                        </span>
                    </div>
                );
            }
        },
        {
            id: "type",
            accessorKey: "type",
            header: translate("resources.accounts.fields.type"),
            cell: ({ row }) => data?.accountTypes?.[row.getValue("type") as string]?.type_descr || ""
        },
        {
            id: "balance",
            accessorKey: "amounts",
            header: translate("resources.accounts.fields.balance"),
            cell: ({ row }) => (
                <RecordContextProvider value={row.original}>
                    <div className="flex flex-col justify-center">
                        {row.original.amounts.map(item => {
                            return (
                                <div key={item.id}>
                                    <NumericFormat
                                        value={item.value.quantity / item.value.accuracy}
                                        displayType={"text"}
                                        thousandSeparator=" "
                                        decimalSeparator=","
                                    />
                                    {` ${item.currency}`}
                                </div>
                            );
                        })}
                    </div>
                </RecordContextProvider>
            )
        },
        {
            id: "actionEdit",
            header: () => <div className="flex justify-center">{translate("resources.accounts.fields.edit")}</div>,
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center">
                        <Button
                            onClick={() => {
                                setShowAccountId(row.original.id);
                                setShowEditDialog(true);
                            }}
                            variant="textBtn"
                            className="h-8 w-8 p-0">
                            <Pen className="h-6 w-6" />
                        </Button>
                    </div>
                );
            }
        },
        {
            id: "history",
            header: translate("resources.accounts.fields.history"),
            cell: ({ row }) => {
                return (
                    <Button
                        variant="secondary"
                        onClick={() => openSheet(row.original.id, row.original.meta?.caption)}
                        className="flex items-center h-7 w-7 p-0 bg-transparent">
                        <EyeIcon className="text-green-50 size-7" />
                    </Button>
                );
            }
        }
    ];
    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <ListContextProvider value={{ ...listContext }}>
                    <DataTable columns={columns} />
                </ListContextProvider>

                <Sheet onOpenChange={setShowOpen} open={showOpen}>
                    <SheetContent
                        className="sm:max-w-[1015px] !max-h-[calc(100dvh-84px)] w-full p-0 m-0 top-[84px] flex flex-col border-0"
                        tabIndex={-1}
                        style={{ backgroundColor: "rgba(19, 35, 44, 1)" }}
                        close={false}>
                        <SheetHeader className="p-[42px] pb-0 flex-shrink-0">
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center ">
                                    <SheetTitle className="!text-display-1">
                                        {translate("app.ui.accountHistory")}
                                    </SheetTitle>

                                    <button
                                        onClick={() => setShowOpen(false)}
                                        className="text-gray-500 hover:text-gray-700 transition-colors border-0 outline-0">
                                        <XIcon className="h-[28px] w-[28px]" />
                                    </button>
                                </div>
                                <div className="text-display-2 mb-2">
                                    <span>{showAccountCaption}</span>
                                </div>
                                <TextField text={showAccountId} copyValue />
                            </div>
                        </SheetHeader>

                        <div className="flex-1 overflow-auto" tabIndex={-1}>
                            <SheetDescription></SheetDescription>
                            <AccountShow id={showAccountId} type="compact" />
                        </div>
                    </SheetContent>
                </Sheet>

                <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                    <DialogContent
                        disableOutsideClick
                        className="bg-muted max-w-full w-[716px] h-full md:h-auto max-h-[100dvh] !overflow-y-auto rounded-[0] md:rounded-[16px]">
                        <DialogHeader>
                            <DialogTitle className="text-xl text-center">
                                {translate("resources.accounts.editDialogTitle")}
                            </DialogTitle>
                        </DialogHeader>

                        <AccountEdit id={showAccountId} onOpenChange={setShowEditDialog} />
                    </DialogContent>
                    <DialogDescription />
                </Dialog>
            </>
        );
    }
};
