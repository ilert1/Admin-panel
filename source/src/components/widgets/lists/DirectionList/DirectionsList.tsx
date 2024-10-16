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
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import { DirectionsShow } from "../../show";
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
import { useGetDirectionsColumns } from "./Columns";

const API_URL = import.meta.env.VITE_ENIGMA_URL;

export const DirectionsList = () => {
    const listContext = useListController<Direction>();

    const translate = useTranslate();
    const { toast } = useToast();
    const refresh = useRefresh();

    const [dialogOpen, setDialogOpen] = useState(false);

    const [code, setCode] = useState("{}");
    const [hasErrors, setHasErrors] = useState(false);
    const { theme } = useTheme();
    const [isValid, setIsValid] = useState(false);

    const { columns, chosenId, quickShowOpen, deleteDialogOpen, setDeleteDialogOpen, setQuickShowOpen } =
        useGetDirectionsColumns();

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
        setCode("{}");
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
                description: translate("resources.direction.addedSuccess"),
                variant: "success",
                title: "Success"
            });
            refresh();
        } catch (error: any) {
            console.log(error);
            toast({
                description: translate("resources.direction.errors."),
                variant: "destructive",
                title: "Error"
            });
        }
    };

    const redirect = useRedirect();
    const handleCreateClick = () => {
        redirect("create", "direction");
    };

    const dataProvider = useDataProvider();

    const isMobile = useMediaQuery({ query: `(max-width: 767px)` });

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <div className="flex flex-end justify-end mb-4">
                    <Button onClick={handleCreateClick} variant="default">
                        {translate("resources.direction.create")}
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
                                <div>{translate("resources.direction.writeSecretPhrase")}</div>
                                <div>{translate("resources.direction.secretHelper")}</div>
                                <AlertDialogTitle></AlertDialogTitle>
                                <AlertDialogDescription></AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex items-center space-x-2">
                                <Editor
                                    height="20vh"
                                    defaultLanguage="json"
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
                                <AlertDialogCancel onClick={() => setCode("{}")}>
                                    {translate("app.ui.actions.cancel")}
                                </AlertDialogCancel>
                                <AlertDialogAction disabled={hasErrors || !isValid} onClick={handleGen}>
                                    {translate("app.ui.actions.save")}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <ListContextProvider value={listContext}>
                    <DataTable columns={columns} />
                </ListContextProvider>
                <Sheet open={quickShowOpen} onOpenChange={setQuickShowOpen}>
                    <SheetContent
                        className={isMobile ? "w-full h-4/5" : "max-w-[400px] sm:max-w-[540px]"}
                        side={isMobile ? "bottom" : "right"}>
                        <ScrollArea className="h-full">
                            <SheetHeader className="mb-2">
                                <SheetTitle>{translate("resources.merchant.showTitle")}</SheetTitle>
                                <SheetDescription></SheetDescription>
                            </SheetHeader>
                            <DirectionsShow id={chosenId} />
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </>
        );
    }
};
