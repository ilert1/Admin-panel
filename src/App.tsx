import {
    Admin,
    CustomRoutes,
    Resource,
    combineDataProviders,
    Menu,
    Layout,
    useTranslate,
    AuthProvider
} from "react-admin";
import { TransactionDataProvider, i18nProvider } from "@/data";
import {
    Receipt as ReceiptIcon,
    AccountBalanceWallet as AccountBalanceWalletIcon,
    AddCard as AddCardIcon,
    CreditScore as CreditScoreIcon
} from "@mui/icons-material";
import { BaseDataProvider } from "@/data";
import { AccountList, TransactionList } from "@/components/widgets/lists";
import { AccountCreate } from "@/components/widgets/create";
import { AccountShow, TransactionShow } from "./components/widgets/show";
import { Route } from "react-router-dom";
import { PayInPage, PayOutPage } from "./pages";
import Keycloak, { KeycloakConfig, KeycloakTokenParsed, KeycloakInitOptions } from "keycloak-js";
import { keycloakAuthProvider } from "ra-keycloak";
import { useEffect, useRef, useState } from "react";

export const MyMenu = () => {
    const translate = useTranslate();
    return (
        <Menu>
            <Menu.ResourceItems />
            <Menu.Item to="/payin" primaryText={translate("app.menu.payin")} leftIcon={<AddCardIcon />} />
            <Menu.Item to="/payout" primaryText={translate("app.menu.payout")} leftIcon={<CreditScoreIcon />} />
        </Menu>
    );
};

export const MyLayout = (props: any) => <Layout {...props} menu={MyMenu} />;

const dataProvider = combineDataProviders(resource => {
    if (resource === "transactions") {
        return new TransactionDataProvider();
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
            setKeycloak(keycloakClient);
        };
        if (!keycloak) {
            initKeyCloakClient();
        }
    }, [keycloak]);

    if (keycloak) {
        return (
            <Admin
                requireAuth
                i18nProvider={i18nProvider}
                dataProvider={dataProvider}
                authProvider={authProvider.current}
                layout={MyLayout}>
                <Resource
                    name="accounts"
                    list={AccountList}
                    show={AccountShow}
                    create={AccountCreate}
                    icon={AccountBalanceWalletIcon}
                />
                <Resource name="transactions" list={TransactionList} show={TransactionShow} icon={ReceiptIcon} />
                <CustomRoutes>
                    <Route path="/payin" element={<PayInPage />} />
                    <Route path="/payout" element={<PayOutPage />} />
                </CustomRoutes>
            </Admin>
        );
    }
};
