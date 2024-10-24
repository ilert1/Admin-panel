import { ListContextProvider, useListController, useTranslate } from "react-admin";
import { useGetWalletsColumns } from "./Columns";
import { Loading } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CreateWalletDialog } from "./CreateWalletDialog";
import { useState } from "react";
import { DataTable } from "../../shared";
import { ShowWalletDialog } from "./ShowWalletDialog";
enum WalletTypes {
    INTERNAL = "internal",
    LINKED = "linked",
    EXTERNAL = "external"
}
export const WalletsList = () => {
    const listContext = useListController({ resource: "" });
    const translate = useTranslate();

    const { columns, chosenId, quickShowOpen, setQuickShowOpen } = useGetWalletsColumns();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const handleCreateClick = () => {
        setCreateDialogOpen(true);
    };

    const mockData = [
        {
            id: "1",
            description: "AA",
            type: WalletTypes.INTERNAL,
            blockchain: "AA",
            address: "AA",
            account_id: "AA",
            currency: "AA",
            network: "AA",
            minimal_ballance_limit: 1000
        },
        {
            id: "2",
            description: "AA",
            type: WalletTypes.EXTERNAL,
            blockchain: "AA",
            address: "AA",
            account_id: "AA",
            currency: "AA",
            network: "AA",
            minimal_ballance_limit: 1000
        },
        {
            id: "3",
            description: "AA",
            type: WalletTypes.LINKED,
            blockchain: "AA",
            address: "AA",
            account_id: "AA",
            currency: "AA",
            network: "AA",
            minimal_ballance_limit: 1000
        }
    ];

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <div className="flex flex-end justify-end mb-4">
                    <Button onClick={handleCreateClick} variant="default" className="flex gap-[4px] items-center">
                        <PlusCircle className="h-[16px] w-[16px]" />
                        <span className="text-title-1">{translate("resources.direction.create")}</span>
                    </Button>
                    <CreateWalletDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
                </div>
                <ListContextProvider value={listContext}>
                    <DataTable columns={columns} data={mockData} total={10} />
                </ListContextProvider>
                <ShowWalletDialog id={chosenId} open={quickShowOpen} onOpenChange={setQuickShowOpen} />
            </>
        );
    }
};
