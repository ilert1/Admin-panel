import {
    useDataProvider,
    ListContextProvider,
    useListController,
    useTranslate,
    useRedirect,
    useRefresh
} from "react-admin";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/widgets/shared";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import { MerchantShow } from "../show";
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

export const MerchantList = () => {
    const listContext = useListController<Merchant>();
    const translate = useTranslate();
    const navigate = useNavigate();

    const [showOpen, setShowOpen] = useState(false);
    const [showMerchantId, setShowMerchantId] = useState<string>("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [chosenId, setChosenId] = useState("");
    const { toast } = useToast();
    const redirect = useRedirect();
    const refresh = useRefresh();

    const handleCreateClick = () => {
        redirect("create", "merchant");
    };

    const openSheet = (id: string) => {
        setShowMerchantId(id);
        setShowOpen(true);
    };

    const handleDeleteClicked = (id: string) => {
        setChosenId(id);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        await dataProvider.delete("merchant", {
            id: chosenId
        });
        setChosenId("");
        toast({
            description: translate("app.ui.delete.deletedSuccessfully"),
            variant: "success",
            title: "Success"
        });
        refresh();
    };

    const columns: ColumnDef<Merchant>[] = [
        {
            id: "id",
            accessorKey: "id",
            header: translate("resources.merchant.fields.id")
        },
        {
            id: "name",
            accessorKey: "name",
            header: translate("resources.merchant.fields.name")
        },
        {
            id: "description",
            accessorKey: "description",
            header: translate("resources.merchant.fields.descr")
        },
        {
            id: "keycloak_id",
            accessorKey: "keycloak_id",
            header: "Keyclaok ID"
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="textBtn" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openSheet(row.original.id)}>
                                {translate("app.ui.actions.quick_show")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/merchant/${row.original.id}/show`)}>
                                {translate("app.ui.actions.show")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/merchant/${row.original.id}/edit/`)}>
                                {translate("app.ui.actions.edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteClicked(row.original.id)}>
                                <p className="text-popover-foreground">{translate("app.ui.actions.delete")}</p>
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
                <div className="flex flex-end justify-end mb-4">
                    <Button onClick={handleCreateClick} variant="default">
                        {translate("resources.merchant.createNew")}
                    </Button>
                    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{translate("app.ui.actions.areYouSure")}</AlertDialogTitle>
                                <AlertDialogDescription></AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogAction onClick={handleDelete}>
                                    {translate("app.ui.actions.delete")}
                                </AlertDialogAction>
                                <AlertDialogCancel>{translate("app.ui.actions.cancel")}</AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <ListContextProvider value={listContext}>
                    <DataTable columns={columns} />
                </ListContextProvider>
                <Sheet open={showOpen} onOpenChange={setShowOpen}>
                    <SheetContent
                        className={isMobile ? "w-full h-4/5" : "max-w-[400px] sm:max-w-[540px]"}
                        side={isMobile ? "bottom" : "right"}>
                        <ScrollArea className="h-full">
                            <SheetHeader className="mb-2">
                                <SheetTitle>{translate("resources.merchant.showTitle")}</SheetTitle>
                                <SheetDescription>
                                    {/* {translate("resources.currency.showDescription", { id: showMerchantId })} */}
                                </SheetDescription>
                            </SheetHeader>
                            <MerchantShow id={showMerchantId} />
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </>
        );
    }
};
