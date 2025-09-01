import { useAbortableListController } from "@/hooks/useAbortableListController";
import { MerchantCascadeSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { ListContextProvider } from "react-admin";
import { LoadingBlock } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { useGetCascadeMerchantColumns } from "./Columns";
import { CreateCascadeMerchantsDialog } from "./CreateCascadeMerchantDialog";
import { CascadeMerchantListFilter } from "./CascadeMerchantListFilter";

export const CascadeMerchantsList = () => {
    const listContext = useAbortableListController<MerchantCascadeSchema>({
        resource: "cascadeSettings/cascadeMerchants",
        sort: { field: "created_at", order: "DESC" }
    });

    const { columns, setCreateDialogOpen, createDialogOpen, isMerchantsLoading } = useGetCascadeMerchantColumns();

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
                src_currency: { code: "USD", is_coin: false },
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
                src_currency: { code: "USD", is_coin: false },
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
            <CascadeMerchantListFilter handleCreateClicked={handleCreateClicked} />

            {listContext.isLoading || isMerchantsLoading ? (
                <LoadingBlock />
            ) : (
                <DataTable columns={columns} data={mockData} />
            )}

            <CreateCascadeMerchantsDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
        </ListContextProvider>
    );
};
