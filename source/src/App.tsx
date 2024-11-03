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
    DirectionsDataProvider
} from "@/data";
import {
    AccountList,
    TransactionList,
    WithdrawList,
    UserList,
    CurrenciesList,
    MerchantList,
    ProvidersList,
    DirectionsList
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
    SignpostIcon
} from "lucide-react";
import { authProvider, ThemeProvider } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { MerchantEdit } from "./components/widgets/edit";
import { InitLoading } from "./components/ui/loading";
import { NotFound } from "./components/widgets/shared/NotFound";

const dataProvider = combineDataProviders((resource: string) => {
    if (resource === "transactions") {
        return new TransactionDataProvider();
    } else if (resource === "users") {
        return new UsersDataProvider();
    } else if (resource === "currency") {
        return new CurrenciesDataProvider();
    } else if (resource === "merchant") {
        return new MerchantsDataProvider();
    } else if (resource === "provider") {
        return new ProvidersDataProvider();
    } else if (resource === "direction") {
        return new DirectionsDataProvider();
    } else {
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
                                </>
                            )}

                            <CustomRoutes>
                                {permissions === "merchant" && <Route path="/bank-transfer" element={<PayOutPage />} />}
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
