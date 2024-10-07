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
                    shop_currency: "Фиатная валюта",
                    type: "Тип",
                    currency: "Валюта",
                    value: "Сумма"
                },
                meta: {
                    caption: "Имя"
                }
            },
            showHeader: "Информация о счете",
            showDescription: "Подробная информация о счете с ID %{id}"
        },
        users: {
            name: "Пользователь |||| Пользователи",
            user: "Пользователь",
            edit: "Редактировать",
            deleteThisUser: "Удалить пользователя?",
            delete: "Удалить",
            fields: {
                id: "ID пользователя",
                name: "Имя пользователя",
                login: "Логин",
                email: "Электронная почта",
                currency: "Валюта",
                created_at: "Дата и время",
                active: "Активность",
                activeStateTrue: "Активен",
                activeStateFalse: "Не активен",
                public_key: "Публичный ключ",
                shop_api_key: "Ключ API",
                shop_sign_key: "Ключ подписи",
                shop_balance_key: "Ключ баланса"
            },
            createButton: "Добавить пользователя",
            filter: {
                showAll: "Показать все",
                filterByUserId: "Поиск по ID",
                filterByUsername: "Поиск по имени",
                filterByUsernamePlaceholder: "Все",
                filterByActivity: "Активные пользователи"
            },
            showHeader: "Информация о пользователе",
            showDescription: "Подробная информация о пользователе с ID %{id}",
            create: {
                success: "Готово",
                successMessage: "Пользователь создан",
                error: "Ошибка",
                errorMessage: "Не удалось создать пользователя"
            }
        },
        transactions: {
            name: "Транзакция |||| История операций",
            fields: {
                id: "ID операции",
                created_at: "Дата создания",
                committed: "Зафиксированная",
                dispute: "Диспут",
                meta: {
                    external_status: "Внешний статус",
                    parentId: "ID родительской транзакции",
                    customer_payment_id: "ID платежа клиента",
                    customer_id: "ID клиента"
                },
                state: {
                    title: "Состояние",
                    final: "Финальная",
                    state_int: "Код",
                    state_description: "Статус"
                },
                rateInfo: "Курс",
                createdAt: "Дата и время",
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
                cancel: "Отмена",
                success: "Успешно",
                error: "Ошибка",
                storno: "Сторно",
                commit: "Зафиксировать",
                openDispute: "Открыть диспут",
                closeDispute: "Закрыть диспут",
                disputeOpened: "Диспут открыт",
                disputeClosed: "Диспут закрыт",
                commitTransaction: "Зафиксировать операцию?"
            },
            list: {
                filter: {
                    transactionId: "ID транзакции",
                    account: "Счет"
                }
            },
            pagination: "Записей",
            chart: "График операций",
            showHeader: "Информация о транзакции",
            showDescription: "Подробная информация о транзакции с ID %{id}",
            storno: {
                destValueMessage: "Некорректное значение",
                sourceValueMessage: "Некорректное значение",
                selectSourceValue: "Выберите счет отправителя",
                selectDestinationValue: "Выберите счет отправителя",
                selectCurrency: "Выберите валюту"
            },
            download: {
                downloadReportLabel: "Выгрузка отчета",
                dateTitle: "Дата",
                downloadReportButtonText: "Скачать отчет",
                bothError: "Начальная дата и конечная дата обязательно должны быть заполнены",
                greaterError: "Конечная дата не может быть больше чем начальная дата",
                error: "Ошибка",
                dateExceed: "Начальная/конечная дата не может быть больше сегодняшней даты",
                accountField: "Выберите аккаунт мерчанта"
            },
            filter: {
                showAll: "Показать все",
                filterById: "Поиск по ID операции",
                filterByIdPlaceholder: "ID",
                filterByAccount: "Мерчант",
                filterAllPlaceholder: "Все",
                filterByOrderStatus: "Статус ордера",
                filterByDate: "Выберите период",
                clearFilters: "Сбросить фильтры",
                filterCustomerPaymentId: "Поиск по ID платежа клиента"
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
        },
        currencies: {
            fields: {
                currency: "Валюта",
                type: "Тип",
                symbPos: "Позиция символа",
                symbol: "Символ",
                fiat: "ФИАТ",
                crypto: "Криптовалюта",
                before: "Перед значением",
                after: "После значения",
                currencyName: "Название валюты"
            },
            error: {
                code: "Код валюты обязательно нужно ввести",
                alreadyInUse: "Данное имя уже тспользуется. Выберите другое."
            },
            create: "Добавить новую валюту",
            showTitle: "Детальная информацию о валюте",
            showDescription: "Детальная информацию о валюте"
        },
        merchants: {
            fields: {
                id: "ID",
                name: "Имя",
                descr: "Описание"
            },
            errors: {
                id: "ID обязательно должен быть заполнен",
                name: "У мерчанта обязательно должно быть имя",
                alreadyInUse: "Мерчант с таким именем или Id уже существует",
                noSpaces: "Пробелы запрещены в данном поле"
            },
            showTitle: "Детальная инфорация о мерчанте",
            createNew: "Создать нового мерчанта"
        },
        providers: {
            fields: {
                name: "Название провайдера",
                pk: "Публичный ключ",
                genKey: "Создать ключи",
                keyMiss: "Ключ отсутсвует",
                regenKey: "Пересоздать ключи",
                json_schema: "Схема Json",
                code: "Методы",
                enterMethods: "Введите свои методы"
            },
            errors: {
                name: "Имя должно содержать хотя бы один символ",
                alreadyInUse: "Данное имя уже используется․ Выберите другой."
            },
            showTitle: "Детальная информация о провайдере",
            createNew: "Создать нового провайдера",
            createTestKeys: "Создать тестовые ключи",
            attention: "Внимание",
            warning:
                "Приватный ключ будет показан только ОДИН раз. Скопируйте, сохраните и отправьте ключ DevOps инженеру",
            pleaseCreate: "Пожалуйста создайте ключи на странице с таблицей провайдеров",
            pleaseWait: "Пожалуйста подождите",
            clickToCopy: "Это ваш приватный ключ. Нажмите на кнопку чтобы скопировать ключ, или скопируйте вручную.",
            continue: "Продолжить",
            close: "Закрыть",
            privateKey: "Приватный ключ"
        },
        directions: {
            fields: {
                name: "Название направления",
                active: "Состояние",
                srcCurr: "Исходная валюта",
                destCurr: "Конечная валюта",
                merchant: "Мерчант",
                id: "Идентификатор направления",
                auth_data: "Информация об аутентификации",
                pleaseGen: "Пожалуйста, создайте ключи в провайдерах",
                stateActive: "Активный",
                stateInactive: "Не активный",
                description: "Описание",
                api_key: "Информация об аутентификации",
                merchantsDirections: "Направления мерчанта "
            },
            errors: {
                name: "У направления обязательно должно быть имя",
                src_curr: "Исходная валюта обязательно должна быть выбрана",
                dst_curr: "Конечная валюта обязательно должна быть выбрана",
                merchant: "Мерчант обязательно должен быть выбран",
                provider: "Провайдер обязательно должен быть выбран",
                authError: "Ошибка при добавлении информации об аутентификации"
            },
            create: "Создать новое направление",
            sourceCurrency: "Исходящая валюта",
            destinationCurrency: "Конечная валюта",
            selectSourceCurrency: "Выбрать исходящую валюту",
            selectDestCurrency: "Выбрать конечную валюту",
            merchant: "Мерчант",
            provider: "Провайдер",
            weight: "Вес",
            description: "Описание",
            writeSecretPhrase: "Напишите информацию об аутентификации и нажмите сохранить",
            secretHelper: "Ожидается валидный JSON объект",
            note: "Внимание: Вы не можете использовать для направления провайдера, для которого нет ключа",
            addedSuccess: "Аутентификационная информация была добавлена",
            pleaseCreate: "Пожалуйста добавьте аутентификационную информацию на странице с таблицей",
            noProviders: "Нет доступных провайдеров",
            noMerchants: "Нет доступных мерчантов",
            noCurrencies: "Нет доступных валют"
        }
    },
    app: {
        menu: {
            accounts: "Счета",
            transactions: "История операций",
            payin: "Пополнение",
            dashboard: "Главная",
            bankTransfer: "Банковский перевод",
            cryptoTransfer: "Перевод криптовалюты",
            withdraw: "Вывод в криптовалюте",
            users: "Пользователи",
            currency: "Валюты",
            currencies: "Валюты",
            merchant: "Мерчанты",
            provider: "Провайдеры",
            providers: "Провайдеры",
            direction: "Направления",
            directions: "Направления"
        },
        ui: {
            actions: {
                quick_show: "Быстрый просмотр",
                show: "Просмотр",
                edit: "Изменить",
                delete: "Удалить",
                save: "Сохранить",
                addSecretKey: "Добавить аутентификационную инфорамцию",
                changeSecretKey: "Изменить аутентификационную инфорамцию",
                cancel: "Отменить",
                areYouSure: "Вы точно хотите удалить элемент?",
                chatWithSupport: "Чат с поддержкой"
            },
            pagination: {
                next: "Далее",
                previous: "Назад"
            },
            textField: {
                copied: "Скопировано"
            },
            delete: {
                deletedSuccessfully: "Элемент удален успешно"
            },
            chatMessagePlaceholder: "Сообщение...",
            transactionHistory: "История операции"
        },
        theme: {
            light: "Светлая тема",
            dark: "Темная тема"
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
                },
                userCreate: {
                    title: "Добавление пользователя",
                    name: "Имя",
                    nameMessage: "Пожалуйста, введите имя мерчанта",
                    login: "Логин",
                    loginMessage: "Пожалуйста, введите логин мерчанта",
                    email: "Адрес эл.почты",
                    emailMessage: "Неправильный формат адреса",
                    password: "Пароль",
                    passwordMessage:
                        "Пароль должен состоять минимум из 8 символов, включая хотя бы одну строчную и прописную букву, а также специальный символ !@#$%^&*()-_",
                    publicKey: "Публичный ключ(скопируйте или перенесите файл ключа)",
                    publicKeyPlaceholder: "Перетащите файл сюда или введите текст",
                    publicKeyMessage: "Неверный формат публичного ключа",
                    shopCurrency: "Валюта",
                    shopCurrencyPlaceholder: "Выберите валюту",
                    shopCurrencyMessage: "Неизвестная валюта",
                    shopApiKey: "API ключ",
                    shopSignKey: "Ключ проверки подписи",
                    shopBalanceKey: "Ключ доступа к балансу",
                    keyMessage: "Неверный формат ключа",
                    createUser: "Создать пользователя",
                    cancelBtn: "Отменить"
                }
            }
        },
        login: {
            usernameOrEmail: "Логин или e-mail",
            password: "Пароль",
            login: "Войти",
            error: "Неправильный логин или пароль"
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
    },
    datePicker: {
        month: {
            0: "Январь",
            1: "Февраль",
            2: "Март",
            3: "Апрель",
            4: "Май",
            5: "Июнь",
            6: "Июль",
            7: "Август",
            8: "Сентябрь",
            9: "Октябрь",
            10: "Ноябрь",
            11: "Декабрь"
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
                    shop_currency: "Shop currency",
                    type: "Type",
                    currency: "Currency",
                    value: "Value"
                },
                meta: {
                    caption: "Name"
                }
            },
            showHeader: "Account info",
            showDescription: "Detailed information about account with ID %{id}"
        },
        users: {
            name: "User |||| Users",
            user: "User",
            edit: "Edit",
            delete: "Delete",
            deleteThisUser: "Delete user?",
            fields: {
                id: "User ID",
                name: "Username",
                login: "Login",
                email: "Email",
                currency: "Currency",
                created_at: "Date and time",
                active: "Activity",
                activeStateTrue: "Active",
                activeStateFalse: "Not active",
                public_key: "Public key",
                shop_api_key: "API key",
                shop_sign_key: "Sign key",
                shop_balance_key: "Balance key"
            },
            filter: {
                showAll: "Show all",
                filterByUserId: "Search by ID",
                filterByUsername: "Search by name",
                filterByUsernamePlaceholder: "All",
                filterByActivity: "Active users"
            },
            createButton: "Add user",
            showHeader: "User info",
            showDescription: "Detailed information about user with ID %{id}",
            create: {
                success: "Success",
                successMessage: "User is created",
                error: "Error",
                errorMessage: "Failed to create user"
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
                    parentId: "Parent transaction ID",
                    customer_payment_id: "Customer payment ID",
                    customer_id: "Customer ID"
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
                cancel: "Cancel",
                success: "Success",
                error: "Error",
                storno: "Storno",
                commit: "Commit",
                openDispute: "Open dispute",
                closeDispute: "Close dispute",
                disputeOpened: "Disput opened",
                disputeClosed: "Disput closed",
                commitTransaction: "Commit the transaction?"
            },
            list: {
                filter: {
                    transactionId: "Transaction ID",
                    account: "Account"
                }
            },
            pagination: "Rows per page",
            chart: "Schedule of operations",
            showHeader: "Transaction info",
            showDescription: "Detailed information about transaction with ID %{id}",
            storno: {
                destValueMessage: "Wrong value",
                sourceValueMessage: "Wrong value",
                selectSourceValue: "Select sender account",
                selectDestinationValue: "Select receiver account",
                selectCurrency: "Select currency"
            },
            download: {
                downloadReportLabel: "Report download",
                dateTitle: "Date",
                downloadReportButtonText: "Download report",
                bothError: "Both start date and end date must be selected",
                greaterError: "End date must be greater than start date",
                error: "Error",
                dateExceed: "Start/end date cannot be greater than today's date",
                accountField: "Choose merchant account"
            },
            filter: {
                showAll: "Show all",
                filterById: "Search by operation ID",
                filterByIdPlaceholder: "ID",
                filterByAccount: "Merchant",
                filterAllPlaceholder: "All",
                filterByOrderStatus: "Order status",
                filterByDate: "Select period",
                clearFilters: "Clear filters",
                filterCustomerPaymentId: "Search by customer payment ID"
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
        },
        currencies: {
            fields: {
                currency: "Currency",
                type: "Type",
                symbPos: "Symbol Position",
                symbol: "Symbol",
                fiat: "FIAT",
                crypto: "Cryptocurrency",
                before: "Before value",
                after: "After value",
                currencyName: "Currency name"
            },
            errors: {
                code: "Code is required",
                alreadyInUse: "This name is already in use. Choose another one."
            },
            create: "Add new currency",
            showTitle: "Detailed information about currency",
            showDescription: "Detailed information about currency"
        },
        merchants: {
            fields: {
                id: "ID",
                name: "Name",
                descr: "Description"
            },
            errors: {
                id: "ID is required",
                name: "Name is required",
                alreadyInUse: "Merchant with this id or name is already exists.",
                noSpaces: "Spaces are not allowed in this field"
            },
            showTitle: "Detailed information about merchant",
            createNew: "Create new merchant"
        },
        providers: {
            fields: {
                name: "Providers' name",
                pk: "Public key",
                genKey: "Generate keys",
                keyMiss: "The key is missing",
                regenKey: "Regenerate keys",
                json_schema: "Json schema",
                code: "Methods",
                enterMethods: "Enter your methods"
            },
            errors: {
                name: "Name must contain at least 1 symbol",
                alreadyInUse: "This name is already in use. Choose another one."
            },
            showTitle: "Detailed information about provider",
            createNew: "Create new provider",
            createTestKeys: "Create test keys",
            attention: "Attention",
            warning: "Private key will be shown ONLY 1 time. Copy, save it and send to DevOps engineer",
            pleaseCreate: "Please create keys on the page with providers table",
            pleaseWait: "Please wait",
            clickToCopy: "This is your private key.\n Click button to copy or copy manually.",
            continue: "Continue",
            close: "Close",
            privateKey: "Private key"
        },
        directions: {
            fields: {
                name: "Directions name",
                active: "State",
                srcCurr: "Source currency",
                destCurr: "Destination currency",
                merchant: "Merchant",
                id: "Directions id",
                auth_data: "Authentication data",
                pleaseGen: "Please create keys in providers",
                stateActive: "Active",
                stateInactive: "Inactive",
                description: "Description",
                api_key: "Auth data",
                merchantsDirections: "Directions of merchant "
            },
            errors: {
                name: "The direction must have a name",
                src_curr: "The source currency must be selected",
                dst_curr: "The destination currency must be selected",
                merchant: "The merchant must be selected",
                provider: "The provider must be selected",
                authError: "An error has occurred while adding authentication information"
            },
            create: "Create new direction",
            sourceCurrency: "Source currency",
            destinationCurrency: "Destination currency",
            selectSourceCurrency: "Choose source currency",
            selectDestCurrency: "Choose destination currency",
            merchant: "Merchant",
            weight: "Weight",
            provider: "Provider",
            description: "Description",
            writeSecretPhrase: "Write auth data for direction and click save.",
            secretHelper: "Expected valid JSON object",
            enterSecretPhrase: "Enter secret phrase",
            note: "Note: You cannot use a provider for direction that does not have a key",
            addedSuccess: "Auth data has been added successfully",
            pleaseCreate: "Please add auth data on the page with table",
            noProviders: "No available providers",
            noMerchants: "No available merchants",
            noCurrencies: "No available currencies"
        }
    },
    app: {
        menu: {
            accounts: "Accounts",
            transactions: "Transactions",
            payin: "Pay in",
            dashboard: "Dashboard",
            bankTransfer: "Bank Transfer",
            cryptoTransfer: "Crypto Wallet Transfer",
            withdraw: "Crypto Withdrawal",
            users: "Users",
            currency: "Currencies",
            currencies: "Currencies",
            merchant: "Merchants",
            provider: "Providers",
            providers: "Providers",
            direction: "Directions",
            directions: "Directions"
        },
        ui: {
            actions: {
                quick_show: "Quick show",
                show: "Show",
                edit: "Edit",
                delete: "Delete",
                save: "Save",
                addSecretKey: "Add auth data",
                changeSecretKey: "Change auth data",
                cancel: "Cancel",
                areYouSure: "Are you sure you want delete this element?",
                chatWithSupport: "Chat with support"
            },
            pagination: {
                next: "Next",
                previous: "Previous"
            },
            textField: {
                copied: "Copied"
            },
            delete: {
                deletedSuccessfully: "Deleted successfully"
            },
            chatMessagePlaceholder: "Message...",
            transactionHistory: "Transaction history"
        },
        theme: {
            light: "Light theme",
            dark: "Dark theme"
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
                },
                userCreate: {
                    title: "Adding a user",
                    name: "Name",
                    nameMessage: "Please, enter merchant's name",
                    login: "Login",
                    loginMessage: "Please, enter merchant's login",
                    email: "Email",
                    emailMessage: "Email is incorrect",
                    password: "Password",
                    passwordMessage:
                        "Password must be at least 8 symbols, including at least one lowercase and uppercase letter, also one special symbol !@#$%^&*()-_",
                    publicKey: "Public key(copy or drag&drop)",
                    publicKeyPlaceholder: "Drop file here or type text",
                    publicKeyMessage: "Wrong public key format",
                    shopCurrency: "Currency",
                    shopCurrencyPlaceholder: "Choose currency",
                    shopCurrencyMessage: "Unknown currency",
                    shopApiKey: "API key",
                    shopSignKey: "Sign key",
                    shopBalanceKey: "Balance key",
                    keyMessage: "Key format is wrong",
                    createUser: "Create user",
                    cancelBtn: "Cancel"
                }
            }
        },
        login: {
            usernameOrEmail: "Username or e-mail",
            password: "Password",
            login: "Login",
            error: "Invalid username or password"
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
    },
    datePicker: {
        month: {
            0: "January",
            1: "February",
            2: "March",
            3: "April",
            4: "May",
            5: "June",
            6: "July",
            7: "August",
            8: "September",
            9: "October",
            10: "November",
            11: "December"
        }
    }
};

const translations = { ru, en };

export const i18nProvider = polyglotI18nProvider((locale: string) => translations[locale as "ru" | "en"], "en", [
    { locale: "ru", name: "Русский" },
    { locale: "en", name: "English" }
]);
