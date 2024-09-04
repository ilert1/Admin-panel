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
import {
    AccountCreate,
    CurrencyCreate,
    DirectionCreate,
    MerchantCreate,
    ProviderCreate,
    UserCreate
} from "@/components/widgets/create";
import { Route } from "react-router-dom";
import { PayOutPage, PayOutCryptoPage, LoginPage } from "./pages";
import { Dashboard } from "./Dashboard";
import { MainLayout } from "./layouts";
import { WalletIcon, ReceiptIcon, WaypointsIcon, UsersIcon, StoreIcon, PcCaseIcon, MilestoneIcon } from "lucide-react";
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
import { CurrencyIcon } from "lucide-react";
import { CurrencyEdit, MerchantEdit, ProvidersEdit } from "./components/widgets/edit";

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
                    dashboard={Dashboard}
                    layout={MainLayout}
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
                                icon={WalletIcon}
                            />

                            <Resource
                                name="transactions"
                                list={TransactionList}
                                show={TransactionShow}
                                icon={ReceiptIcon}
                            />

                            <Resource name="withdraw" list={WithdrawList} show={WithdrawShow} icon={WaypointsIcon} />

                            {permissions === "admin" && (
                                <>
                                    <Resource
                                        name="currency"
                                        list={CurrenciesList}
                                        show={CurrenciesShow}
                                        create={CurrencyCreate}
                                        edit={CurrencyEdit}
                                        icon={CurrencyIcon}
                                    />
                                    <Resource
                                        name="users"
                                        list={UserList}
                                        show={UserShow}
                                        icon={UsersIcon}
                                        create={UserCreate}
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
                                        icon={PcCaseIcon}
                                    />
                                    <Resource
                                        name="direction"
                                        list={DirectionsList}
                                        show={DirectionsShow}
                                        icon={MilestoneIcon}
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
