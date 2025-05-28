import { useAbortableListController } from "@/hooks/useAbortableListController";
import { useGetSystemPaymentInstrumentsColumns } from "./Columns";
import { ListContextProvider } from "react-admin";
import { LoadingBlock } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";

export const SystemPaymentInstrumentsList = () => {
    const listContext = useAbortableListController({ resource: "systemPaymentInstruments" });
    const { columns } = useGetSystemPaymentInstrumentsColumns();

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
