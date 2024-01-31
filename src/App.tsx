import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser } from "react-admin";
import { i18nProvider } from "@/data";
import { People as PeopleIcon, Receipt as ReceiptIcon } from "@mui/icons-material";
import { BaseDataProvider } from "@/data";
import { AccountList } from "@/components/widgets/lists";
import { AccountCreate } from "@/components/widgets/create";

const dataProvider = new BaseDataProvider();

export const App = () => (
    <Admin i18nProvider={i18nProvider} dataProvider={dataProvider}>
        <Resource name="accounts" list={AccountList} create={AccountCreate} icon={PeopleIcon} />
        <Resource
            name="transactions"
            list={ListGuesser}
            show={ShowGuesser}
            edit={EditGuesser}
            create={EditGuesser}
            icon={ReceiptIcon}
        />
    </Admin>
);
