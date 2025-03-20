import { useTranslate } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { PlusCircle } from "lucide-react";
import { CreateTerminalDialog } from "./CreateTerminalDialog";

import { DeleteTerminalDialog } from "./DeleteTerminalDialog";
import { EditTerminalDialog } from "./EditTerminalDialog";
import { TerminalsListFilter } from "./TerminalsListFilter";
import { TerminalListTable } from "./TerminalsListTable";
import { useGetTerminalColumns } from "./Columns";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";

export const TerminalsList = () => {
    const translate = useTranslate();

    const [provider, setProvider] = useState("");
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const { columns, chosenId, editDialogOpen, deleteDialogOpen, setEditDialogOpen, setDeleteDialogOpen } =
        useGetTerminalColumns();

    return (
        <>
            <div className="flex justify-between mb-4 md:mb-6 gap-2 flex-wrap">
                <ResourceHeaderTitle />
                <Button
                    disabled={!provider}
                    onClick={() => setCreateDialogOpen(true)}
                    variant="default"
                    className="flex gap-[4px] items-center">
                    <PlusCircle className="h-[16px] w-[16px]" />

                    <span className="text-title-1">{translate("resources.terminals.create")}</span>
                </Button>
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:items-end justify-between mb-4">
                <TerminalsListFilter selectProvider={setProvider} />
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
                </>
            ) : (
                <DataTable columns={columns} />
            )}
        </>
    );
};
