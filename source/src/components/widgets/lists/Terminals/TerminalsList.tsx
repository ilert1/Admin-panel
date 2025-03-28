import { useTranslate } from "react-admin";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { PlusCircle } from "lucide-react";
import { CreateTerminalDialog } from "./CreateTerminalDialog";

import { DeleteTerminalDialog } from "./DeleteTerminalDialog";
import { EditTerminalDialog } from "./EditTerminalDialog";
import { TerminalsListFilter } from "./TerminalsListFilter/TerminalsListFilter";
import { TerminalListTable } from "./TerminalsListTable";
import { useGetTerminalColumns } from "./Columns";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { EmptyTable } from "../../shared/EmptyTable";

export const TerminalsList = () => {
    const translate = useTranslate();

    const [filterName, setFilterName] = useState("");
    const [provider, setProvider] = useState("");
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const { columns, chosenId, editDialogOpen, deleteDialogOpen, setEditDialogOpen, setDeleteDialogOpen } =
        useGetTerminalColumns();

    return (
        <>
            <div className="mb-4 flex flex-wrap justify-between gap-2 md:mb-6">
                <ResourceHeaderTitle />
                <Button
                    disabled={!provider}
                    onClick={() => setCreateDialogOpen(true)}
                    variant="default"
                    className="flex items-center gap-[4px]">
                    <PlusCircle className="h-[16px] w-[16px]" />

                    <span className="text-title-1">{translate("resources.terminals.create")}</span>
                </Button>
            </div>

            <TerminalsListFilter
                selectProvider={setProvider}
                currentProvider={provider}
                terminalFilterName={filterName}
                onChangeTerminalFilter={setFilterName}
            />

            {provider ? (
                <>
                    <TerminalListTable provider={provider} columns={columns} filterName={filterName} />

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
                </>
            ) : (
                <EmptyTable columns={columns} />
            )}
        </>
    );
};
