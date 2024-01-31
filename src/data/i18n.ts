import polyglotI18nProvider from "ra-i18n-polyglot";
import raRU from "ra-language-russian";
import raEn from "ra-language-english";

const ru = {
    ...raRU,
    resources: {
        accounts: {
            name: "Аккаунт |||| Аккаунты",
            fields: {
                id: "ID",
                owner_id: "ID владельца",
                state: "Состояние",
                type: "Тип"
            }
        }
    }
};

const en = {
    ...raEn,
    resources: {
        accounts: {
            name: "Account |||| Accounts",
            fields: {
                id: "ID",
                owner_id: "Owner ID",
                state: "State",
                type: "Type"
            }
        }
    }
};

const translations: any = { ru, en };

export const i18nProvider = polyglotI18nProvider((locale: string) => translations[locale], "en", [
    { locale: "ru", name: "Русский" },
    { locale: "en", name: "English" }
]);
