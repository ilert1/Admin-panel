import { CustomRoutes, Resource, combineDataProviders, CoreAdminContext, CoreAdminUI } from "react-admin";
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
import { AccountCreate, DirectionCreate, MerchantCreate, ProviderCreate } from "@/components/widgets/create";
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
import {
    AccountShow,
    CurrenciesShow,
    DirectionsShow,
    MerchantShow,
    ProvidersShow,
    TransactionShow,
    UserShow,
    WithdrawShow
} from "./components/widgets/show";
import { MerchantEdit, ProvidersEdit } from "./components/widgets/edit";
import { InitLoading } from "./components/ui/loading";

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
                            <Resource
                                name="accounts"
                                list={AccountList}
                                show={AccountShow}
                                create={AccountCreate}
                                icon={WalletMinimalIcon}
                            />

                            <Resource
                                name="transactions"
                                list={TransactionList}
                                show={TransactionShow}
                                icon={HistoryIcon}
                            />

                            <Resource name="withdraw" list={WithdrawList} show={WithdrawShow} icon={BitcoinIcon} />

                            {permissions === "admin" && (
                                <>
                                    <Resource name="users" list={UserList} show={UserShow} icon={UsersIcon} />
                                    <Resource
                                        name="currency"
                                        list={CurrenciesList}
                                        show={CurrenciesShow}
                                        icon={BanknoteIcon}
                                    />

                                    <Resource
                                        name="merchant"
                                        list={MerchantList}
                                        show={MerchantShow}
                                        create={MerchantCreate}
                                        edit={MerchantEdit}
                                        icon={StoreIcon}
                                    />
                                    <Resource
                                        name="provider"
                                        list={ProvidersList}
                                        show={ProvidersShow}
                                        edit={ProvidersEdit}
                                        create={ProviderCreate}
                                        icon={NetworkIcon}
                                    />
                                    <Resource
                                        name="direction"
                                        list={DirectionsList}
                                        show={DirectionsShow}
                                        icon={SignpostIcon}
                                        create={DirectionCreate}
                                    />
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
