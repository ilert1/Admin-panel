import { useAbortableListController } from "@/hooks/useAbortableListController";
import { MerchantCascadeSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { ListContextProvider, useTranslate } from "react-admin";
import { LoadingBlock } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { useGetCascadeMerchantColumns } from "./Columns";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { Button } from "@/components/ui/Button";
import { CirclePlus } from "lucide-react";

export const CascadeMerchantsList = () => {
    const translate = useTranslate();
    const listContext = useAbortableListController<MerchantCascadeSchema>({
        resource: "merchant_cascade",
        sort: { field: "created_at", order: "DESC" }
    });

    const { columns, setCreateDialogOpen } = useGetCascadeMerchantColumns();

    const handleCreateClicked = () => {
        setCreateDialogOpen(true);
    };

    const mockData: MerchantCascadeSchema[] = [
        {
            merchant: {
                id: "1",
                name: "Merchant",
                description: "descr"
            },
            cascade: {
                id: "1",
                name: "Cascade",
                description: "descr",
                type: "deposit",
                src_currency_code: "USD",
                cascade_kind: "sequential",
                state: "active",
                priority_policy: { rank: 1 },
                created_at: Date.now().toString(),
                updated_at: Date.now().toString()
            },
            state: "active",
            created_at: Date.now().toString(),
            updated_at: Date.now().toString(),
            id: "1",
            cascade_id: "1",
            merchant_id: "1"
        },
        {
            merchant: {
                id: "2",
                name: "Merchant2",
                description: "descr"
            },
            cascade: {
                id: "2",
                name: "Cascade2",
                description: "descr",
                type: "deposit",
                src_currency_code: "USD",
                cascade_kind: "sequential",
                state: "inactive",
                priority_policy: { rank: 1 },
                created_at: Date.now().toString(),
                updated_at: Date.now().toString()
            },
            state: "inactive",
            created_at: Date.now().toString(),
            updated_at: Date.now().toString(),
            id: "2",
            cascade_id: "2",
            merchant_id: "2"
        }
    ];
    listContext.data = mockData;

    return (
        <ListContextProvider value={listContext}>
            <div className="mb-6 flex flex-wrap justify-between gap-2">
                <ResourceHeaderTitle />
                <div className="flex flex-wrap justify-end gap-2">
                    <Button onClick={handleCreateClicked} variant="default" className="flex gap-[4px]">
                        <CirclePlus className="h-[16px] w-[16px]" />

                        <span className="text-title-1">
                            {translate("resources.cascadeSettings.cascadeMerchants.createNew")}
                        </span>
                    </Button>
                </div>
            </div>

            {listContext.isLoading ? <LoadingBlock /> : <DataTable columns={columns} data={mockData} />}
        </ListContextProvider>
    );
};
