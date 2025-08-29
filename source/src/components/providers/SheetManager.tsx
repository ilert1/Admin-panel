import { ShowAccountSheet } from "../widgets/lists/Accounts/ShowAccountSheet";
import { ShowCallbridgeHistorySheet } from "../widgets/lists/CallbridgeHistory/ShowCallbridgeHistorySheet";
import { ShowCascadeSheet } from "../widgets/lists/Cascades/ShowCascadeSheet";
import { ShowCascadeTerminalSheet } from "../widgets/lists/CascadeTerminals/ShowCascadeTerminalSheet";
import { ShowDirectionSheet } from "../widgets/lists/Directions/ShowDirectionSheet";
import { ShowFinancialInstitutionSheet } from "../widgets/lists/FinancialInstitution/ShowFinancialInstitutionSheet";
import { ShowMappingSheet } from "../widgets/lists/Mappings/ShowMappingSheet";
import { ShowMerchantSheet } from "../widgets/lists/Merchants/ShowMerchantSheet";
import { ShowProviderSheet } from "../widgets/lists/Providers/ShowProviderSheet";
import { SystemPaymentInstrumentSheet } from "../widgets/lists/SystemPaymentInstruments/SystemPaymentInstrumentSheet";
import { ShowTerminalPaymentInstrumentsSheet } from "../widgets/lists/TerminalPaymentInstruments/ShowTerminalPaymentInstrumentsSheet";
import { TerminalShowDialog } from "../widgets/lists/Terminals/TerminalShowDialog";
import { ShowTransactionSheet } from "../widgets/lists/Transactions/ShowTransactionSheet";
import { ShowUserSheet } from "../widgets/lists/Users/ShowUserSheet";
import { ShowWalletLinkedTransactionsSheet } from "../widgets/lists/WalletLinkedTransactions/ShowWalletLinkedTransactionsSheet";
import { ShowWalletDialog } from "../widgets/lists/Wallets/ShowWalletDialog";
import { ShowWalletTransactionsSheet } from "../widgets/lists/WalletTransactions/ShowWalletTransactionsSheet";
import { useSheets } from "./SheetProvider";

export const SHEETS_COMPONENTS = {
    account: ShowAccountSheet,
    direction: ShowDirectionSheet,
    merchant: ShowMerchantSheet,
    user: ShowUserSheet,
    transaction: ShowTransactionSheet,
    provider: ShowProviderSheet,
    terminal: TerminalShowDialog,
    wallet: ShowWalletDialog,
    walletLinked: ShowWalletLinkedTransactionsSheet,
    walletTransactions: ShowWalletTransactionsSheet,
    callbridgeMappings: ShowMappingSheet,
    callbridgeHistory: ShowCallbridgeHistorySheet,
    financialInstitution: ShowFinancialInstitutionSheet,
    terminalPaymentInstruments: ShowTerminalPaymentInstrumentsSheet,
    systemPaymentInstrument: SystemPaymentInstrumentSheet,
    cascade: ShowCascadeSheet,
    cascadeTerminal: ShowCascadeTerminalSheet
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
