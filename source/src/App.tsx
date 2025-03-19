import { CustomRoutes, Resource, combineDataProviders, CoreAdminContext, CoreAdminUI } from "react-admin";
import {
    TransactionDataProvider,
    i18nProvider,
    BaseDataProvider,
    UsersDataProvider,
    MerchantsDataProvider,
    CurrenciesDataProvider,
    ProvidersDataProvider,
    DirectionsDataProvider,
    WalletsDataProvider,
    VaultDataProvider,
    TerminalsDataProvider
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
    TerminalsList
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
    BanknoteIcon,
    StoreIcon,
    NetworkIcon,
    SignpostIcon,
    CreditCardIcon,
    SquareTerminal
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
import { OperationsDataProvider } from "./data/operations";
import { SheetProvider } from "./components/providers/SheetProvider";
import { SheetManager } from "./components/providers/SheetManager";

const WALLET_ENABLED = import.meta.env.VITE_WALLET_ENABLED === "true" ? true : false;

const dataProvider = combineDataProviders((resource: string) => {
    if (resource?.startsWith("transactions")) {
        return new TransactionDataProvider();
    } else if (resource === "users") {
        return new UsersDataProvider();
    } else if (resource === "currency") {
        return new CurrenciesDataProvider();
    } else if (resource === "merchant") {
        return new MerchantsDataProvider();
    } else if (resource === "provider") {
        return new ProvidersDataProvider();
    } else if (resource?.endsWith("/terminal")) {
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
        return new WalletsDataProvider();
    } else if (resource === "vault") {
        return new VaultDataProvider();
    } else if (resource === "operations") {
        return new OperationsDataProvider();
    } else {
        return new BaseDataProvider();
    }
});
dataProvider.supportAbortSignal = true;

export const App = () => {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="juggler-ui-theme">
            <SheetProvider>
                <CoreAdminContext i18nProvider={i18nProvider} dataProvider={dataProvider} authProvider={authProvider}>
                    <CoreAdminUI
                        catchAll={NotFound}
                        layout={MainLayout}
                        loading={InitLoading}
                        title="Juggler"
                        requireAuth
                        loginPage={LoginPage}>
                        {(permissions: string) => (
                            <>
                                <Resource name="accounts" list={AccountList} icon={WalletMinimalIcon} />
                                <Resource name="transactions" list={TransactionList} icon={HistoryIcon} />
                                <Resource name="withdraw" list={WithdrawList} icon={BitcoinIcon} />
                                {WALLET_ENABLED && (
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
                                )}

                                {permissions === "admin" && (
                                    <>
                                        <Resource name="users" list={UserList} icon={UsersIcon} />
                                        <Resource name="currency" list={CurrenciesList} icon={BanknoteIcon} />
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
                                    </>
                                )}

                                {permissions === "merchant" && (
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
                </CoreAdminContext>
            </SheetProvider>
        </ThemeProvider>
    );
};
