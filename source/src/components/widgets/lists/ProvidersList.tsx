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
import { CopyCheckIcon, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import { Label } from "@/components/ui/label";

const API_URL = import.meta.env.VITE_ENIGMA_URL;

export const ProvidersList = () => {
    const listContext = useListController<Provider>();

    const { refetch } = useListController<Provider>();
    const refresh = useRefresh();
    const translate = useTranslate();
    const navigate = useNavigate();
    const [deleteOne] = useDelete();
    const redirect = useRedirect();

    const [showOpen, setShowOpen] = useState(false);
    const [wait, setWait] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [keyShow, setKeyShow] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [testKeysShow, setTestKeysShow] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const [name, setName] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [publicKey, setPublicKey] = useState("");

    const [saveClicked, setSaveClicked] = useState(false);
    const [publicSaveClicked, setPublicSaveClicked] = useState(false);

    const [chosenId, setChosenId] = useState("");
    const { toast } = useToast();
    const [showProviderId, setShowProviderId] = useState<string>("");

    const handleCreateClick = () => {
        redirect("create", "provider");
    };

    const handleCreateTestClicked = async () => {
        setWait(true);

        const { json } = await fetchUtils.fetchJson(`${API_URL}/pki/keygen`, {
            method: "POST",
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });
        setPrivateKey(json.data.private_key);
        setPublicKey(json.data.public_key);
        setWait(false);
        setTestKeysShow(true);
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
        } catch (error) {
            /* empty */
        }
    };

    const columns: ColumnDef<Provider>[] = [
        {
            id: "name",
            accessorKey: "name",
            header: translate("resources.provider.fields.name")
        },
        {
            id: "public_key",
            accessorKey: "public_key",
            header: translate("resources.provider.fields.pk"),
            cell: ({ row }) => {
                if (!row.getValue("public_key")) {
                    return (
                        <Button onClick={() => handleClickGenerate(row.getValue("name"))}>
                            {translate("resources.provider.fields.genKey")}
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
            header: translate("resources.provider.fields.json_schema"),
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
            header: translate("resources.provider.fields.regenKey"),
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
                                    {translate("resources.provider.fields.regenKey")}
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

    const handlePublicCopy = () => {
        setPublicSaveClicked(true);
        navigator.clipboard.writeText(publicKey).then(() => {
            console.log("Text copied to clipboard");
        });
    };

    const isMobile = useMediaQuery({ query: `(max-width: 767px)` });

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <div>
                    <div className="flex justify-end justify-between mb-4 mt-[24px]">
                        <Button onClick={handleCreateClick} variant="default">
                            {translate("resources.provider.createNew")}
                        </Button>
                        <AlertDialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                            <AlertDialogContent className="max-w-[716px] bg-muted">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-center">
                                        {translate("resources.provider.deleteProviderQuestion")}
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
                                        {translate("resources.provider.deleteProviderQuestion")}
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
                        {/* Attention for user */}
                        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{translate("resources.provider.attention")}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {translate("resources.provider.warning")}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogAction onClick={handleGen}>
                                        {translate("resources.provider.continue")}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        {/* Wait dialog */}
                        <AlertDialog open={wait} onOpenChange={setWait}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{translate("resources.provider.pleaseWait")}</AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogDescription></AlertDialogDescription>
                            </AlertDialogContent>
                        </AlertDialog>
                        {/* Showing key */}
                        <AlertDialog open={testKeysShow} onOpenChange={setTestKeysShow}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogDescription>
                                        <div className="flex items-center space-x-2">
                                            <div className="relative flex-1">
                                                <Label htmlFor="private">
                                                    {translate("resources.provider.privateKey")}
                                                </Label>
                                                <textarea
                                                    value={privateKey}
                                                    className="w-full h-24 p-2 border border-neutral-400 rounded resize-none overflow-auto"
                                                    readOnly
                                                    id="private"
                                                />
                                                <Label htmlFor="public">
                                                    {translate("resources.provider.fields.pk")}
                                                </Label>
                                                <textarea
                                                    value={publicKey}
                                                    className="w-full h-24 p-2 border border-neutral-400 rounded resize-none overflow-auto"
                                                    readOnly
                                                    id="public"
                                                />
                                            </div>
                                            <div className="flex flex-col justify-around h-56">
                                                <Button
                                                    onClick={handleCopy}
                                                    variant={saveClicked ? "default" : "textBtn"}>
                                                    <CopyCheckIcon className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    onClick={handlePublicCopy}
                                                    variant={publicSaveClicked ? "default" : "textBtn"}>
                                                    <CopyCheckIcon className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogAction
                                        onClick={() => {
                                            setSaveClicked(false);
                                            setPublicSaveClicked(false);
                                        }}>
                                        {translate("resources.provider.close")}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog open={keyShow} onOpenChange={setKeyShow}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{translate("resources.provider.clickToCopy")}</AlertDialogTitle>
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
                                        {translate("resources.provider.close")}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
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
                                <SheetTitle>{translate("resources.provider.showTitle")}</SheetTitle>
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
