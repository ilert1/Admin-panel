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
                created_at: "Дата создания",
                committed: "Зафиксированная",
                state: {
                    title: "Состояние",
                    final: "Финальная",
                    state_int: "Код",
                    state_description: "Статус"
                },
                source: {
                    header: "Отправитель",
                    id: "ID",
                    amount: {
                        currency: "Валюта",
                        value: "Сумма"
                    },
                    meta: {
                        caption: "Название"
                    }
                },
                destination: {
                    header: "Получатель",
                    id: "ID",
                    amount: {
                        currency: "Валюта",
                        value: "Сумма"
                    },
                    meta: {
                        caption: "Название"
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
                cancel: "Отмена",
                success: "Успешно",
                storno: "Сторно",
                commit: "Зафиксировать",
                openDispute: "Открыть диспут",
                closeDispute: "Закрыть диспут"
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
                created_at: "Created at",
                committed: "Committed",
                state: {
                    title: "State",
                    final: "Is final",
                    state_int: "Code",
                    state_description: "Status"
                },
                source: {
                    header: "Sender",
                    id: "ID",
                    amount: {
                        currency: "Currency",
                        value: "Value"
                    },
                    meta: {
                        caption: "Name"
                    }
                },
                destination: {
                    header: "Receiver",
                    id: "ID",
                    amount: {
                        currency: "Currency",
                        value: "Value"
                    },
                    meta: {
                        caption: "Name"
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
                save: "Save",
                cancel: "Cancel",
                success: "Success",
                storno: "Storno",
                commit: "Commit",
                openDispute: "Open dispute",
                closeDispute: "Close dispute"
            }
        }
    }
};

const translations: any = { ru, en };

export const i18nProvider = polyglotI18nProvider((locale: string) => translations[locale], "en", [
    { locale: "ru", name: "Русский" },
    { locale: "en", name: "English" }
]);
