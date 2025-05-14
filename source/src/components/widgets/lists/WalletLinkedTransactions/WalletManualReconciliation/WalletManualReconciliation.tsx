import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { useTranslate } from "react-admin";
import { WalletManualReconciliationDialog } from "./WalletManualReconciliationDialog";

export const WalletManualReconciliation = () => {
    const translate = useTranslate();

    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <div className="flex items-end justify-end">
            <Button
                onClick={() => setDialogOpen(true)}
                className="flex items-center justify-center gap-1 self-end font-normal">
                <span>{translate("resources.wallet.linkedTransactions.manual_reconciliation")}</span>
            </Button>

            <WalletManualReconciliationDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        </div>
    );
};
