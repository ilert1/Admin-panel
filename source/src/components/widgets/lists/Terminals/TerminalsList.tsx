import { ListContextProvider, useListController, useTranslate } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { useState } from "react";
import { Loading } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CreateTerminalDialog } from "./CreateTerminalDialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { DeleteTerminalDialog } from "./DeleteTerminalDialog";
import { EditTerminalDialog } from "./EditTerminalDialog";
import { TerminalsListFilter } from "./TerminalsListFilter";
import { TerminalListTable } from "./TerminalsListTable";
import { useGetTerminalColumns } from "./Columns";

export const TerminalsList = () => {
    const providerContext = useListController<Provider>({ resource: "provider" });

    const translate = useTranslate();

    const [provider, setProvider] = useState("");
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const {
        columns,
        showAuthKeyOpen,
        setShowAuthKeyOpen,
        chosenId,
        authData,
        editDialogOpen,
        setEditDialogOpen,
        deleteDialogOpen,
        setDeleteDialogOpen
    } = useGetTerminalColumns();

    if (providerContext.isLoading || !providerContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <div className="flex flex-col md:flex-row gap-2 md:items-end justify-between mb-4">
                    <ListContextProvider value={providerContext}>
                        <TerminalsListFilter selectProvider={setProvider} />
                    </ListContextProvider>

                    <Button
                        disabled={!provider}
                        onClick={() => setCreateDialogOpen(true)}
                        variant="default"
                        className="flex gap-[4px] items-center">
                        <PlusCircle className="h-[16px] w-[16px]" />

                        <span className="text-title-1">{translate("resources.terminals.create")}</span>
                    </Button>
                </div>

                {provider ? (
                    <>
                        <TerminalListTable provider={provider} columns={columns} />

                        <CreateTerminalDialog
                            provider={provider}
                            open={createDialogOpen}
                            onOpenChange={setCreateDialogOpen}
                        />

                        <EditTerminalDialog
                            provider={provider}
                            id={chosenId}
                            open={editDialogOpen}
                            onOpenChange={setEditDialogOpen}
                        />

                        <DeleteTerminalDialog
                            provider={provider}
                            open={deleteDialogOpen}
                            onOpenChange={setDeleteDialogOpen}
                            deleteId={chosenId}
                        />

                        <Dialog open={showAuthKeyOpen} onOpenChange={setShowAuthKeyOpen}>
                            <DialogContent className="max-w-[478px] max-h-[340px] overflow-auto bg-muted">
                                <DialogHeader>
                                    <DialogTitle className="text-center" />
                                    <DialogDescription />

                                    <div className="w-full flex flex-col items-center justify-end ">
                                        <span className="self-start text-note-1">
                                            {translate("resources.terminals.fields.auth")}
                                        </span>

                                        <MonacoEditor
                                            height="144px"
                                            code={authData}
                                            setCode={() => {}}
                                            onErrorsChange={() => {}}
                                            onValidChange={() => {}}
                                            disabled
                                        />
                                    </div>
                                </DialogHeader>

                                <DialogFooter>
                                    <div className="flex justify-end w-full pr-1">
                                        <Button
                                            variant={"outline"}
                                            onClick={() => {
                                                setShowAuthKeyOpen(false);
                                            }}>
                                            {translate("app.ui.actions.close")}
                                        </Button>
                                    </div>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </>
                ) : (
                    <DataTable columns={columns} />
                )}
            </>
        );
    }
};
