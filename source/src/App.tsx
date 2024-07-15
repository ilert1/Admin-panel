import { CustomRoutes, Resource, combineDataProviders, AuthProvider, CoreAdminContext, CoreAdminUI } from "react-admin";
import { TransactionDataProvider, i18nProvider, BaseDataProvider, UsersDataProvider } from "@/data";
import { AccountList, TransactionList, WithdrawList, UserList } from "@/components/widgets/lists";
import { AccountCreate } from "@/components/widgets/create";
import { Route } from "react-router-dom";
import { PayOutPage, PayOutCryptoPage } from "./pages";
import Keycloak, { KeycloakConfig, KeycloakTokenParsed, KeycloakInitOptions } from "keycloak-js";
import { keycloakAuthProvider } from "ra-keycloak";
import { useEffect, useRef, useState } from "react";
import { Dashboard } from "./Dashboard";
import { MainLayout } from "./layouts";
import { WalletIcon, ReceiptIcon, WaypointsIcon, UsersIcon } from "lucide-react";
import { ThemeProvider } from "@/components/providers";
import { isTokenStillFresh } from "@/helpers/jwt";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const dataProvider = combineDataProviders(resource => {
    if (resource === "transactions") {
        return new TransactionDataProvider();
    } else if (resource === "users") {
        return new UsersDataProvider();
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
                        {permissions => (
                            <>
                                <Resource name="accounts" list={AccountList} create={AccountCreate} icon={WalletIcon} />
                                <Resource name="transactions" list={TransactionList} icon={ReceiptIcon} />
                                <Resource name="withdraw" list={WithdrawList} icon={WaypointsIcon} />
                                {permissions === "admin" && <Resource name="users" list={UserList} icon={UsersIcon} />}
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
