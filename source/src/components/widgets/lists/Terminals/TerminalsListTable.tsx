import { LoadingBlock } from "@/components/ui/loading";
import { ListContextProvider } from "react-admin";
import { DataTable } from "../../shared";
import { ColumnDef } from "@tanstack/react-table";
import { TerminalWithId } from "@/data/terminals";
import { useAbortableListController } from "@/hooks/useAbortableListController";

interface TerminalListTableProps {
    provider: string;
    columns: ColumnDef<TerminalWithId>[];
}

export const TerminalListTable = ({ provider, columns }: TerminalListTableProps) => {
    const terminalsContext = useAbortableListController<TerminalWithId>({
        resource: `${provider}/terminal`,
        disableSyncWithLocation: true
    });

    if (terminalsContext.isFetching) {
        return <LoadingBlock />;
    } else {
        return (
            <ListContextProvider value={terminalsContext}>
                <DataTable columns={columns} />
            </ListContextProvider>
        );
    }
};
