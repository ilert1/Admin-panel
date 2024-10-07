import {
    useDataProvider,
    ListContextProvider,
    useListController,
    useTranslate,
    RecordContextProvider
} from "react-admin";
import { useQuery } from "react-query";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/widgets/shared";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MoreHorizontal, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AccountShow } from "@/components/widgets/show";
import { useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { TextField } from "@/components/ui/text-field";
import { useNavigate } from "react-router-dom";
import { Loading } from "@/components/ui/loading";
import { toast } from "sonner";
import { NumericFormat } from "react-number-format";
import USDT from "@/lib/icons/USDT";

export const AccountList = () => {
    const listContext = useListController<Account>();

    const totalSum = useMemo(() => {
        if (listContext.data) {
            return listContext.data.reduce(
                (acc, item) =>
                    acc +
                    item.amounts.reduce(
                        (innerAcc, innerItem) => innerAcc + innerItem.value.quantity / innerItem.value.accuracy,
                        0
                    ),
                0
            );
        }
        return 0;
    }, [listContext.data]);
    console.log(totalSum);
    const translate = useTranslate();
    const navigate = useNavigate();

    const { data } = useQuery(["dictionaries"], () => dataProvider.getDictionaries());
    const [showOpen, setShowOpen] = useState(false);
    const [showTransactionId, setShowTransactionId] = useState<string>("");

    const openSheet = (id: string) => {
        setShowTransactionId(id);
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
                </RecordContextProvider>
            )
        },
        {
            id: "history",
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openSheet(row.original.id)}>
                                {translate("app.ui.actions.quick_show")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/accounts/${row.original.id}/show`)}>
                                {translate("app.ui.actions.show")}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            }
        }
    ];

    const dataProvider = useDataProvider();

    const isMobile = useMediaQuery({ query: `(max-width: 767px)` });

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <ListContextProvider value={listContext}>
                    <div className="flex gap-6 flex-wrap">
                        <div className="grow-[1]">
                            <DataTable columns={columns} />
                        </div>
                        <div className="flex flex-col gap-4 px-6 py-4 rounded-2xl bg-neutral-0 w-[457px] h-fit">
                            <h3 className="text-display-3">{translate("resources.accounts.totalBalance")}</h3>
                            <div className="self-end flex gap-4 items-center">
                                <h1 className="text-display-1">
                                    <NumericFormat
                                        className="whitespace-nowrap"
                                        value={totalSum}
                                        displayType={"text"}
                                        thousandSeparator=" "
                                        decimalSeparator=","
                                    />
                                </h1>
                                <USDT />
                            </div>
                        </div>
                    </div>
                </ListContextProvider>
                <Sheet open={showOpen} onOpenChange={setShowOpen}>
                    <SheetContent
                        className={isMobile ? "w-full h-4/5" : "max-w-[400px] sm:max-w-[540px]"}
                        side={isMobile ? "bottom" : "right"}>
                        <ScrollArea className="h-full">
                            <SheetHeader className="mb-2">
                                <SheetTitle>{translate("resources.accounts.showHeader")}</SheetTitle>
                                <SheetDescription>
                                    {translate("resources.accounts.showDescription", { id: showTransactionId })}
                                </SheetDescription>
                            </SheetHeader>
                            <AccountShow id={showTransactionId} />
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </>
        );
    }
};
