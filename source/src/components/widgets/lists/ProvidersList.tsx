import {
    useDataProvider,
    ListContextProvider,
    useListController,
    useTranslate,
    Link,
    useRedirect,
    fetchUtils,
    useRefresh,
    useDelete
} from "react-admin";
import { useQueryClient } from "react-query";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/widgets/shared";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CopyCheckIcon, MoreHorizontal } from "lucide-react";
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

const API_URL = import.meta.env.VITE_ENIGMA_URL;

export const ProvidersList = () => {
    const listContext = useListController<Provider>();
    const { refetch } = useListController<Provider>();
    const refresh = useRefresh();
    const queryClient = useQueryClient();
    const translate = useTranslate();
    const navigate = useNavigate();
    const [deleteOne] = useDelete();

    const redirect = useRedirect();

    const [showOpen, setShowOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [keyShow, setKeyShow] = useState(false);
    const [name, setName] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [wait, setWait] = useState(false);
    const [saveClicked, setSaveClicked] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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

    const handleGen = async () => {
        setDialogOpen(false);
        setWait(true);
        try {
            const { json } = await fetchUtils.fetchJson(`${API_URL}/provider/${name}`, {
                method: "PATCH",
                user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
            });
            setPrivateKey(json.data.keypair.private_key);
            setWait(false);
            setKeyShow(true);
            setSaveClicked(false);
        } catch (error) {}
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
                    return <TextField text={text} />;
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

    const handleCopy = () => {
        setSaveClicked(true);
        navigator.clipboard.writeText(privateKey).then(() => {
            console.log("Text copied to clipboard");
        });
    };

    const isMobile = useMediaQuery({ query: `(max-width: 767px)` });

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <div className="flex flex-end justify-end mb-4">
                    <Button onClick={handleCreateClick} variant="default">
                        {translate("resources.providers.createNew")}
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
                    {/* Attention for user */}
                    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{translate("resources.providers.attention")}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {translate("resources.providers.warning")}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogAction onClick={handleGen}>
                                    {translate("resources.providers.continue")}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    {/* Wait dialog */}
                    <AlertDialog open={wait} onOpenChange={setWait}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{translate("resources.providers.pleaseWait")}</AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogDescription></AlertDialogDescription>
                        </AlertDialogContent>
                    </AlertDialog>
                    {/* Showing key */}
                    <AlertDialog open={keyShow} onOpenChange={setKeyShow}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{translate("resources.providers.clickToCopy")}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    <div className="flex items-center space-x-2">
                                        <div className="relative flex-1">
                                            <textarea
                                                value={privateKey}
                                                className="w-full h-24 p-2 border border-neutral-400 rounded resize-none overflow-auto"
                                                readOnly
                                            />
                                        </div>
                                        <Button onClick={handleCopy} variant={saveClicked ? "default" : "textBtn"}>
                                            <CopyCheckIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogAction
                                    onClick={async () => {
                                        await refetch();
                                    }}>
                                    {translate("resources.providers.close")}
                                </AlertDialogAction>
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
                                <SheetTitle>{translate("resources.providers.showTitle")}</SheetTitle>
                                <SheetDescription>
                                    {/* {translate("resources.currencies.showDescription", { id: showMerchantId })} */}
                                </SheetDescription>
                            </SheetHeader>
                            <ProvidersShow id={showProviderId} />
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </>
        );
    }
};
