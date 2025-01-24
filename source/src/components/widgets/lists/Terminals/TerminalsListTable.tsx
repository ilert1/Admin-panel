import { LoadingBlock } from "@/components/ui/loading";
import { ListContextProvider, useListController } from "react-admin";
import { DataTable } from "../../shared";
import { ColumnDef } from "@tanstack/react-table";

interface TerminalListTableProps {
    provider: string;
    columns: ColumnDef<Directions.Terminal>[];
}

export const TerminalListTable = ({ provider, columns }: TerminalListTableProps) => {
    const terminalsContext = useListController<Directions.Terminal>({
        resource: `provider/${provider}/terminal`
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
