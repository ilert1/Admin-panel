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
import { PayOutPage, PayOutCryptoPage, LoginPage } from "./pages";
import { MainLayout } from "./layouts";
import {
    WalletMinimalIcon,
    HistoryIcon,
    BitcoinIcon,
    UsersIcon,
    BanknoteIcon,
    StoreIcon,
    NetworkIcon,
    SignpostIcon
} from "lucide-react";
import { authProvider, ThemeProvider } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { MerchantEdit } from "./components/widgets/edit";
import { InitLoading } from "./components/ui/loading";
import WalletsLogo from "./lib/icons/Wallets";
import { WalletStore } from "./pages/WalletStore";

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
            return new WalletsDataProvider();
        case "vault":
            return new VaultDataProvider();
        default:
            return new BaseDataProvider();
    }
});

export const App = () => {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="juggler-ui-theme">
            <CoreAdminContext i18nProvider={i18nProvider} dataProvider={dataProvider} authProvider={authProvider}>
                <CoreAdminUI
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

                            <Resource name="wallet" list={WalletsList} icon={WalletsLogo}>
                                <Route path="storage" element={<WalletStore />} />
                                <Route path="transactions" element={<WalletTransactionsList />} />
                            </Resource>

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
                                </>
                            )}

                            <CustomRoutes>
                                {permissions === "merchant" && <Route path="/bank-transfer" element={<PayOutPage />} />}
                                {permissions === "merchant" && (
                                    <Route path="/crypto-transfer" element={<PayOutCryptoPage />} />
                                )}
                                <Route path="/login" element={<LoginPage />} />
                            </CustomRoutes>
                        </>
                    )}
                </CoreAdminUI>
            </CoreAdminContext>
            <Toaster />
        </ThemeProvider>
    );
};
