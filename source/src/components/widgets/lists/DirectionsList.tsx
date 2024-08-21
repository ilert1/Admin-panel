import {
    useDataProvider,
    ListContextProvider,
    useListController,
    useTranslate,
    useRedirect,
    fetchUtils,
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
import { TextField } from "@/components/ui/text-field";
import { useNavigate } from "react-router-dom";
import { DirectionsShow } from "../show";
import { Loading, LoadingAlertDialog } from "@/components/ui/loading";

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
import * as monaco from "monaco-editor";
import { Editor } from "@monaco-editor/react";
import { useTheme } from "@/components/providers";

const API_URL = import.meta.env.VITE_ENIGMA_URL;

export const DirectionsList = () => {
    const listContext = useListController<Direction>();
    const translate = useTranslate();
    const navigate = useNavigate();

    const [showOpen, setShowOpen] = useState(false);
    const [showDirectionId, setShowDirectionId] = useState<string>("");
    const refresh = useRefresh();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const [chosenId, setChosenId] = useState("");

    const [code, setCode] = useState("{}");
    const [hasErrors, setHasErrors] = useState(false);
    const { theme } = useTheme();
    const [isValid, setIsValid] = useState(false);

    const handleEditorDidMount = (editor: any, monaco: any) => {
        monaco.editor.setTheme(`vs-${theme}`);
    };

    const validateCode = (value: string) => {
        try {
            const parsed = JSON.parse(value || "{}");
            if (value.trim() === "" || Object.keys(parsed).length === 0) {
                setIsValid(false);
            } else {
                setIsValid(true);
            }
        } catch (error) {
            setIsValid(false);
        }
    };

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            setCode(value);
            validateCode(value);
        }
    };

    const handleValidation = (markers: monaco.editor.IMarker[]) => {
        console.log(hasErrors);
        setHasErrors(markers.length > 0);
    };

    const { toast } = useToast();

    const handleAddPassClicked = (id: string) => {
        setChosenId(id);
        setDialogOpen(true);
    };

    const handleOkClicked = async () => {
        await dataProvider.delete("direction", {
            id: chosenId
        });
        toast({
            description: translate("app.ui.delete.deletedSuccessfully"),
            variant: "success",
            title: "Success"
        });
        refresh();
    };

    const handleGen = async () => {
        const data = JSON.parse(code);
        setChosenId("");
        setCode("");
        console.log(data);
        try {
            const { json } = await fetchUtils.fetchJson(`${API_URL}/direction/${chosenId}`, {
                method: "PUT",
                body: JSON.stringify({
                    auth_data: data
                }),
                user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
            });

            if (!json.success) {
                throw new Error(json.error);
            }

            toast({
                description: translate("resources.directions.addedSuccess"),
                variant: "success",
                title: "Success"
            });
            refresh();
        } catch (error: any) {
            console.log(error);
            toast({
                description: translate("resources.directions.errors."),
                variant: "destructive",
                title: "Error"
            });
        }
    };

    const handleDelete = async (id: string) => {
        setChosenId(id);
        setDeleteDialogOpen(true);
    };

    const openSheet = (id: string) => {
        setShowDirectionId(id);
        setShowOpen(true);
    };
    const redirect = useRedirect();
    const handleCreateClick = () => {
        redirect("create", "direction");
    };

    const columns: ColumnDef<Direction>[] = [
        {
            id: "id",
            accessorKey: "id",
            header: translate("resources.directions.fields.id")
        },
        {
            id: "name",
            accessorKey: "name",
            header: translate("resources.directions.fields.name")
        },
        {
            id: "active",
            accessorKey: "active",
            header: translate("resources.directions.fields.active"),
            cell: ({ row }) => {
                return (
                    <TextField
                        text={
                            row.getValue("active")
                                ? translate("resources.directions.fields.stateActive")
                                : translate("resources.directions.fields.stateInactive")
                        }
                    />
                );
            }
        },
        {
            id: "src_currency",
            accessorKey: "src_currency",
            header: translate("resources.directions.fields.srcCurr"),
            cell: ({ row }) => {
                const obj: Omit<Currencies.Currency, "id"> = row.getValue("src_currency");
                return <TextField text={obj.code} />;
            }
        },
        {
            id: "dst_currency",
            accessorKey: "dst_currency",
            header: translate("resources.directions.fields.destCurr"),
            cell: ({ row }) => {
                const obj: Omit<Currencies.Currency, "id"> = row.getValue("dst_currency");
                return <TextField text={obj.code} />;
            }
        },
        {
            id: "merchant",
            accessorKey: "merchant",
            header: translate("resources.directions.fields.merchant"),
            cell: ({ row }) => {
                const obj: Merchant = row.getValue("merchant");
                return <TextField text={obj.name} />;
            }
        },
        {
            id: "provider",
            accessorKey: "provider",
            header: translate("resources.directions.provider"),
            cell: ({ row }) => {
                const obj: Provider = row.getValue("provider");
                return <TextField text={obj.name} />;
            }
        },
        {
            id: "weight",
            accessorKey: "weight",
            header: translate("resources.directions.weight")
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
                            <DropdownMenuItem onClick={() => navigate(`/direction/${row.original.id}/show`)}>
                                {translate("app.ui.actions.show")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(row.original.id)}>
                                <p className="text-popover-foreground">{translate("app.ui.actions.delete")}</p>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAddPassClicked(row.original.id)}>
                                {row.original.auth_data === undefined
                                    ? translate("app.ui.actions.addSecretKey")
                                    : translate("app.ui.actions.changeSecretKey")}
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
                        {translate("resources.directions.create")}
                    </Button>
                    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{translate("app.ui.actions.areYouSure")}</AlertDialogTitle>
                                <AlertDialogDescription></AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogAction onClick={handleOkClicked}>
                                    {translate("app.ui.actions.delete")}
                                </AlertDialogAction>
                                <AlertDialogCancel>{translate("app.ui.actions.cancel")}</AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                {translate("resources.directions.writeSecretPhrase")}
                                <AlertDialogTitle></AlertDialogTitle>
                                <AlertDialogDescription></AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex items-center space-x-2">
                                <Editor
                                    height="20vh"
                                    defaultLanguage="json"
                                    defaultValue="{}"
                                    value={code}
                                    onChange={handleEditorChange}
                                    onValidate={handleValidation}
                                    loading={<LoadingAlertDialog />}
                                    options={{
                                        theme: `vs-${theme}`
                                    }}
                                    onMount={handleEditorDidMount}
                                />
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogAction disabled={hasErrors || !isValid} onClick={handleGen}>
                                    {translate("app.ui.actions.save")}
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
                                <SheetTitle>{translate("resources.merchants.showTitle")}</SheetTitle>
                                <SheetDescription></SheetDescription>
                            </SheetHeader>
                            <DirectionsShow id={showDirectionId} />
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </>
        );
    }
};
