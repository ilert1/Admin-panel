import { CustomRoutes, Resource, combineDataProviders, AuthProvider, CoreAdminContext, CoreAdminUI } from "react-admin";
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
import { PayOutPage, PayOutCryptoPage } from "./pages";
import Keycloak, { KeycloakConfig, KeycloakTokenParsed, KeycloakInitOptions } from "keycloak-js";
import { keycloakAuthProvider } from "ra-keycloak";
import { useEffect, useRef, useState } from "react";
import { Dashboard } from "./Dashboard";
import { MainLayout } from "./layouts";
import { WalletIcon, ReceiptIcon, WaypointsIcon, UsersIcon, StoreIcon, PcCaseIcon, MilestoneIcon } from "lucide-react";
import { ThemeProvider } from "@/components/providers";
import { isTokenStillFresh } from "@/helpers/jwt";
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
import { CurrencyEdit, DirectionEdit, MerchantEdit, ProvidersEdit } from "./components/widgets/edit";

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

const initOptions: KeycloakInitOptions = { onLoad: "login-required" };

const getPermissions = (decoded: KeycloakTokenParsed) => {
    const roles = decoded?.realm_access?.roles;
    if (!roles) {
        return false;
    }
    if (roles.includes("admin")) return "admin";
    if (roles.includes("merchant")) return "merchant";
    return false;
};

const raKeycloakOptions = {
    onPermissions: getPermissions
};

const config: KeycloakConfig = {
    url: import.meta.env.VITE_KEYCLOAK_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID
};

export const App = () => {
    const [keycloak, setKeycloak] = useState<Keycloak>();
    const authProvider = useRef<AuthProvider>();

    useEffect(() => {
        const initKeyCloakClient = async () => {
            const keycloakClient = new Keycloak(config);
            await keycloakClient.init(initOptions);

            if (keycloakClient?.authenticated) {
                localStorage.setItem("access-token", keycloakClient.token + "");
            } else {
                localStorage.removeItem("access-token");
            }
            authProvider.current = keycloakAuthProvider(keycloakClient, raKeycloakOptions);
            authProvider.current.checkAuth = () => {
                const tokenString = localStorage.getItem("access-token");
                if (tokenString && isTokenStillFresh(tokenString)) {
                    return Promise.resolve();
                } else {
                    return Promise.reject();
                }
            };
            setKeycloak(keycloakClient);
        };
        if (!keycloak) {
            initKeyCloakClient();
        }
    }, [keycloak]); // eslint-disable-line react-hooks/exhaustive-deps

    if (keycloak) {
        return (
            <ThemeProvider defaultTheme="dark" storageKey="juggler-ui-theme">
                <CoreAdminContext
                    i18nProvider={i18nProvider}
                    dataProvider={dataProvider}
                    authProvider={authProvider.current}>
                    <CoreAdminUI dashboard={Dashboard} layout={MainLayout} title="Juggler" requireAuth>
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

                                <Resource
                                    name="withdraw"
                                    list={WithdrawList}
                                    show={WithdrawShow}
                                    icon={WaypointsIcon}
                                />

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
                                    {permissions === "merchant" && (
                                        <Route path="/bank-transfer" element={<PayOutPage />} />
                                    )}
                                    {permissions === "merchant" && (
                                        <Route path="/crypto-transfer" element={<PayOutCryptoPage />} />
                                    )}
                                </CustomRoutes>
                            </>
                        )}
                    </CoreAdminUI>
                </CoreAdminContext>
                <Toaster />
            </ThemeProvider>
        );
    }
};
