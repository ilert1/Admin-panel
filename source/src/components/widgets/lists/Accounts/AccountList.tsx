import { ListContextProvider, useTranslate } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { Loading } from "@/components/ui/loading";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AccountEdit } from "../../edit/AccountEdit";
import { useGetAccountsColumns } from "./Columns";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { useAbortableListController } from "@/hooks/useAbortableListController";

export const AccountList = () => {
    const listContext = useAbortableListController<Account>();

    const translate = useTranslate();

    const { columns, showEditDialog, setShowEditDialog, showAccountId, isLoadingCurrencies } = useGetAccountsColumns();

    if (listContext.isLoading || !listContext.data || isLoadingCurrencies) {
        return <Loading />;
    } else {
        return (
            <>
                <ResourceHeaderTitle marginBottom />
                <ListContextProvider value={{ ...listContext }}>
                    <DataTable columns={columns} />
                </ListContextProvider>

                <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                    <DialogContent
                        disableOutsideClick
                        className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                        <DialogHeader>
                            <DialogTitle className="text-center text-xl">
                                {translate("resources.accounts.editDialogTitle")}
                            </DialogTitle>
                        </DialogHeader>

                        <AccountEdit id={showAccountId} onOpenChange={setShowEditDialog} />
                    </DialogContent>
                    <DialogDescription />
                </Dialog>
            </>
        );
    }
};
