import { LoadingBlock } from "@/components/ui/loading";
import { ListContextProvider } from "react-admin";
import { DataTable } from "../../shared";
import { ColumnDef } from "@tanstack/react-table";
import { TerminalWithId } from "@/data/terminals";
import { useAbortableListController } from "@/hooks/useAbortableListController";

interface TerminalListTableProps {
    provider: string;
    columns: ColumnDef<TerminalWithId>[];
    filterName?: string;
}

export const TerminalListTable = ({ provider, columns, filterName = "" }: TerminalListTableProps) => {
    const terminalsContext = useAbortableListController<TerminalWithId>({
        resource: `${provider}/terminal`,
        ...(filterName && { filter: { verbose_name: filterName } }),
        disableSyncWithLocation: true
    });

    return (
        <ListContextProvider value={terminalsContext}>
            {terminalsContext.isLoading ? <LoadingBlock /> : <DataTable columns={columns} />}
        </ListContextProvider>
    );
};
