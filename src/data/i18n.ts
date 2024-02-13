import polyglotI18nProvider from "ra-i18n-polyglot";
import raRU from "ra-language-russian";
import raEn from "ra-language-english";

const ru = {
    ...raRU,
    resources: {
        accounts: {
            name: "Счет |||| Счета",
            fields: {
                id: "ID",
                owner_id: "ID владельца",
                state: "Состояние",
                type: "Тип",
                amounts: "Суммы",
                meta: {
                    caption: "Название"
                }
            }
        },
        transactions: {
            name: "Транзакция |||| Транзакции",
            fields: {
                id: "ID",
                state: {
                    title: "Состояние",
                    final: "Финальная",
                    state_int: "Код",
                    state_description: "Описание"
                },
                source: {
                    id: "ID",
                    amount: {
                        currency: "Валюта",
                        value: "Сумма"
                    }
                },
                destination: {
                    id: "ID",
                    amount: {
                        currency: "Валюта",
                        value: "Сумма"
                    }
                },
                recipient: "Получатель",
                type: "Тип",
                value: "Сумма",
                history: "История",
                fees: "Комиссии"
            },
            show: {
                statusButton: "Ручной перевод в статус",
                save: "Сохранить",
                cancel: "Отмена"
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
                type: "Type",
                amounts: "Amounts",
                meta: {
                    caption: "Caption"
                }
            }
        },
        transactions: {
            name: "Transaction |||| Transactions",
            fields: {
                id: "ID",
                state: {
                    title: "State",
                    final: "Is final",
                    state_int: "Code",
                    state_description: "Description"
                },
                source: {
                    id: "ID",
                    amount: {
                        currency: "Currency",
                        value: "Value"
                    }
                },
                destination: {
                    id: "ID",
                    amount: {
                        currency: "Currency",
                        value: "Value"
                    }
                },
                recipient: "Recipient",
                value: "Value",
                type: "Type",
                history: "History",
                fees: "Fees"
            },
            show: {
                statusButton: "Manual change status",
                save: "Сохранить",
                cancel: "Отмена"
            }
        }
    }
};

const translations: any = { ru, en };

export const i18nProvider = polyglotI18nProvider((locale: string) => translations[locale], "en", [
    { locale: "ru", name: "Русский" },
    { locale: "en", name: "English" }
]);
