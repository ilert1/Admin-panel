import { Admin, CustomRoutes, Resource, combineDataProviders, Menu, Layout } from "react-admin";
import { TransactionDataProvider, i18nProvider } from "@/data";
import {
    Receipt as ReceiptIcon,
    AccountBalanceWallet as AccountBalanceWalletIcon,
    AddCard as AddCardIcon
} from "@mui/icons-material";
import { BaseDataProvider, AuthProvider } from "@/data";
import { AccountList, TransactionList } from "@/components/widgets/lists";
import { AccountCreate } from "@/components/widgets/create";
import { AccountShow, TransactionShow } from "./components/widgets/show";
import { Route } from "react-router-dom";
import { PayInPage } from "./pages";

export const MyMenu = () => (
    <Menu>
        <Menu.DashboardItem />
        <Menu.ResourceItems />
        <Menu.Item to="/payin" primaryText="Pay IN" leftIcon={<AddCardIcon />} />
    </Menu>
);

export const MyLayout = (props: any) => <Layout {...props} menu={MyMenu} />;

const dataProvider = combineDataProviders(resource => {
    if (resource === "transactions") {
        return new TransactionDataProvider();
    } else {
        return new BaseDataProvider();
    }
});

export const App = () => (
    <Admin i18nProvider={i18nProvider} dataProvider={dataProvider} authProvider={new AuthProvider()} layout={MyLayout}>
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
        </CustomRoutes>
    </Admin>
);
