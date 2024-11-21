import { CustomRoutes, Resource, combineDataProviders, CoreAdminContext, CoreAdminUI } from "react-admin";
import { createBrowserHistory as createHistory } from "history";
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
    VaultDataProvider
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
    WalletTransactionsList
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
    CreditCardIcon
} from "lucide-react";
import { authProvider, ThemeProvider } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { MerchantEdit } from "./components/widgets/edit";
import { InitLoading } from "./components/ui/loading";
import { NotFound } from "./components/widgets/shared/NotFound";
import WalletsLogo from "./lib/icons/Wallets";
import { WalletStore } from "./pages/WalletStore";

const WALLET_ENABLED = import.meta.env.VITE_WALLET_ENABLED === "true" ? true : false;

const dataProvider = combineDataProviders((resource: string) => {
    switch (resource) {
        case "transactions":
            return new TransactionDataProvider();
        case "users":
            return new UsersDataProvider();
        case "currency":
            return new CurrenciesDataProvider();
        case "merchant":
            return new MerchantsDataProvider();
        case "provider":
            return new ProvidersDataProvider();
        case "direction":
            return new DirectionsDataProvider();
        case "wallet":
        case "transaction":
        case "merchant/transaction":
            return new WalletsDataProvider();
        case "vault":
            return new VaultDataProvider();
        default:
            return new BaseDataProvider();
    }
});

const history = createHistory();
export const App = () => {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="juggler-ui-theme">
            <CoreAdminContext
                history={history}
                i18nProvider={i18nProvider}
                dataProvider={dataProvider}
                authProvider={authProvider}>
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
                                    <Resource name="direction" list={DirectionsList} icon={SignpostIcon} />
                                    {WALLET_ENABLED && (
                                        <Resource name="wallet" list={WalletsList} icon={WalletsLogo}>
                                            <Route path="storage" element={<WalletStore />} />
                                            <Route path="transactions" element={<WalletTransactionsList />} />
                                        </Resource>
                                    )}
                                </>
                            )}

                            {permissions === "merchant" && (
                                <Resource name="bankTransfer" icon={CreditCardIcon}>
                                    <Route path="/" element={<PayOutPage />} />
                                </Resource>
                            )}

                            <CustomRoutes>
                                <Route path="/login" element={<LoginPage />} />
                            </CustomRoutes>
                        </>
                    )}
                </CoreAdminUI>

                <Toaster />
            </CoreAdminContext>
        </ThemeProvider>
    );
};
