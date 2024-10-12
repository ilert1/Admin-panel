import { ListContextProvider, useListController, useTranslate } from "react-admin";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/widgets/shared";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AccountShow } from "@/components/widgets/show";
import { useState } from "react";
import { TextField } from "@/components/ui/text-field";
import { useNavigate } from "react-router-dom";
import { Loading } from "@/components/ui/loading";
import fetchDictionaries from "@/helpers/get-dictionaries";

export const AccountList = () => {
    const listContext = useListController<Account>();
    const translate = useTranslate();
    const navigate = useNavigate();
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
            id: "name",
            accessorKey: "meta.caption",
            header: translate("resources.accounts.fields.meta.caption"),
            cell: ({ row }) => (
                <TextField
                    text={row.getValue("name")}
                    type="internal-link"
                    link={`/accounts/${row.original.owner_id}/show`}
                />
            )
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
                            <Button variant="secondary" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openSheet(row.original.id, row.original.meta.caption)}>
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

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <ListContextProvider value={listContext}>
                    <DataTable columns={columns} />
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
