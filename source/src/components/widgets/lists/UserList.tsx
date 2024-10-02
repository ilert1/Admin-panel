import { ListContextProvider, useListController, useTranslate } from "react-admin";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/widgets/shared";
import { TextField } from "@/components/ui/text-field";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UserShow } from "@/components/widgets/show/UserShow";
import { useMediaQuery } from "react-responsive";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { Loading } from "@/components/ui/loading";

export const UserList = () => {
    const [showOpen, setShowOpen] = useState(false);
    const [userId, setUserId] = useState<string>("");

    const isMobile = useMediaQuery({ query: `(max-width: 767px)` });
    const listContext = useListController<Users.User>();
    const translate = useTranslate();
    const navigate = useNavigate();

    const openSheet = (id: string) => {
        setUserId(id);
        setShowOpen(true);
    };

    const columns: ColumnDef<Users.User>[] = [
        {
            id: "created_at",
            accessorKey: "created_at",
            header: translate("resources.users.fields.created_at"),
            cell: ({ row }) => (
                <>
                    <p>{new Date(row.original.created_at).toLocaleDateString()}</p>
                    <p>{new Date(row.original.created_at).toLocaleTimeString()}</p>
                </>
            )
        },
        {
            id: "id",
            accessorKey: "id",
            header: translate("resources.users.fields.id"),
            cell: ({ row }) => <TextField text={row.original.id} copyValue />
        },
        {
            id: "name",
            accessorKey: "name",
            header: translate("resources.users.fields.name"),
            cell: ({ row }) => <TextField text={row.original.name} copyValue />
        },
        {
            accessorKey: "active",
            header: translate("resources.users.fields.active"),
            cell: ({ row }) => (
                <div className="flex items-center justify-center text-white">
                    {row.original.deleted_at ? (
                        <span className="px-3 py-0.5 bg-red-50 rounded-20 font-normal text-base text-center">
                            {translate("resources.users.fields.activeStateFalse")}
                        </span>
                    ) : (
                        <span className="px-3 py-0.5 bg-green-50 rounded-20 font-normal text-base text-center">
                            {translate("resources.users.fields.activeStateTrue")}
                        </span>
                    )}
                </div>
            )
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="clearBtn" className="w-full p-0">
                                <span className="sr-only">Open menu</span>
                                <EyeIcon className="text-green-50 size-7" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openSheet(row.original.id)} className="border-none">
                                {translate("app.ui.actions.quick_show")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => navigate(`/users/${row.original.id}/show`)}
                                className="border-none">
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
                <div className="mb-4 flex justify-end">
                    <Button onClick={() => navigate(`/users/create`)}>
                        {translate("resources.users.createButton")}
                    </Button>
                </div>
                <ListContextProvider value={listContext}>
                    <DataTable columns={columns} />
                </ListContextProvider>
                <Sheet open={showOpen} onOpenChange={setShowOpen}>
                    <SheetContent
                        className={isMobile ? "w-full h-4/5" : "max-w-[400px] sm:max-w-[540px]"}
                        side={isMobile ? "bottom" : "right"}>
                        <ScrollArea className="h-full [&>div>div]:!block">
                            <SheetHeader className="mb-2">
                                <SheetTitle>{translate("resources.users.showHeader")}</SheetTitle>
                                <SheetDescription>
                                    {translate("resources.users.showDescription", { id: userId })}
                                </SheetDescription>
                            </SheetHeader>

                            <UserShow id={userId} isBrief={true} />
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </>
        );
    }
};
