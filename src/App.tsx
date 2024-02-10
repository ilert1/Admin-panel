import { Admin, Resource } from "react-admin";
import { i18nProvider } from "@/data";
import { Receipt as ReceiptIcon, AccountBalanceWallet as AccountBalanceWalletIcon } from "@mui/icons-material";
import { BaseDataProvider, AuthProvider } from "@/data";
import { AccountList, TransactionList } from "@/components/widgets/lists";
import { AccountCreate } from "@/components/widgets/create";
import { AccountShow, TransactionShow } from "./components/widgets/show";

export const App = () => (
    <Admin i18nProvider={i18nProvider} dataProvider={new BaseDataProvider()} authProvider={new AuthProvider()}>
        <Resource
            name="accounts"
            list={AccountList}
            show={AccountShow}
            create={AccountCreate}
            icon={AccountBalanceWalletIcon}
        />
        <Resource name="transactions" list={TransactionList} show={TransactionShow} icon={ReceiptIcon} />
    </Admin>
);
