import polyglotI18nProvider from "ra-i18n-polyglot";
import raRU from "ra-language-russian";
import raEn from "ra-language-english";
import { TranslationMessages } from "ra-core";

const ru: TranslationMessages = {
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
                    caption: "Пользователь"
                }
            },
            showHeader: "Информация о счете",
            showDescription: "Подробная информация о счете с ID %{id}"
        },
        users: {
            name: "Пользователь |||| Пользователи",
            fields: {
                id: "ID",
                name: "Имя",
                created_at: "Дата создания",
                active: "Активный"
            }
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
                fees: "Комиссии",
                sourceValue: "Сумма отправления",
                destValue: "Сумма зачисления"
            },
            show: {
                statusButton: "Ручной перевод в статус",
                save: "Сохранить",
                cancel: "Отмена",
                success: "Успешно",
                error: "Ошибка",
                storno: "Сторно",
                commit: "Зафиксировать",
                openDispute: "Открыть диспут",
                closeDispute: "Закрыть диспут",
                disputeOpened: "Диспут открыт",
                disputeClosed: "Диспут закрыт"
            },
            list: {
                filter: {
                    transactionId: "ID транзакции",
                    account: "Счет"
                }
            },
            showHeader: "Информация о транзакции",
            showDescription: "Подробная информация о транзакции с ID %{id}",
            storno: {
                destValueMessage: "Некорректное значение",
                sourceValueMessage: "Некорректное значение",
                selectSourceValue: "Выберите счет отправителя",
                selectDestinationValue: "Выберите счет отправителя",
                selectCurrency: "Выберите валюту"
            }
        },
        withdraw: {
            name: "Вывод в криптовалюте |||| Выводы в криптовалюте",
            fields: {
                id: "ID",
                created_at: "Дата и время создания",
                destination: {
                    id: "Адрес TRC20",
                    amount: {
                        currency: "Валюта",
                        value: "Сумма"
                    }
                },
                payload: {
                    hash: "Хеш",
                    hash_link: "Ссылка Tronscan"
                }
            }
        }
    },
    app: {
        menu: {
            accounts: "Счета",
            transactions: "Транзакции",
            payin: "Пополнение",
            dashboard: "Главная",
            bankTransfer: "Банковский перевод",
            cryptoWalletTransfer: "Перевод криптовалюты",
            withdraw: "Вывод в криптовалюте",
            users: "Пользователи"
        },
        ui: {
            pagination: {
                next: "Далее",
                previous: "Назад"
            },
            textField: {
                copied: "Скопировано"
            }
        },
        theme: {
            light: "Включить темную тему",
            dark: "Включить светлую тему"
        },
        widgets: {
            forms: {
                payin: {
                    source: "Счет источник",
                    selectSource: "Выберите счет источник",
                    destination: "Счет получатель",
                    selectDestination: "Выберите счет получатель",
                    sourceCurrency: "Валюта источника",
                    selectSourceCurrency: "Выберите валюту источника",
                    destinationCurrency: "Валюта получателя",
                    selectDestinationCurrency: "Выберите валюту получаетля",
                    sourceMessage: "Пожалуйста, выберите счет источник",
                    destinationMessage: "Пожалуйста, выберите счет получатель",
                    sourceCurrencyMessage: "Пожалуйста, выберите вылюту источника",
                    destinationCurrencyMessage: "Пожалуйста, выберите вылюту получателя",
                    sourceValueMessage: "Некорректное значение",
                    destValueMessage: "Некорректное значение",
                    sourceValue: "Сумма пополнения",
                    destValue: "Сумма зачисления",
                    createOrder: "Создать ордер"
                },
                payout: {
                    payMethod: "Метод оплаты",
                    selectPayMethod: "Выберите метод оплаты",
                    payMethodMessage: "Пожалуйста, выберите метод оплаты",
                    valueMessage: "Некорректное значение",
                    value: "Сумма зачисления %{currency}",
                    create: "Создать",
                    success: "Вывод успешно создан"
                },
                cryptoTransfer: {
                    address: "Адрес TRC20",
                    addressMessage: "Неверный адрес",
                    amount: "Сумма",
                    amountMessage: "Некорректное значение",
                    amountMinMessage: "Сумма должна быть минимум 2 USD₮",
                    amountMaxMessage: "Сумма должна быть максимум %{amount} USD₮",
                    commission: "Комиссия",
                    totalAmount: "Сумма выплаты",
                    allAmount: "Вся сумма %{amount} USD₮"
                }
            }
        }
    },
    pages: {
        payin: {
            header: "Пополнение"
        },
        bankTransfer: {
            header: "Банковский перевод"
        },
        cryptoTransfer: {
            header: "Перевод криптовалюты"
        }
    }
};

const en: TranslationMessages = {
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
                    caption: "User"
                }
            },
            showHeader: "Account info",
            showDescription: "Detailed information about account with ID %{id}"
        },
        users: {
            name: "User |||| Users",
            fields: {
                id: "ID",
                name: "Name",
                created_at: "Created at",
                active: "Active"
            }
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
                fees: "Fees",
                sourceValue: "Source value",
                destValue: "Destination value"
            },
            show: {
                statusButton: "Manual change status",
                save: "Save",
                cancel: "Cancel",
                success: "Success",
                error: "Error",
                storno: "Storno",
                commit: "Commit",
                openDispute: "Open dispute",
                closeDispute: "Close dispute",
                disputeOpened: "Disput opened",
                disputeClosed: "Disput closed"
            },
            list: {
                filter: {
                    transactionId: "Transaction ID",
                    account: "Account"
                }
            },
            showHeader: "Transaction info",
            showDescription: "Detailed information about transaction with ID %{id}",
            storno: {
                destValueMessage: "Wrong value",
                sourceValueMessage: "Wrong value",
                selectSourceValue: "Select sender account",
                selectDestinationValue: "Select receiver account",
                selectCurrency: "Select currency"
            }
        },
        withdraw: {
            name: "Crypto Withdrawal |||| Crypto Withdrawals",
            fields: {
                id: "ID",
                created_at: "Created at",
                destination: {
                    id: "TRC20 address",
                    amount: {
                        currency: "Currency",
                        value: "Value"
                    }
                },
                payload: {
                    hash: "Hash",
                    hash_link: "Tronscan link"
                }
            }
        }
    },
    app: {
        menu: {
            accounts: "Accounts",
            transactions: "Transactions",
            payin: "Pay in",
            dashboard: "Dashboard",
            bankTransfer: "Bank Transfer",
            cryptoWalletTransfer: "Crypto Wallet Transfer",
            withdraw: "Crypto Withdrawal",
            users: "Users"
        },
        ui: {
            pagination: {
                next: "Next",
                previous: "Previous"
            },
            textField: {
                copied: "Copied"
            }
        },
        theme: {
            light: "Toggle dark theme",
            dark: "Toggle light theme"
        },
        widgets: {
            forms: {
                payin: {
                    source: "Source account",
                    selectSource: "Select source account",
                    destination: "Destination account",
                    selectDestination: "Select destination account",
                    sourceCurrency: "Source currency",
                    selectSourceCurrency: "Select source currency",
                    destinationCurrency: "Destination currency",
                    selectDestinationCurrency: "Select destination currency",
                    sourceMessage: "Please, select source account",
                    destinationMessage: "Please, select destination account",
                    sourceCurrencyMessage: "Please, select source currency",
                    destinationCurrencyMessage: "Please, select destination currency",
                    sourceValueMessage: "Wrong value",
                    destValueMessage: "Wrong value",
                    sourceValue: "Source value",
                    destValue: "Destination value",
                    createOrder: "Create order"
                },
                payout: {
                    payMethod: "Pay method",
                    selectPayMethod: "Select pay method",
                    payMethodMessage: "Please, select pay method",
                    value: "Destination value %{currency}",
                    valueMessage: "Wrong value",
                    create: "Created",
                    success: "Payout successfully created"
                },
                cryptoTransfer: {
                    address: "TRC20 address",
                    addressMessage: "Wrong address",
                    amount: "Amount",
                    amountMessage: "Wrong value",
                    amountMinMessage: "Amount should be at least 2 USD₮",
                    amountMaxMessage: "Amount should be less than %{amount} USD₮",
                    commission: "Commission",
                    totalAmount: "Total amount",
                    allAmount: "All amount %{amount} USD₮"
                }
            }
        }
    },
    pages: {
        payin: {
            header: "Pay In"
        },
        bankTransfer: {
            header: "Bank Transfer"
        },
        cryptoTransfer: {
            header: "Crypto Wallet Transfer"
        }
    }
};

const translations = { ru, en };

export const i18nProvider = polyglotI18nProvider((locale: string) => translations[locale as "ru" | "en"], "en", [
    { locale: "ru", name: "Русский" },
    { locale: "en", name: "English" }
]);
