import { useTranslate, useListController, ListContextProvider, RecordContextProvider } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { ColumnDef } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { WithdrawShow } from "@/components/widgets/show";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { Loading } from "@/components/ui/loading";

export const WithdrawList = () => {
    const listContext = useListController<Transaction.Transaction>();
    const translate = useTranslate();

    const [showOpen, setShowOpen] = useState(false);
    const isMobile = useMediaQuery({ query: `(max-width: 767px)` });
    const [showTransactionId, setShowTransactionId] = useState<string>("");

    const openSheet = (id: string) => {
        setShowTransactionId(id);
        setShowOpen(true);
    };

    const columns: ColumnDef<Transaction.Transaction>[] = [
        {
            accessorKey: "id",
            header: translate("resources.withdraw.fields.id"),
            cell: ({ row }) => <TextField text={row.original.id} copyValue />
        },
        {
            accessorKey: "created_at",
            header: translate("resources.withdraw.fields.created_at")
        },
        {
            accessorKey: "destination.id",
            header: translate("resources.withdraw.fields.destination.id")
        },
        {
            accessorKey: "destination.amount.value",
            header: translate("resources.withdraw.fields.destination.amount.value"),
            cell: ({ row }) => {
                const value =
                    (row.original.source.amount.value.quantity || 0) / row.original.source.amount.value.accuracy;
                if (isNaN(value)) return "-";
                return `${value.toFixed(Math.log10(row.original.source.amount.value.accuracy))} ${
                    row.original.source.amount.currency || ""
                }`;
            }
        },
        {
            accessorKey: "destination.amount.currency",
            header: translate("resources.withdraw.fields.destination.amount.currency")
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <RecordContextProvider value={row.original}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openSheet(row.original.id)}>
                                    {translate("ra.action.show")}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </RecordContextProvider>
                );
            }
        }
    ];

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <ListContextProvider value={listContext}>
                    <DataTable columns={columns} />
                </ListContextProvider>
                <Sheet open={showOpen} onOpenChange={setShowOpen}>
                    <SheetContent
                        className={isMobile ? "w-full h-4/5" : "max-w-[400px] sm:max-w-[540px]"}
                        side={isMobile ? "bottom" : "right"}>
                        <ScrollArea className="h-full [&>div>div]:!block">
                            <SheetHeader className="mb-2">
                                <SheetTitle>{translate("resources.transactions.showHeader")}</SheetTitle>
                                <SheetDescription>
                                    {translate("resources.transactions.showDescription", { id: showTransactionId })}
                                </SheetDescription>
                            </SheetHeader>
                            <WithdrawShow id={showTransactionId} />
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </>
        );
    }
};
