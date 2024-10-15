import {
    ListContextProvider,
    useListController,
    useTranslate,
    useRedirect,
    fetchUtils,
    useRefresh,
    useDelete
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
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { TextField } from "@/components/ui/text-field";
import { useNavigate } from "react-router-dom";
import { Loading } from "@/components/ui/loading";
import { ProvidersShow } from "../show/ProvidersShow";
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
import { KeysModal } from "../components/KeysModal";

export const ProvidersList = () => {
    const listContext = useListController<Provider>();

    const refresh = useRefresh();
    const translate = useTranslate();
    const navigate = useNavigate();
    const [deleteOne] = useDelete();
    const redirect = useRedirect();

    const [showOpen, setShowOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const [name, setName] = useState("");

    const [chosenId, setChosenId] = useState("");
    const { toast } = useToast();
    const [showProviderId, setShowProviderId] = useState<string>("");

    const handleCreateClick = () => {
        redirect("create", "provider");
    };

    const handleDeleteClicked = async (id: string) => {
        setChosenId(id);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        await deleteOne(
            "provider",
            { id: chosenId },
            {
                onSuccess: async () => {
                    toast({
                        description: translate("app.ui.delete.deletedSuccessfully"),
                        variant: "success",
                        title: "Success"
                    });
                    refresh();
                },
                onError: error => {
                    console.error("Ошибка удаления:", error);
                }
            }
        );
        setChosenId("");
    };

    const openSheet = (id: string) => {
        setShowProviderId(id);
        setShowOpen(true);
    };

    const handleClickGenerate = async (name: string) => {
        setName(name);
        setDialogOpen(true);
    };

    const columns: ColumnDef<Provider>[] = [
        {
            id: "name",
            accessorKey: "name",
            header: translate("resources.providers.fields.name")
        },
        {
            id: "public_key",
            accessorKey: "public_key",
            header: translate("resources.providers.fields.pk"),
            cell: ({ row }) => {
                if (!row.getValue("public_key")) {
                    return (
                        <Button onClick={() => handleClickGenerate(row.getValue("name"))}>
                            {translate("resources.providers.fields.genKey")}
                        </Button>
                    );
                } else {
                    let text = String(row.getValue("public_key"));
                    if (text.length > 30) {
                        text = text.substring(0, 30) + "...";
                    }
                    return <TextField text={text} copyValue />;
                }
            }
        },
        {
            id: "fields_json_schema",
            accessorKey: "fields_json_schema",
            header: translate("resources.providers.fields.json_schema"),
            cell: ({ row }) => {
                return (
                    <TextField
                        text={
                            row.getValue("fields_json_schema")
                                ? String(row.getValue("fields_json_schema")).length > 30
                                    ? String(row.getValue("fields_json_schema")).substring(0, 30) + "..."
                                    : row.getValue("fields_json_schema")
                                : ""
                        }
                    />
                );
            }
        },
        {
            id: "recreate_field",
            header: translate("resources.providers.fields.regenKey"),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        <Button onClick={() => handleClickGenerate(row.original.id)} variant={"clearBtn"}>
                            <img src="/reload-round.svg" />
                        </Button>
                    </div>
                );
            }
        },
        {
            id: "update_field",
            header: translate("app.ui.actions.edit"),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        <Button onClick={() => setEditDialogOpen(true)} variant={"clearBtn"}>
                            <Pencil className="text-green-50" />
                        </Button>
                    </div>
                );
            }
        },
        {
            id: "delete_field",
            header: translate("app.ui.actions.delete"),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        <Button onClick={() => handleDeleteClicked(row.original.id)} variant={"clearBtn"}>
                            <Trash2 className="text-green-50" />
                        </Button>
                    </div>
                );
            }
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
                            <DropdownMenuItem onClick={() => navigate(`/provider/${row.original.id}/show`)}>
                                {translate("app.ui.actions.show")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/provider/${row.original.id}/edit/`)}>
                                {translate("app.ui.actions.edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteClicked(row.original.id)}>
                                <p className="text-popover-foreground">{translate("app.ui.actions.delete")}</p>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleClickGenerate(row.original.id)}>
                                <p className="text-popover-foreground">
                                    {translate("resources.providers.fields.regenKey")}
                                </p>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            }
        }
    ];

    const isMobile = useMediaQuery({ query: `(max-width: 767px)` });

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <div>
                    <div className="flex justify-end justify-between mb-4 mt-[24px]">
                        <Button onClick={handleCreateClick} variant="default">
                            {translate("resources.providers.createNew")}
                        </Button>
                        <AlertDialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                            <AlertDialogContent className="max-w-[716px] bg-muted">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-center">
                                        {translate("resources.providers.deleteProviderQuestion")}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription></AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <div className="flex justify-around w-full">
                                        <AlertDialogAction onClick={handleDelete}>
                                            {translate("app.ui.actions.delete")}
                                        </AlertDialogAction>
                                        <AlertDialogCancel>{translate("app.ui.actions.cancel")}</AlertDialogCancel>
                                    </div>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                            <AlertDialogContent className="w-[251px] bg-muted">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-center">
                                        {translate("resources.providers.deleteProviderQuestion")}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription></AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <div className="flex justify-around w-full">
                                        <AlertDialogAction onClick={handleDelete}>
                                            {translate("app.ui.actions.delete")}
                                        </AlertDialogAction>
                                        <AlertDialogCancel>{translate("app.ui.actions.cancel")}</AlertDialogCancel>
                                    </div>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <KeysModal open={dialogOpen} onOpenChange={setDialogOpen} isTest={false} name={name} />
                    </div>
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
                                <SheetTitle>{translate("resources.providers.showTitle")}</SheetTitle>
                                <SheetDescription></SheetDescription>
                            </SheetHeader>
                            <ProvidersShow id={showProviderId} />
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </>
        );
    }
};
