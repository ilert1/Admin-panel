import { ListContextProvider, useListController, useTranslate } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { Loading } from "@/components/ui/loading";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AccountEdit } from "../../edit/AccountEdit";
import { useGetAccountsColumns } from "./Columns";
import { ShowAccountSheet } from "./ShowAccountSheet";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";

export const AccountList = () => {
    const listContext = useListController<Account>();

    const translate = useTranslate();

    const { columns, showOpen, setShowOpen, showEditDialog, setShowEditDialog, showAccountId } =
        useGetAccountsColumns();

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <ResourceHeaderTitle marginBottom />
                <ListContextProvider value={{ ...listContext }}>
                    <DataTable columns={columns} />
                </ListContextProvider>

                <ShowAccountSheet accountId={showAccountId} open={showOpen} onOpenChange={setShowOpen} />

                <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                    <DialogContent
                        disableOutsideClick
                        className="bg-muted max-w-full w-[716px] h-full md:h-auto max-h-[100dvh] !overflow-y-auto rounded-[0] md:rounded-[16px]">
                        <DialogHeader>
                            <DialogTitle className="text-xl text-center">
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
