import { useDataProvider, ListContextProvider, useListController, useTranslate } from "react-admin";
import { useQuery } from "react-query";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/widgets/shared";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AccountShow } from "@/components/widgets/show";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";

export const AccountList = () => {
    const listContext = useListController<Account>();
    const translate = useTranslate();

    const { data } = useQuery(["dictionaries"], () => dataProvider.getDictionaries());

    const [showOpen, setShowOpen] = useState(false);
    const [showTransactionId, setShowTransactionId] = useState<string>("");

    const openSheet = (id: string) => {
        setShowTransactionId(id);
        setShowOpen(true);
    };

    const columns: ColumnDef<Account>[] = [
        {
            id: "caption",
            accessorKey: "meta.caption",
            header: translate("resources.accounts.fields.meta.caption")
        },
        {
            id: "owner_id",
            accessorKey: "owner_id",
            header: translate("resources.accounts.fields.owner_id")
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
            id: "actions",
            cell: ({ row }) => {
                return (
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
                            <DropdownMenuSeparator />
                            <DropdownMenuItem disabled>{translate("ra.action.edit")}</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            }
        }
    ];

    const dataProvider = useDataProvider();

    const isMobile = useMediaQuery({ query: `(max-width: 767px)` });

    if (listContext.isLoading || !listContext.data) {
        return <div>Loading...</div>;
    } else {
        return (
            <>
                <ListContextProvider value={listContext}>
                    <DataTable columns={columns} data={listContext.data} />
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
