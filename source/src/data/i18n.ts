import polyglotI18nProvider from "ra-i18n-polyglot";
import raRU from "ra-language-russian";
import raEn from "ra-language-english";
import { TranslationMessages } from "ra-core";

const ru: TranslationMessages = {
    ...raRU,
    resources: {
        accounts: {
            admin: {
                name: "Счета"
            },
            merchant: {
                name: "Мои счета"
            },
            editDialogTitle: "Редактирование счета",
            editFields: {
                name: "Наименование",
                wallet_create: "Создать кошелек",
                wallet_type: "Тип кошелька",
                tron_wallet: "Внутренний кошелёк провайдера",
                tron_address: "Внешний кошелёк провайдера",
                provider_account: "Счёт провайдера",
                reward_account: "Буферный счёт",
                stateActive: "Да",
                stateInactive: "Нет"
            },
            fields: {
                owner: "Владелец",
                state: "Статус",
                states: {
                    active: "Активный",
                    frozen: "Приостановлен",
                    blocked: "Заблокирован",
                    deleted: "Удален"
                },
                tron_wallet: "Внутренний кошелёк провайдера",
                trc20: "Адрес для пополнения баланса мерчанта в агрегаторе",
                type: "Тип счёта",
                balance: "Баланс счёта",
                history: "История по счёту",
                edit: "Редактировать",
                id: "ID",
                owner_id: "ID владельца",
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
            name: "Пользователи",
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
                filterByUsernamePlaceholder: "Имя",
                filterByActivity: "Активные пользователи"
            },
            showHeader: "Информация о пользователе",
            showDescription: "Подробная информация о пользователе с ID %{id}",
            editUser: "Редактирование пользователя",
            create: {
                success: "Готово",
                successMessage: "Пользователь создан",
                error: "Ошибка",
                errorMessage: "Не удалось создать пользователя",
                deleteError: "Не удалось создать пользователя"
            }
        },
        transactions: {
            name: "Операции",
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
                    state_description: "Статус",
                    state_changed: "Статус измене на:"
                },
                rateInfo: "Курс",
                createdAt: "Дата и время",
                stornoIds: "Транзакции сторно",
                source: {
                    header: "Отправитель",
                    id: "ID",
                    amount: {
                        currency: "Валюта",
                        value: "Сумма",
                        getAmount: "Сумма зачисления"
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
                        value: "Сумма",
                        sendAmount: "Сумма отправления"
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
            undefined: "Нет данных",
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
            },
            types: {
                all: "Все операции",
                deposit: "Пополнение",
                withdraw: "Вывод средств",
                transfer: "Перевод средств",
                reward: "Выплата вознаграждения",
                feefromsender: "Комиссия от отправителя",
                feefromtransaction: "Комиссия с транзакции"
            },
            states: {
                all: "Показать все",
                created: "Создано",
                paid: "Оплачено",
                fromoutside: "Извне",
                waitpayout: "Ожидание выплаты",
                paidout: "Выплачено",
                toreturnfrominside: "К возврату изнутри",
                toreturnfromoutside: "К возврату извне",
                reversed: "Отменено",
                changedfromcreated: "Изменено с состояния 'Создано'",
                changedfrompaid: "Изменено с состояния 'Оплачено'",
                returned: "Возвращено",
                todeny: "Отклонено системой провайдера",
                processing: "Обработка",
                expired: "Истекло",
                deleted: "Удалено",
                success: "Успех",
                fail: "Неудача",
                correction: "Коррекция",
                emptyrequisites: "Реквизиты отсутвуют",
                limitfail: "Вне допустимого лимита ордера",
                waitingforadminapproval: "Ожидание подтверждения",
                cancelledbypayer: "Отменено плательщиком"
            }
        },
        withdraw: {
            name: "Вывод криптовалюты",
            tableTitle: "Отчет по выводам в криптовалюте",
            cryptoTransferTitle: "Перевод криптовалюты",
            resendQuestion: "Повторить перевод?",
            errors: {
                lowAmountError: "Сумма перевода должна быть больше 2 USDT",
                serverError: "Произошла неизвестная ошибка на сервере"
            },
            fields: {
                id: "ID операции",

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
                },
                merchant: "Мерчант",
                state: "Состояние",
                idInBlockChain: "ID в блокчейне",
                resend: "Повторить"
            },
            download: {
                downloadReportButtonText: "Скачать отчет",
                bothError: "Начальная дата и конечная дата обязательно должны быть заполнены",
                error: "Ошибка"
            },
            filter: {
                filterById: "Поиск по ID",
                filterByIdPlaceholder: "ID",
                filterByDate: "Дата",
                filterByDatePlaceholder: "Выберите дату",
                clearFilters: "Сбросить фильтры"
            }
        },
        currency: {
            name: "Валюты",
            fields: {
                currency: "Валюта",
                type: "Тип",
                symbPos: "Позиция символа",
                symbol: "Символ",
                fiat: "ФИАТ",
                crypto: "Криптовалюта",
                before: "Перед значением",
                after: "После значения",
                currencyName: "Название валюты",
                example: "Пример",
                edit: "Изменить",
                delete: "Удалить"
            },
            error: {
                code: "Код валюты обязательно нужно ввести",
                alreadyInUse: "Данное имя уже тспользуется. Выберите другое."
            },
            create: "Добавить валюту",
            createDialogTitle: "Добавление валюты",
            editDialogTitle: "Редактирование валюты",
            deleteDialogTitle: "Удалить валюту?",
            showTitle: "Детальная информацию о валюте",
            showDescription: "Детальная информацию о валюте"
        },
        merchant: {
            name: "Мерчанты",
            merchant: "Мерчант",
            fields: {
                id: "ID",
                name: "Имя",
                descr: "Описание",
                fees: "Комиссии",
                directions: "Направления"
            },
            errors: {
                id: "ID обязательно должен быть заполнен",
                name: "У мерчанта обязательно должно быть имя",
                alreadyInUse: "Мерчант с таким именем или Id уже существует",
                noSpaces: "Пробелы запрещены в данном поле"
            },
            showTitle: "Детальная инфорация о мерчанте",
            createNew: "Создать нового мерчанта",
            creatingMerchant: "Создание нового мерчанта",
            editingMerchant: "Редактирование мерчанта",
            delete: "Удалить мерчанта?"
        },
        provider: {
            name: "Провайдеры",
            fields: {
                _name: "Название",
                name: "Провайдер",
                pk: "Публичный ключ",
                genKey: "Создать ключи",
                keyMiss: "Ключ отсутсвует",
                regenKey: "Пересоздать ключи",
                json_schema: "Схема Json",
                code: "Методы",
                enterMethods: "Введите свои методы",
                methods: "Методы"
            },
            errors: {
                name: "Имя должно содержать хотя бы один символ",
                alreadyInUse: "Данное имя уже используется․ Выберите другой."
            },
            showTitle: "Детальная информация о провайдере",
            createNew: "Создать нового провайдера",
            createTestKeys: "Создать тестовые ключи",
            attention: "Внимание",
            warning: "Внимание! Приватный ключ будет показан только один раз.",
            sendToDevOps: "Скопируйте его и отправьте DevOps инженеру",
            pleaseCreate: "Пожалуйста создайте ключи на странице с таблицей провайдеров",
            pleaseWait: "Пожалуйста подождите",
            clickToCopy: "Это ваш приватный ключ. Нажмите на кнопку чтобы скопировать ключ, или скопируйте вручную.",
            continue: "Продолжить",
            close: "Закрыть",
            privateKey: "Приватный ключ",
            deleteProviderQuestion: "Удалить провайдера?",
            keysCreating: "Создание тестовых ключей",
            realKeysCreating: "Создание ключей",
            editingProvider: "Редактирование провайдера",
            creatingProvider: "Создание провайдера"
        },
        direction: {
            direction: "Направление",
            name: "Направления",
            fields: {
                name: "Название направления",
                active: "Состояние",
                srcCurr: "Исходная валюта",
                destCurr: "Конечная валюта",
                merchant: "Мерчант",
                accountNumber: "Номер счета",
                id: "Идентификатор направления",
                auth_data: "Информация об аутентификации",
                pleaseGen: "Пожалуйста, создайте ключи в провайдерах",
                stateActive: "Активно",
                stateInactive: "Не активно",
                description: "Описание",
                api_key: "Информация об аутентификации",
                merchantsDirections: "Направления мерчанта ",
                isActive: "Активность",
                terminal: "Терминал"
            },
            fees: {
                fees: "Комиссии",
                accountNumber: "ID счета",
                feeAmount: "Размер комиссии",
                feeType: "Тип комиссии",
                currency: "Валюта",
                descr: "Описание",
                addFee: "Добавить комиссию",
                direction: "Направление",
                deleteFee: "Удалить комиссию?",
                error: "Ошибка",
                errorWhenCreating: "Произошла ошибка при создании комиссии"
            },
            errors: {
                name: "У направления обязательно должно быть имя",
                src_curr: "Исходная валюта обязательно должна быть выбрана",
                dst_curr: "Конечная валюта обязательно должна быть выбрана",
                merchant: "Мерчант обязательно должен быть выбран",
                provider: "Провайдер обязательно должен быть выбран",
                authError: "Ошибка при добавлении информации об аутентификации",
                terminal: "Терминал обязательно должен быть выбран",
                terminalError: "Произошла ошибка при загрузке терминалов",
                noTerminalsError: "У выбранного провайдера нет терминалов"
            },
            create: "Добавить направление",
            sourceCurrency: "Валюта отправителя",
            destinationCurrency: "Валюта получателя",
            selectSourceCurrency: "Выбрать исходящую валюту",
            selectDestCurrency: "Выбрать конечную валюту",
            merchant: "Мерчант",
            provider: "Провайдер",
            weight: "Вес",
            description: "Описание",
            authInfo: "Информация об аутинтификации",
            changeAuthDataHeader: "Изменение аутентификационной информации",
            writeSecretPhrase: "Напишите информацию об аутентификации и нажмите сохранить",
            secretHelper: "Ожидается валидный JSON объект",
            note: "Внимание: Вы не можете использовать для направления провайдера, для которого нет ключа",
            addedSuccess: "Аутентификационная информация была добавлена",
            pleaseCreate: "Пожалуйста добавьте аутентификационную информацию на странице с таблицей",
            noProviders: "Нет доступных провайдеров",
            noMerchants: "Нет доступных мерчантов",
            noCurrencies: "Нет доступных валют",
            noTerminals: "Выберите провайдера перед выбором терминала",
            deleteDirection: "Удалить направление?",
            editingDirection: "Редактирование направления",
            creatingDirection: "Добавление направления"
        },
        terminals: {
            name: "Терминал",
            fields: {
                verbose_name: "Наименование",
                id: "ID",
                description: "Описание",
                provider: "Провайдер",
                auth: "Ключ аутентификации"
            },
            errors: {
                verbose_name: "У терминала обязательно должно быть имя",
                description: "У терминала обязательно должно быть описание"
            },
            create: "Создать терминал",
            selectHeader: "Провайдер",
            selectPlaceholder: "Выберите провайдера",
            creatingTerminal: "Создание терминала",
            deleteHeader: "Удалить терминал?",
            editingTerminal: "Редактирование терминала"
        },
        bankTransfer: {
            name: "Банковский перевод"
        },
        wallet: {
            name: "Управление криптокошельками",
            storage: {
                name: "Хранилище",
                initiatedTitle: "Хранилище не инициализировано",
                buttonForInitiated: "Инициализировать",
                initiatedError: "Ошибка инициализации",
                titleClosed: "Распечатка хранилища",
                buttonForOpen: "Распечатать",
                buttonForClosed: "Запечатать",
                buttonForCancel: "Отменить распечатку",
                buttonForEnterKey: "Ввести часть ключа",
                buttonForSend: "Отправить",
                titleOpened: "Хранилище открыто",
                key: "Ключ",
                unsealed: {
                    errorTitle: "Ошибка распечатывания хранилища",
                    errorSubtitle: "Попробуйте снова",
                    allKeys: "Всего частей ключа",
                    requiredKeys: "Необходимо для открытия",
                    enteredKeys: "Введено частей ключа",
                    toFinishKeys: "До распечатывания осталось"
                }
            },
            manage: {
                name: "Кошельки",
                wallet: "Кошелек",
                fields: {
                    walletType: "Тип кошелька",
                    walletAddress: "Адрес кошелька",
                    accountNumber: "Номер счёта",
                    merchantName: "Мерчант",
                    merchantId: "ID мерчанта",
                    currency: "Валюта",
                    descr: "Описание",
                    internalId: "Внутренний ID кошелька",
                    blockchain: "Блокчейн",
                    contactType: "Тип контакта в блокчейне",
                    minRemaini: "Минимальная остаточная сумма",
                    more: "Подробнее",
                    balance: "Баланс"
                },
                error: "Ошибка",
                errors: {
                    serverError: "Ошибка на стороне сервера. Попробуйте позже",
                    selectAccount: "Выберите аккаунт",
                    errorWhenEditing: "Произошлка ошибка при редактировании кошелька",
                    errorWhenCreating: "Произошлка ошибка при создании кошелька",
                    alreadyExists: "Кошелек с таким адресом уже существует",
                    addressRequired: "Введите адрес кошелька",
                    invalidTRCAddresss: "Неправильный формат TRC20 адреса",
                    minBalance: "Минимальное значение 0",
                    intOnly: "Значение должно быть целым числом, без дробной части"
                },

                creatingWallet: "Добавление кошелька",
                editingWallet: "Редактирование кошелька",
                deleteWallet: "Удалить кошелек?",
                createWallet: "Создать кошелек"
            },
            transactions: {
                name: "Криптотранзакции",
                cryptotransaction: "Криптотранзакция",
                allTransactions: "Все операции",
                deletedTransactions: "Удаленные операции",
                successMessage: "Запрос подтверждения транзакции отправлен, ожидайте изменения статуса",
                fields: {
                    created_at: "Создана",
                    updated_at: "Обновлена",
                    deleted_at: "Удалена",
                    src_wallet: "Кошелёк списания",
                    id: "ID операции",
                    dst_wallet: "Кошелёк зачисления",
                    amount: "Сумма операции",
                    type: "Тип операции",
                    state: "Статус платежа",
                    merchant_id: "ID мерчанта",
                    tx_id: "ID в блокчейне",
                    currency: "Валюта",
                    blowfish_id: "ID в Blowfish",
                    // TODO
                    tx_link: "",
                    total_fee: "Общая комиссия",
                    bandwidth_fee: "Комиссия сети",
                    confirm: "Потвердить",
                    confirmQuestion: "Потвердить операцию?",
                    pre_calculated_fee: "Предварительно рассчитанная комиссия"
                },
                error: "Ошибка",
                errors: {
                    failedToConfirm: "Не удалось потвердить транзакцию"
                },
                filterBar: {
                    searchById: "Поиск по ID операции",
                    created_at: "Дата создания",
                    updated_at: "Дата обновления",
                    datePlaceholder: "Выберите дату",
                    paymentStatus: "Статус платежа",
                    resetFilters: "Сбросить фильтры"
                }
            },
            linkedTransactions: {
                name: "Поступления на linked-кошелёк",
                show: "Поступление на linked-кошелек",
                manual_reconciliation: "Ручная сверка",
                check: "Проверить",
                notFound: "Транзакция не найдена",
                successFound: "Транзакция успешно добавлена",
                fields: {
                    scannedAt: "Время сканирования",
                    blockTimestamp: "Время генерации",
                    transactionId: "ID транзакции",
                    sourceAddress: "Адрес кошелька отправителя",
                    destinationAddress: "Адрес кошелька получателя",
                    type: "Тип операции",
                    amount: "Сумма прихода",
                    currency: "Валюта",
                    more: "Подробнее"
                }
            }
        }
    },
    app: {
        menu: {
            merchant: {
                accounts: "Мои счета",
                transactions: "История операций",
                cryptoOperations: "Операции с криптовалютой"
            },
            admin: {
                accounts: "Счета",
                transactions: "Операции",
                withdraw: "Вывод в криптовалюте",
                users: "Пользователи",
                currencies: "Валюты",
                merchant: "Мерчанты",
                providers: "Провайдеры",
                directions: "Направления"
            }
        },
        ui: {
            header: {
                totalBalance: "Общий баланс по счетам",
                totalLoading: "Загрузка...",
                totalError: "Не удалось получить общий баланс по счетам",
                accurateBalance: "Точный баланс аккаунта"
            },
            roles: {
                admin: "Администратор",
                merchant: "Мерчант"
            },
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
                chatWithSupport: "Чат с поддержкой",
                close: "Закрыть",
                confirm: "Потвердить"
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
            transactionHistory: "История операции",
            accountHistory: "История счета"
        },
        errors: {
            401: { text: "Ошибка авторизации" },
            403: { text: "Доступ запрещен" },
            404: { text: "Страница не найдена" },
            408: { text: "Превышено время ожидания запроса" },
            409: { text: "Конфликт запроса" },
            413: { text: "Объем передаваемых данных слишком большой" },
            415: { text: "Тип медиа не поддерживается", hint: "Попробуйте загрузить медиа в другом формате" },
            429: { text: "Слишком большое количество запросов", hint: "Попробуйте повторить запрос позднее" },
            500: { text: "Внутренняя ошибка сервера", hint: "Попробуйте повторить запрос позднее" },
            502: { text: "Некорректный шлюз", hint: "Попробуйте изменить запрос" },
            503: { text: "Сервис недоступен", hint: "Попробуйте повторить запрос позднее" },
            504: { text: "Превышено время ожидания запроса" }
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
                    title: "Банковский перевод",
                    payMethod: "Метод оплаты",
                    phone_number: "Номер телефона",
                    card_number: "Номер карты",
                    card_holder: "Владелец карты",
                    iban_number: "Номер IBAN",
                    account_number: "Номер аккаунта",
                    expiration_date: "Срок действия",
                    account_last_digits: "Последние цифры номера",
                    selectPayMethod: "Выберите метод оплаты",
                    payMethodMessage: "Пожалуйста, выберите метод оплаты",
                    valueMessage: "Некорректное значение",
                    value: "Сумма зачисления %{currency}",
                    create: "Создать",
                    successTitle: "Заявка успешно создана",
                    successDescription: "Вы можете отследить её статус в разделе",
                    errorTitle: "Ошибка создания заявки"
                },
                cryptoTransfer: {
                    address: "Адрес получателя TRC20",
                    addressMessage: "Неверный адрес получателя TRC-20",
                    amount: "Сумма, USD₮",
                    amountMessage: "Введите корректное значение (например, 99.564)",
                    amountMinMessage: "Сумма должна быть больше 2 USD₮",
                    amountMaxMessage: "Сумма должна быть максимум %{amount} USD₮",
                    commission: "Комиссия",
                    totalAmount: "Сумма выплаты",
                    allAmount: "Перевести всю сумму",
                    createTransfer: "Перевести",
                    transferSuccess: "Перевод осуществлён!",
                    transferError: "Недостаточно средств на счёте",
                    successButton: "Перевести ещё",
                    errorButton: "Попробовать снова",
                    createNewWallet: "Добавить новый кошелек",
                    lastUsedWallet: "Последний использованный",
                    repeating: "Повтор вывода криптовалюты",
                    repeatDescription: "Данные вывода скопированы в форму, проверьте их и подтвердите новый вывод",
                    noAddress: "Такого адреса нет в вашем аккаунте",
                    error: "Ошибка",
                    nan: "Не является числом"
                },
                userCreate: {
                    title: "Добавление пользователя",
                    name: "Имя",
                    nameMessage: "Пожалуйста, введите имя мерчанта. Минимум 3 символа",
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
            logPassError: "Неправильные данные входа",
            networkError: "Ошибка сети",
            accountError: "Завершите настройку профиля и повторите попытку входа",
            accountConfigTitle:
                "Ваш аккаунт требует настройки, выполните пожалуйста требуемые действия на следующей странице, затем повторите попытку входа",
            accountConfigConfirm: "Настроить",
            totp: "Код двухфакторной аутентификации",
            configure2fa: "Настроить двухфакторную аутентификацию"
        }
    },
    pages: {
        payin: {
            header: "Пополнение"
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
            admin: {
                name: "Accounts"
            },
            merchant: {
                name: "My accounts"
            },
            editDialogTitle: "Edit account",
            editFields: {
                name: "Name",
                wallet_create: "Wallet create",
                wallet_type: "Wallet type",
                tron_wallet: "Provider internal wallet",
                tron_address: "Provider external wallet",
                provider_account: "Provider account",
                reward_account: "Buffer account",
                stateActive: "Yes",
                stateInactive: "No"
            },
            fields: {
                owner: "Owner",
                state: "State",
                states: {
                    active: "Active",
                    frozen: "Frozen",
                    blocked: "Blocked",
                    deleted: "Deleted"
                },
                type: "Account type",
                balance: "Account balance",
                history: "Account history",
                tron_wallet: "Tron wallet",
                trc20: "Merchant balance replenishment address in aggregator",
                id: "ID",
                edit: "Edit",
                owner_id: "Owner ID",
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
            name: "Users",
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
                filterByUsernamePlaceholder: "Name",
                filterByActivity: "Active users"
            },
            createButton: "Add user",
            showHeader: "User info",
            showDescription: "Detailed information about user with ID %{id}",
            editUser: "Edit user",
            create: {
                success: "Success",
                successMessage: "User is created",
                error: "Error",
                errorMessage: "Failed to create user"
            },
            deleteMessages: {
                deleteSuccess: "Deleted successfully",
                deleteError: "Failed to delete user"
            }
        },
        transactions: {
            name: "Transactions",
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
                    state_description: "Status",
                    state_changed: "Status changed to:"
                },
                rateInfo: "Rate",
                createdAt: "Created at",
                stornoIds: "Storno transactions",
                source: {
                    header: "Sender",
                    id: "ID",
                    amount: {
                        currency: "Currency",
                        value: "Value",
                        getAmount: "Amount credited"
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
                        value: "Value",
                        sendAmount: "Amount send"
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
            undefined: "No results",
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
            },
            types: {
                all: "All transactions",
                deposit: "Deposit",
                withdraw: "Withdrawal",
                transfer: "Transfer",
                reward: "Reward",
                feefromsender: "Fee from sender",
                feefromtransaction: "Fee from transaction"
            },
            states: {
                all: "Show all",
                created: "Created",
                paid: "Paid",
                fromoutside: "From outside",
                waitpayout: "Wait payout",
                paidout: "Paid out",
                toreturnfrominside: "To return from inside",
                toreturnfromoutside: "To return from outside",
                reversed: "Reversed",
                changedfromcreated: "Changed from created",
                changedfrompaid: "Changed from paid",
                returned: "Returned",
                todeny: "To deny",
                processing: "Processing",
                expired: "Expired",
                deleted: "Deleted",
                success: "Success",
                fail: "Fail",
                correction: "Correction",
                emptyrequisites: "Empty requisites",
                limitfail: "Limit fail",
                waitingforadminapproval: "Waiting for admin approval",
                cancelledbypayer: "Cancelled by payer"
            }
        },
        withdraw: {
            name: "Сrypto withdrawal",
            tableTitle: "Report on cryptocurrency withdrawals",
            cryptoTransferTitle: "Crypto transfer",
            resendQuestion: "Repeat transaction?",

            errors: {
                lowAmountError: "The amount must be more than 2 USDT",
                serverError: "An error occured on server"
            },
            fields: {
                id: "Transaction ID",
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
                },
                merchant: "Merchant",
                state: "State",
                idInBlockChain: "ID in blockchain",
                resend: "Resend"
            },
            download: {
                downloadReportButtonText: "Download report",
                bothError: "Both start date and end date must be selected",
                error: "Error"
            },
            filter: {
                filterById: "Search by ID",
                filterByIdPlaceholder: "ID",
                filterByDate: "Date",
                filterByDatePlaceholder: "Select period",
                clearFilters: "Clear filters"
            }
        },
        currency: {
            name: "Currencies",
            fields: {
                currency: "Currency",
                type: "Type",
                symbPos: "Symbol Position",
                symbol: "Symbol",
                fiat: "FIAT",
                crypto: "Cryptocurrency",
                before: "Before value",
                after: "After value",
                currencyName: "Currency name",
                example: "Example",
                edit: "Edit",
                delete: "Delete"
            },
            errors: {
                code: "Code is required",
                alreadyInUse: "This name is already in use. Choose another one."
            },
            create: "Add currency",
            createDialogTitle: "Adding a currency",
            editDialogTitle: "Edit currency",
            deleteDialogTitle: "Delete a currency?",
            showTitle: "Detailed information about currency",
            showDescription: "Detailed information about currency"
        },
        merchant: {
            name: "Merchants",
            merchant: "Merchant",
            fields: {
                id: "ID",
                name: "Name",
                descr: "Description",
                fees: "Fees",
                directions: "Directions"
            },
            errors: {
                id: "ID is required",
                name: "Name is required",
                alreadyInUse: "Merchant with this id or name is already exists.",
                noSpaces: "Spaces are not allowed in this field"
            },
            showTitle: "Detailed information about merchant",
            createNew: "Create new merchant",
            editingMerchant: "Editing merchant",
            creatingMerchant: "Creating new merchant",
            delete: "Delete merchant?"
        },
        provider: {
            name: "Providers",
            fields: {
                _name: "Name",
                name: "Provider",
                pk: "Public key",
                genKey: "Generate keys",
                keyMiss: "The key is missing",
                regenKey: "Regenerate keys",
                json_schema: "Json schema",
                code: "Methods",
                enterMethods: "Enter your methods",
                methods: "Methods"
            },
            errors: {
                name: "Name must contain at least 1 symbol",
                alreadyInUse: "This name is already in use. Choose another one."
            },
            showTitle: "Detailed information about provider",
            createNew: "Create new provider",
            createTestKeys: "Create test keys",
            attention: "Attention",
            warning: "Attention! Private key will be shown ONLY 1 time",
            sendToDevOps: "Copy it and send it to DevOps Engineer",
            pleaseCreate: "Please create keys on the page with providers table",
            pleaseWait: "Please wait",
            clickToCopy: "This is your private key.\n Click button to copy or copy manually.",
            continue: "Continue",
            close: "Close",
            privateKey: "Private key",
            deleteProviderQuestion: "Delete provider?",
            keysCreating: "Test keys creating",
            realKeysCreating: "Keys generation",
            editingProvider: "Editing provider",
            creatingProvider: "Creating provider"
        },
        direction: {
            name: "Directions",
            direction: "Direction",
            fields: {
                name: "Directions name",
                active: "State",
                accountNumber: "Account number",
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
                merchantsDirections: "Directions of merchant ",
                isActive: "Activity",
                terminal: "Terminal"
            },
            fees: {
                fees: "Fees",
                accountNumber: "Account number",
                feeAmount: "Fee amount",
                feeType: "Fee type",
                currency: "Currency",
                descr: "Description",
                addFee: "Add fee",
                direction: "Direction",
                deleteFee: "Delete fee?",
                error: "Error",
                errorWhenCreating: "An error occurred while creating the fee"
            },
            errors: {
                name: "The direction must have a name",
                src_curr: "The source currency must be selected",
                dst_curr: "The destination currency must be selected",
                merchant: "The merchant must be selected",
                provider: "The provider must be selected",
                authError: "An error has occurred while adding authentication information",
                terminal: "The terminal must be selected",
                terminalError: "An error occured when fetching terminals",
                noTerminalsError: "Chosen provider does not have any terminals"
            },
            create: "Add direction",
            sourceCurrency: "Source currency",
            destinationCurrency: "Destination currency",
            selectSourceCurrency: "Choose source currency",
            selectDestCurrency: "Choose destination currency",
            merchant: "Merchant",
            weight: "Weight",
            provider: "Provider",
            description: "Description",
            authInfo: "Authentication data",
            changeAuthDataHeader: "Editing authentication data",
            writeSecretPhrase: "Write auth data for direction and click save.",
            secretHelper: "Expected valid JSON object",
            enterSecretPhrase: "Enter secret phrase",
            note: "Note: You cannot use a provider for direction that does not have a key",
            addedSuccess: "Auth data has been added successfully",
            pleaseCreate: "Please add auth data on the page with table",
            noProviders: "No available providers",
            noMerchants: "No available merchants",
            noCurrencies: "No available currencies",
            noTerminals: "Select provider to select terminal",
            deleteDirection: "Delete direction?",
            editingDirection: "Editing direction",
            creatingDirection: "Creating direction"
        },
        terminals: {
            name: "Terminal",
            fields: {
                verbose_name: "Name",
                id: "ID",
                description: "Description",
                provider: "Provider",
                auth: "Auth key"
            },
            errors: {
                verbose_name: "The terminal must have a name",
                description: "The terminal must have a description"
            },
            create: "Create terminal",
            selectHeader: "Provider",
            selectPlaceholder: "Select provider",
            creatingTerminal: "Creating terminal",
            deleteHeader: "Delete terminal?",
            editingTerminal: "Editing terminal"
        },
        bankTransfer: {
            name: "Bank transfer"
        },
        wallet: {
            name: "Managing сryptocurrencies",
            storage: {
                name: "Storage",
                initiatedTitle: "The storage is not initialized",
                buttonForInitiated: "Initialize",
                initiatedError: "Initialization error",
                titleClosed: "Storage sealed",
                buttonForOpen: "Unseal",
                buttonForClosed: "Seal",
                buttonForCancel: "Cancel unsealing",
                buttonForEnterKey: "Enter key shard",
                buttonForSend: "Submit",
                titleOpened: "Storage unsealed",
                key: "Key",
                unsealed: {
                    errorTitle: "Storage unsealing error",
                    errorSubtitle: "Please try again",
                    allKeys: "Total key shards",
                    requiredKeys: "Required to unseal",
                    enteredKeys: "Entered key shards",
                    toFinishKeys: "Shards remaining to unseal"
                }
            },
            manage: {
                name: "Wallets",
                wallet: "Wallet",
                fields: {
                    walletType: "Wallet type",
                    walletAddress: "Wallet address",
                    accountNumber: "Account ID",
                    merchantName: "Merchant",
                    merchantId: "Merchant ID",
                    currency: "Currency",
                    descr: "Description",
                    more: "More",
                    internalId: "Internal wallet ID",
                    blockchain: "Blockchain",
                    contactType: "Contact type in blockchain",
                    minRemaini: "Minimum remaining amount",
                    balance: "Balance"
                },
                error: "Error",
                errors: {
                    selectAccount: "Select account",
                    errorWhenEditing: "An error occured when editing wallet",
                    errorWhenCreating: "An error occured when creating wallet",
                    serverError: "Server side error, try again later",
                    alreadyExists: "Wallet with this address is already exists",
                    addressRequired: "Address is required",
                    invalidTRCAddresss: "Invalid TRC20 address",
                    minBalance: "Minimum value is 0",
                    intOnly: "Input should be a valid integer without fractional part"
                },
                creatingWallet: "Adding wallet",
                editingWallet: "Editing wallet",
                deleteWallet: "Delete wallet?",
                createWallet: "Create wallet"
            },
            transactions: {
                name: "Cryptotransactions",
                cryptotransaction: "Cryptotransaction",
                allTransactions: "All transactions",
                deletedTransactions: "Deleted transactions",
                successMessage: "Confirmation request was send, wait for status update.",
                fields: {
                    created_at: "Created at",
                    updated_at: "Updated at",
                    deleted_at: "Deleted at",
                    src_wallet: "Source wallet",
                    id: "Transaction ID",
                    dst_wallet: "Destination wallet",
                    amount: "Transaction amount",
                    type: "Transaction type",
                    state: "Payment status",
                    merchant_id: "Merchant ID",
                    tx_id: "ID in blockchain",
                    currency: "Currency",
                    blowfish_id: "Blowfish id",
                    total_fee: "Total fee",
                    bandwidth_fee: "Network fee",
                    confirm: "Confirm",
                    confirmQuestion: "Confirm transaction?",
                    pre_calculated_fee: "Precalculated fee"
                },
                error: "Error",
                errors: {
                    failedToConfirm: "Failed to confirm transaction"
                },
                filterBar: {
                    searchById: "Search by transaction ID",
                    paymentStatus: "Payment status",
                    created_at: "Creation date",
                    datePlaceholder: "Select date",
                    updated_at: "Update date",
                    resetFilters: "Reset filters"
                }
            },
            linkedTransactions: {
                name: "Receipts to the linked-wallet",
                show: "Receipt to a linked wallet",
                manual_reconciliation: "Manual reconciliation",
                check: "Check",
                notFound: "Transaction was not found",
                successFound: "Transaction added successfullly",
                fields: {
                    scannedAt: "Scanned at",
                    blockTimestamp: "Block timestamp",
                    transactionId: "Transaction ID",
                    sourceAddress: "Source address",
                    destinationAddress: "Destination address",
                    type: "Type",
                    amount: "Amount",
                    currency: "Currency",
                    more: "More"
                }
            }
        }
    },
    app: {
        menu: {
            merchant: {
                accounts: "My accounts",
                transactions: "Transactions history",
                cryptoOperations: "Crypto transactions"
            },
            admin: {
                accounts: "Accounts",
                transactions: "Transactions",
                withdraw: "Withdrawal in crypto",
                users: "Users",
                currencies: "Currencies",
                merchant: "Merchants",
                providers: "Providers",
                directions: "Directions"
            }
        },
        ui: {
            header: {
                totalBalance: "Total account balance",
                totalLoading: "Loading...",
                totalError: "Error while getting total account balance",
                accurateBalance: "Accurate account balance"
            },
            roles: {
                admin: "Administrator",
                merchant: "Merchant"
            },
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
                chatWithSupport: "Chat with support",
                close: "Close",
                confirm: "Confirm"
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
            transactionHistory: "Transaction history",
            accountHistory: "Account history"
        },
        errors: {
            401: { text: "Unauthorized" },
            403: { text: "Access is denied" },
            404: { text: "Page not found" },
            408: { text: "Request timeout" },
            409: { text: "Conflict" },
            413: { text: "Payload too large" },
            415: { text: "Unsupported media type", hint: "Try uploading the media in a different format" },
            429: { text: "Too many requests", hint: "Please try again later" },
            500: { text: "Internal server error", hint: "Please try again later" },
            502: { text: "Bad gateway", hint: "Please modify your request" },
            503: { text: "Service unavailable", hint: "Please try again later" },
            504: { text: "Timeout" }
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
                    title: "Bank transfer",
                    payMethod: "Pay method",
                    phone_number: "Phone number",
                    card_number: "Card number",
                    card_holder: "Cardholder",
                    iban_number: "IBAN number",
                    account_number: "Account number",
                    expiration_date: "Expiration date",
                    account_last_digits: "Last four digits",
                    selectPayMethod: "Select pay method",
                    payMethodMessage: "Please, select pay method",
                    value: "Destination value %{currency}",
                    valueMessage: "Wrong value",
                    create: "Created",
                    successTitle: "The request has been successfully created",
                    successDescription: "You can track her status in the section",
                    errorTitle: "Request creation error"
                },
                cryptoTransfer: {
                    address: "TRC20 recipient address",
                    addressMessage: "Invalid TRC-20 recipient address",
                    amount: "Amount, USD₮",
                    amountMessage: "Insert correct amount (e.g. 99.564)",
                    amountMinMessage: "Amount should be more than 2 USD₮",
                    amountMaxMessage: "Amount should be less than %{amount} USD₮",
                    commission: "Commission",
                    totalAmount: "Total amount",
                    allAmount: "Transfer the entire amount",
                    createTransfer: "Transfer",
                    transferSuccess: "Transfer is successful!",
                    transferError: "Insufficient funds in the account",
                    successButton: "Transfer more",
                    errorButton: "Try again",
                    createNewWallet: "Add New Wallet",
                    lastUsedWallet: "Last used",
                    nan: "Is not a number",
                    repeating: "Repeat Cryptocurrency Withdrawal",
                    repeatDescription:
                        "The withdrawal data has been copied to the form. Please check it and confirm the new withdrawal.",
                    noAddress: "This address is not in your account",
                    error: "Error"
                },
                userCreate: {
                    title: "Adding a user",
                    name: "Name",
                    nameMessage: "Please, enter merchant's name. Minimum 3 symbols",
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
            logPassError: "Invalid user data",
            networkError: "Network Error",
            accountError: "Complete the profile setup and try logging in again",
            accountConfigTitle:
                "Your account needs to be configured, please follow the required steps on the next page, then try logging in again",
            accountConfigConfirm: "Configure",
            totp: "Two-factor authentication code",
            configure2fa: "Configure Two-factor auth"
        }
    },
    pages: {
        payin: {
            header: "Pay In"
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

export const i18nProvider = polyglotI18nProvider(
    (locale: string) => translations[locale as "ru" | "en"],
    localStorage.getItem("i18nextLng") ?? "en",
    [
        { locale: "ru", name: "Русский" },
        { locale: "en", name: "English" }
    ],
    { allowMissing: true }
);
