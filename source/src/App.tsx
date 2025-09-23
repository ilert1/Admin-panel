import { CustomRoutes, Resource, combineDataProviders, CoreAdminContext, CoreAdminUI } from "react-admin";
import { BrowserRouter, Navigate } from "react-router-dom";
import {
    TransactionDataProvider,
    i18nProvider,
    UsersDataProvider,
    MerchantsDataProvider,
    CurrenciesDataProvider,
    ProvidersDataProvider,
    DirectionsDataProvider,
    WalletsDataProvider,
    VaultDataProvider,
    TerminalsDataProvider,
    OperationsDataProvider,
    CallbridgeDataProvider,
    BaseDataProvider,
    PayoutDataProvider,
    AccountsDataProvider,
    CascadeTerminalDataProvider,
    CascadesDataProvider
} from "@/data";
import {
    AccountList,
    TransactionList,
    WithdrawList,
    UserList,
    CurrenciesList,
    MerchantList,
    ProvidersList,
    DirectionsList,
    WalletsList,
    WalletTransactionsList,
    WalletLinkedTransactionsList,
    TerminalsList,
    CascadesList
    // CascadeMerchantsList,
    // CascadeConflictsList
} from "@/components/widgets/lists";
import { MerchantCreate } from "@/components/widgets/create";
import { Route } from "react-router-dom";
import { PayOutPage, LoginPage } from "./pages";
import { MainLayout } from "./layouts";
import {
    WalletMinimalIcon,
    HistoryIcon,
    BitcoinIcon,
    UsersIcon,
    StoreIcon,
    NetworkIcon,
    SignpostIcon,
    CreditCardIcon,
    SquareTerminal,
    Split,
    Nfc
} from "lucide-react";
import { authProvider, ThemeProvider } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { MerchantEdit } from "./components/widgets/edit";
import { InitLoading } from "./components/ui/loading";
import { NotFound } from "./components/widgets/shared/NotFound";
import WalletsLogo from "./lib/icons/Wallets";
import { WalletStore } from "./pages/WalletStore";
import { OptionsPage } from "./pages/SettingsPage";
import { SheetProvider } from "./components/providers/SheetProvider";
import { SheetManager } from "./components/providers/SheetManager";
import { MappingsList } from "./components/widgets/lists/Mappings/MappingsList";
import { CallbackHistoryList } from "./components/widgets/lists/CallbridgeHistory/CallbridgeHistory";
import { PaymentTypesProvider } from "./data/payment_types";
import { PaymentTypesList } from "./components/widgets/lists/PaymentTypes";
import { FinancialInstitutionList } from "./components/widgets/lists/FinancialInstitution";
import { SystemPaymentInstrumentsList } from "./components/widgets/lists/SystemPaymentInstruments";
import { TerminalPaymentInstrumentsList } from "./components/widgets/lists/TerminalPaymentInstruments";
import { FinancialInstitutionProvider } from "./data/financialInstitution";
import { TerminalPaymentInstrumentsProvider } from "./data/terminalPaymentInstruments";
import { SystemPaymentInstrumentsProvider } from "./data/systemPaymentInstruments";
import { CallbackBackupsList } from "./components/widgets/lists/CallbackBackup/CallbackBackupsList";
import { CallbackBackupsDataProvider } from "./data/callback_backup";
import { initializeStore } from "./helpers/persistentStore";
import { CascadeMerchantsDataProvider } from "./data/merchant_cascade";

const dataProvider = combineDataProviders(resource => {
    if (resource?.startsWith("transactions")) {
        return TransactionDataProvider;
    } else if (resource === "users") {
        return UsersDataProvider;
    } else if (resource === "merchant") {
        return new MerchantsDataProvider();
    } else if (resource === "provider") {
        return new ProvidersDataProvider();
    } else if (resource === "terminals") {
        return new TerminalsDataProvider();
    } else if (resource === "direction") {
        return new DirectionsDataProvider();
    } else if (
        resource === "wallet" ||
        resource === "transaction" ||
        resource === "reconciliation" ||
        resource === "merchant/wallet" ||
        resource === "merchant/transaction" ||
        resource === "merchant/reconciliation"
    ) {
        return WalletsDataProvider;
    } else if (resource === "vault") {
        return VaultDataProvider;
    } else if (resource === "operations") {
        return new OperationsDataProvider();
    } else if (resource === "callback_backup") {
        return new CallbackBackupsDataProvider();
    } else if (resource.includes("callbridge")) {
        return new CallbridgeDataProvider();
    } else if (resource.includes("payout")) {
        return PayoutDataProvider;
    } else if (resource.includes("account")) {
        return AccountsDataProvider;
    } else if (resource === "currency") {
        return new CurrenciesDataProvider();
    } else if (resource === "payment_type") {
        return new PaymentTypesProvider();
    } else if (resource === "financialInstitution") {
        return new FinancialInstitutionProvider();
    } else if (resource === "terminalPaymentInstruments") {
        return new TerminalPaymentInstrumentsProvider();
    } else if (resource === "systemPaymentInstruments") {
        return new SystemPaymentInstrumentsProvider();
    } else if (resource === "cascades") {
        return new CascadesDataProvider();
    } else if (resource === "cascade_terminals") {
        return new CascadeTerminalDataProvider();
    } else if (resource.includes("cascadeMerchants")) {
        return new CascadeMerchantsDataProvider();
    } else {
        return BaseDataProvider;
    }
});
dataProvider.supportAbortSignal = true;

const persistentStore = initializeStore();
const BANK_TRANSFER = import.meta.env.VITE_BANK_TRANSFER_ENABLED === "true" ? true : false;

export const App = () => {
    const getDefaultRoute = (permissions: string) => {
        const last = localStorage.getItem(`lastResource_${permissions}`);
        return last && last !== "/" ? last : "/accounts";
    };

    return (
        <ThemeProvider defaultTheme="dark" storageKey="juggler-ui-theme">
            <BrowserRouter>
                <CoreAdminContext
                    i18nProvider={i18nProvider}
                    dataProvider={dataProvider}
                    authProvider={authProvider}
                    store={persistentStore}>
                    <SheetProvider>
                        <CoreAdminUI
                            disableTelemetry
                            catchAll={NotFound}
                            layout={MainLayout}
                            loading={InitLoading}
                            title="Juggler"
                            requireAuth
                            loginPage={LoginPage}>
                            {(permissions: string) => (
                                <>
                                    <CustomRoutes>
                                        <Route
                                            path="/"
                                            element={<Navigate to={getDefaultRoute(permissions)} replace />}
                                        />
                                    </CustomRoutes>

                                    <Resource name="accounts" list={AccountList} icon={WalletMinimalIcon} />
                                    <Resource name="transactions" list={TransactionList} icon={HistoryIcon} />
                                    <Resource name="withdraw" list={WithdrawList} icon={BitcoinIcon} />
                                    <Resource name="wallet" list={WalletsList} icon={WalletsLogo}>
                                        {permissions === "admin" && <Route path="storage" element={<WalletStore />} />}
                                        {permissions === "admin" && (
                                            <Route
                                                path="linkedTransactions"
                                                element={<WalletLinkedTransactionsList />}
                                            />
                                        )}
                                        <Route path="transactions" element={<WalletTransactionsList />} />
                                    </Resource>

                                    {permissions === "admin" && (
                                        <>
                                            <Resource name="users" list={UserList} icon={UsersIcon} />
                                            <Resource
                                                name="merchant"
                                                list={MerchantList}
                                                create={MerchantCreate}
                                                edit={MerchantEdit}
                                                icon={StoreIcon}
                                            />
                                            <Resource name="provider" list={ProvidersList} icon={NetworkIcon} />
                                            <Resource name="terminals" list={TerminalsList} icon={SquareTerminal} />
                                            <Resource name="direction" list={DirectionsList} icon={SignpostIcon} />

                                            <Resource name="paymentSettings" icon={Nfc}>
                                                <Route index element={<Navigate to="paymentType" replace />} />
                                                <Route path="paymentType" element={<PaymentTypesList />} />
                                                <Route
                                                    path="financialInstitution"
                                                    element={<FinancialInstitutionList />}
                                                />
                                                <Route
                                                    path="terminalPaymentInstruments"
                                                    element={<TerminalPaymentInstrumentsList />}
                                                />
                                                <Route
                                                    path="systemPaymentInstruments"
                                                    element={<SystemPaymentInstrumentsList />}
                                                />
                                                <Route path="currency" element={<CurrenciesList />} />
                                            </Resource>

                                            <Resource name="callbridge" icon={Split}>
                                                <Route path="mapping" element={<MappingsList />} />
                                                <Route path="history" element={<CallbackHistoryList />} />
                                                <Route path="history/backup" element={<CallbackBackupsList />} />
                                            </Resource>

                                            <Resource name="cascadeSettings" icon={Split}>
                                                <Route path="cascades" element={<CascadesList />} />
                                                {/* <Route path="cascadeMerchants" element={<CascadeMerchantsList />} />
                                                <Route path="cascadeConflicts" element={<CascadeConflictsList />} /> */}
                                            </Resource>
                                        </>
                                    )}

                                    {permissions === "merchant" && BANK_TRANSFER && (
                                        <Resource name="bankTransfer" icon={CreditCardIcon}>
                                            <Route path="/" element={<PayOutPage />} />
                                        </Resource>
                                    )}

                                    <CustomRoutes>
                                        <Route path="/login" element={<LoginPage />} />
                                        <Route path="/settings" element={<OptionsPage />} />
                                    </CustomRoutes>
                                </>
                            )}
                        </CoreAdminUI>
                        <SheetManager />
                        <Toaster />
                    </SheetProvider>
                </CoreAdminContext>
            </BrowserRouter>
        </ThemeProvider>
    );
};
