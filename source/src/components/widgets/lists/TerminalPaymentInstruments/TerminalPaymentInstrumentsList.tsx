import { useAbortableListController } from "@/hooks/useAbortableListController";
import { useGetTerminalPaymentInstrumentsListColumns } from "./Columns";
import { ListContextProvider, useTranslate } from "react-admin";
import { LoadingBlock } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { CreateTerminalPaymentInstrumentsDialog } from "./CreateTerminalPaymentInstrumentsDialog";
import { TerminalPaymentInstrumentFilter } from "./TerminalPaymentInstrumentFilter";
import { TerminalPaymentInstrument } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useState } from "react";

export const TerminalPaymentInstrumentsList = () => {
    const translate = useTranslate();

    const [providerName, setProviderName] = useState("");

    const listContext = useAbortableListController<TerminalPaymentInstrument>({
        resource: "terminalPaymentInstruments"
    });

    const { columns, createDialogOpen, setCreateDialogOpen } = useGetTerminalPaymentInstrumentsListColumns({
        isFetching: listContext.isFetching
    });

    const createFn = () => {
        setCreateDialogOpen(true);
    };

    return (
        <ListContextProvider value={listContext}>
            <div>
                <TerminalPaymentInstrumentFilter setProviderNameCallback={setProviderName} createFn={createFn} />
            </div>

            {listContext.isLoading || listContext.isFetching ? (
                <LoadingBlock />
            ) : (
                <DataTable
                    columns={columns}
                    placeholder={
                        !providerName
                            ? translate("resources.paymentSettings.terminalPaymentInstruments.providerNotSelect")
                            : undefined
                    }
                />
            )}

            <CreateTerminalPaymentInstrumentsDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
        </ListContextProvider>
    );
};
