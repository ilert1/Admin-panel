import { useAbortableListController } from "@/hooks/useAbortableListController";
import { useGetTerminalPaymentInstrumentsListColumns } from "./Columns";
import { ListContextProvider } from "react-admin";
import { LoadingBlock } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";

export const TerminalPaymentInstrumentsList = () => {
    const listContext = useAbortableListController({ resource: "terminalPaymentInstruments" });
    const { columns } = useGetTerminalPaymentInstrumentsListColumns();

    return (
        <>
            <ListContextProvider value={listContext}>
                <div className="mb-4 flex justify-between">
                    <ResourceHeaderTitle />
                </div>

                {listContext.isLoading || !listContext.data ? <LoadingBlock /> : <DataTable columns={columns} />}
            </ListContextProvider>
        </>
    );
};
