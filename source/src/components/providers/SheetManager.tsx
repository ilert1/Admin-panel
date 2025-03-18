import { ShowAccountSheet } from "../widgets/lists/Accounts/ShowAccountSheet";
import { ShowDirectionSheet } from "../widgets/lists/Directions/ShowDirectionSheet";
import { ShowMerchantSheet } from "../widgets/lists/Merchants/ShowMerchantSheet";
import { TerminalShowDialog } from "../widgets/lists/Terminals/TerminalShowDialog";
import { ShowTransactionSheet } from "../widgets/lists/Transactions/ShowTransactionSheet";
import { ShowUserSheet } from "../widgets/lists/Users/ShowUserSheet";
import { ShowWalletLinkedTransactionsSheet } from "../widgets/lists/WalletLinkedTransactions/ShowWalletLinkedTransactionsSheet";
import { ShowWalletDialog } from "../widgets/lists/Wallets/ShowWalletDialog";
import { ShowWalletTransactionsSheet } from "../widgets/lists/WalletTransactions/ShowWalletTransactionsSheet";
import { useSheets } from "./SheetProvider";

const SHEETS_COMPONENTS = {
    account: ShowAccountSheet,
    direction: ShowDirectionSheet,
    merchant: ShowMerchantSheet,
    user: ShowUserSheet,
    transaction: ShowTransactionSheet,
    terminal: TerminalShowDialog,
    wallet: ShowWalletDialog,
    walletLinked: ShowWalletLinkedTransactionsSheet,
    walletTransactions: ShowWalletTransactionsSheet
};

export const SheetManager = () => {
    const { sheets, closeSheet } = useSheets();

    return (
        <>
            {sheets.map(({ key, open, data }) => {
                const Component = SHEETS_COMPONENTS[key];
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                return <Component key={key} open={open} onOpenChange={() => closeSheet(key)} {...data} />;
            })}
        </>
    );
};
