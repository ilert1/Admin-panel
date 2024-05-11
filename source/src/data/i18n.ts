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
                amount: {
                    id: "ID",
                    type: "Тип",
                    currency: "Валюта",
                    value: "Сумма"
                },
                meta: {
                    caption: "Название"
                }
            },
            showHeader: "Информация о счете",
            showDescription: "Подробная информация о счете с ID %{id}"
        },
        transactions: {
            name: "Транзакция |||| Транзакции",
            fields: {
                id: "ID",
                created_at: "Дата создания",
                committed: "Зафиксированная",
                dispute: "Диспут",
                meta: {
                    external_status: "Внешний статус",
                    parentId: "ID родительской транзакции"
                },
                state: {
                    title: "Состояние",
                    final: "Финальная",
                    state_int: "Код",
                    state_description: "Статус"
                },
                rateInfo: "Курс",
                createdAt: "Дата и время создания",
                stornoIds: "Транзакции сторно",
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
                currency: "Валюта",
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
            },
            list: {
                filter: {
                    transactionId: "ID транзакции",
                    account: "Счет"
                }
            }
        }
    },
    app: {
        menu: {
            payin: "Пополнение",
            payout: "Выплата"
        },
        ui: {
            pagination: {
                next: "Далее",
                previous: "Назад"
            }
        }
    },
    pages: {
        payIn: {
            source: "Счет источник",
            destination: "Счет получатель",
            createOrder: "Создать ордер",
            sourceValue: "Сумма пополнения",
            destValue: "Сумма зачисления",
            payMethods: "Методы оплаты",
            select: "Выбрать",
            last4Digits: "Последние 4 цифры карты",
            confirm: "Подтвердить",
            bank: "Банк",
            cardInfo: "Номер карты",
            cardHolder: "Владелец карты",
            done: "Проведено",
            loadingInfo: "Загрузка информации"
        },
        payOut: {
            payMethod: "Метод оплаты",
            source: "Счет источник",
            destination: "Счет получатель",
            sourceValue: "Сумма пополнения",
            destValue: "Сумма зачисления",
            sourceCurrency: "Валюта источника",
            destinationCurrency: "Валюта получателя",
            create: "Создать",
            cardHolder: "Владелец карты",
            cardInfo: "Номер карты",
            success: "Успешно"
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
                amount: {
                    id: "ID",
                    type: "Type",
                    currency: "Currency",
                    value: "Value"
                },
                meta: {
                    caption: "Caption"
                }
            },
            showHeader: "Account info",
            showDescription: "Detailed information about account with ID %{id}"
        },
        transactions: {
            name: "Transaction |||| Transactions",
            fields: {
                id: "ID",
                created_at: "Created at",
                committed: "Committed",
                dispute: "Dispute",
                meta: {
                    external_status: "External status",
                    parentId: "Parent transaction ID"
                },
                state: {
                    title: "State",
                    final: "Is final",
                    state_int: "Code",
                    state_description: "Status"
                },
                rateInfo: "Rate",
                createdAt: "Created at",
                stornoIds: "Storno transactions",
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
                currency: "Currency",
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
            },
            list: {
                filter: {
                    transactionId: "Transaction ID",
                    account: "Account"
                }
            }
        }
    },
    app: {
        menu: {
            payin: "Pay in",
            payout: "Pay out"
        },
        ui: {
            pagination: {
                next: "Next",
                previous: "Previous"
            }
        }
    },
    pages: {
        payIn: {
            source: "Source account",
            destination: "Destination account",
            createOrder: "Create order",
            sourceValue: "Source value",
            destValue: "Destination value",
            payMethods: "Pay methods",
            select: "Select",
            last4Digits: "Card last 4 digits",
            confirm: "Confirm",
            bank: "Bank",
            cardInfo: "Card info",
            cardHolder: "Card holder",
            done: "Done",
            loadingInfo: "Loading info"
        },
        payOut: {
            payMethod: "Pay method",
            source: "Source account",
            destination: "Destination account",
            sourceValue: "Source value",
            destValue: "Destination value",
            sourceCurrency: "Source currency",
            destinationCurrency: "Destination currency",
            create: "Create",
            cardHolder: "Card holder",
            cardInfo: "Card number",
            success: "Success"
        }
    }
};

const translations: any = { ru, en };

export const i18nProvider = polyglotI18nProvider((locale: string) => translations[locale], "en", [
    { locale: "ru", name: "Русский" },
    { locale: "en", name: "English" }
]);
