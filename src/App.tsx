import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser, combineDataProviders } from "react-admin";
import { AccountsDataProvider, TransactionsDataProvider, i18nProvider } from "@/data";
import { People as PeopleIcon, Receipt as ReceiptIcon } from "@mui/icons-material";
import { BaseDataProvider } from "@/data";
import { AccountList } from "@/components/widgets/lists";
import { AccountCreate } from "@/components/widgets/create";

const dataProvider = combineDataProviders(resource => {
    if (resource === "accounts") {
        return new AccountsDataProvider();
    } else if (resource === "transactions") {
        return new TransactionsDataProvider();
    } else {
        return new BaseDataProvider();
    }
});

export const App = () => (
    <Admin i18nProvider={i18nProvider} dataProvider={dataProvider}>
        <Resource name="accounts" list={AccountList} show={ShowGuesser} create={AccountCreate} icon={PeopleIcon} />
        <Resource name="transactions" list={ListGuesser} show={ShowGuesser} create={EditGuesser} icon={ReceiptIcon} />
    </Admin>
);
