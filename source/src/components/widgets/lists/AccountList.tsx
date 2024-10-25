import { ListContextProvider, useListController, useTranslate, RecordContextProvider } from "react-admin";
import { useQuery } from "react-query";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/widgets/shared";
import { XIcon, Copy, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AccountShow } from "@/components/widgets/show";
import { useState } from "react";
import { TextField } from "@/components/ui/text-field";
import { Loading } from "@/components/ui/loading";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { toast } from "sonner";
import { NumericFormat } from "react-number-format";
import { Icon } from "../shared/Icon";

export const AccountList = () => {
    const listContext = useListController<Account>();

    const translate = useTranslate();
    const data = fetchDictionaries();

    const [showOpen, setShowOpen] = useState(false);
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
            accessorFn: row => [row.meta.caption, row.owner_id],
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
            cell: ({ row }) => data?.accountStates?.[row.getValue("state") as string]?.type_descr || ""
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
            id: "history",
            header: translate("resources.accounts.fields.history"),
            cell: ({ row }) => {
                return (
                    <Button
                        variant="secondary"
                        onClick={() => openSheet(row.original.id, row.original.meta.caption)}
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
                    <div className="flex gap-6 flex-wrap-reverse items-end">
                        <div className="grow-[1]">
                            <DataTable columns={columns} />
                        </div>
                        <div className="flex flex-col gap-4 px-6 py-4 rounded-2xl bg-neutral-0 w-[457px] h-fit">
                            <h3 className="text-display-3">{translate("resources.accounts.totalBalance")}</h3>
                            <div className="flex flex-col gap-4 items-end">
                                {/* {listContext.data.totalSum ? (
                                    <>
                                        {totalSum.map(currencySum => {
                                            return (
                                                <div key={currencySum.currency} className="flex gap-4 items-center">
                                                    <h1 className="text-display-1">
                                                        <NumericFormat
                                                            className="whitespace-nowrap"
                                                            value={currencySum.amount / currencySum.accuracy}
                                                            displayType={"text"}
                                                            thousandSeparator=" "
                                                            decimalSeparator=","
                                                        />
                                                    </h1>
                                                    <div className="w-10 flex justify-center">
                                                        <Icon name={currencySum.currency} isCurrency={true} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </>
                                ) : (
                                    <></>
                                )} */}
                            </div>
                        </div>
                    </div>
                </ListContextProvider>
                <Sheet onOpenChange={setShowOpen} open={showOpen}>
                    <SheetContent
                        className="sm:max-w-[1015px] !max-h-[calc(100dvh-84px)] w-full p-0 m-0 top-[84px] flex flex-col"
                        tabIndex={-1}
                        style={{ backgroundColor: "rgba(19, 35, 44, 1)" }}
                        close={false}>
                        <SheetHeader className="p-[42px] pb-[24px] flex-shrink-0">
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
                                    {/* <TextField text={showAccountCaption} /> */}
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
            </>
        );
    }
};
