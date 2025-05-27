import { useAbortableListController } from "@/hooks/useAbortableListController";
import { useGetFinancialEntitiesColumns } from "./Columns";
import { ListContextProvider, useTranslate } from "react-admin";
import { LoadingBlock } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { Button } from "@/components/ui/Button";
import { CirclePlus } from "lucide-react";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";

export const FinancialEntitiesList = () => {
    const translate = useTranslate();
    const listContext = useAbortableListController({ resource: "financialEntities" });
    const { columns } = useGetFinancialEntitiesColumns();

    return (
        <>
            <ListContextProvider value={listContext}>
                <div className="mb-4 flex justify-between">
                    <ResourceHeaderTitle />

                    <div className="flex justify-end">
                        <Button onClick={() => console.log("click")} variant="default" className="flex gap-[4px]">
                            <CirclePlus className="h-[16px] w-[16px]" />

                            <span className="text-title-1">
                                {translate("resources.paymentTools.paymentType.createNew")}
                            </span>
                        </Button>
                    </div>
                </div>

                {listContext.isLoading || !listContext.data ? <LoadingBlock /> : <DataTable columns={columns} />}
            </ListContextProvider>
        </>
    );
};
