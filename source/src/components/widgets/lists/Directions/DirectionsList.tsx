import { ListContextProvider, useListController } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import {} from "react-responsive";
import { Loading } from "@/components/ui/loading";

import { useGetDirectionsColumns } from "./Columns";
import { ShowDirectionSheet } from "./ShowDirectionSheet";
import { DirectionListFilter } from "./DirectionListFilter";
import { Direction } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { ShowMerchantSheet } from "../Merchants/ShowMerchantSheet";
import { TerminalShowDialog } from "../Terminals/TerminalShowDialog";

export const DirectionsList = () => {
    const listContext = useListController<Direction>();

    const {
        columns,
        chosenId,
        quickShowOpen,
        chosenMerchantId,
        chosenMerchantName,
        showMerchants,
        chosenTerminalId,
        showTerminals,
        chosenProviderName,
        setShowTerminals,
        setShowMerchants,
        setQuickShowOpen
    } = useGetDirectionsColumns();

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <div className="flex flex-col md:flex-row gap-2 md:items-end justify-between">
                    <ListContextProvider value={listContext}>
                        <DirectionListFilter />
                    </ListContextProvider>
                </div>

                <ListContextProvider value={listContext}>
                    <DataTable columns={columns} />
                </ListContextProvider>

                <ShowMerchantSheet
                    id={chosenMerchantId}
                    merchantName={chosenMerchantName}
                    open={showMerchants}
                    onOpenChange={setShowMerchants}
                />
                <ShowDirectionSheet id={chosenId} open={quickShowOpen} onOpenChange={setQuickShowOpen} />
                <TerminalShowDialog
                    id={chosenTerminalId}
                    open={showTerminals}
                    onOpenChange={setShowTerminals}
                    provider={chosenProviderName}
                />
            </>
        );
    }
};
