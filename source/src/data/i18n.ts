import { TranslationMessages } from "ra-core";
import polyglotI18nProvider from "ra-i18n-polyglot";
import raEn from "ra-language-english";
import raRU from "ra-language-russian";

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
            editDialogTitle: "Изменить счет",
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
                edit: "Изменить",
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
            errors: {
                name: "Требуется указать имя",
                uuid: "Неправильный UUID"
            },
            showHeader: "Информация о счете",
            showDescription: "Подробная информация о счете с ID %{id}",
            balance: "Баланс",
            held: "Заморожено"
        },
        users: {
            name: "Пользователи",
            user: "Пользователь",
            edit: "Изменить",
            deleteThisUser: "Удалить пользователя?",
            delete: "Удалить",
            fields: {
                id: "ID пользователя",
                keycloak_id: "ID пользователя",
                name: "Имя пользователя",
                login: "Логин",
                email: "Электронная почта",
                merchant: "Мерчант",
                roles: "Роли",
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
                filterByUserId: "Поиск по ID пользователя",
                filterByUsername: "Поиск по имени",
                filterByUsernamePlaceholder: "Имя",
                filterByActivity: "Активные пользователи"
            },
            showHeader: "Информация о пользователе",
            showDescription: "Подробная информация о пользователе с ID %{id}",
            editUser: "Изменить пользователя",
            editSuccessMessage: "Пользователь успешно изменен",
            create: {
                successMessage: "Пользователь %{name} успешно создан.",
                errorMessage: "Не удалось создать пользователя",
                deleteError: "Не удалось создать пользователя",
                merhchantDoesntExist: "Выбранный мерчант не найден",
                usernameInUse: "Выбранный логин уже занят, выберите другой",
                emailInUse: "Выбранный адрес электронной почты уже используется",
                wrongRole: "Выбранная роль не существует",
                wrongNames: "Неправильный формат имени и/или фамилии"
            },
            deleteMessages: {
                deleteSuccess: "Успешно удален",
                deleteError: "Ошибка при удалении пользователя"
            },
            roles: {
                admin: "Системный администратор",
                system_manager_for_providers: "Системный менеджер по интеграции провайдеров",
                system_manager_for_merchants: "Системный менеджер по интеграции мерчантов",
                system_sales_manager: "Системный менеджер по продажам",
                system_hos: "Руководитель отдела продаж в системе",
                system_operator: "Оператор системы",
                system_supervisor: "Аудитор системы",
                system_accountant: "Бухгалтер системы",
                merchant: "Адмнистратор мерчанта",
                merchant_operator: "Оператор мерчанта"
            }
        },
        transactions: {
            name: "Операции",
            fields: {
                id: "ID операции",
                created_at: "Дата создания",
                updated_at: "Обновлена",
                committed: "Зафиксированная",
                account_id: "ID счёта",
                dispute: "Диспут",
                accountBalance: "Баланс счёта",
                amount_value: "Сумма",
                currency: "Валюта",

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
                        sendAmount: "Сумма отправления"
                    },
                    meta: {
                        caption: "Название"
                    }
                },
                destination: {
                    header: "Мерчант",
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
                recipient: "Получатель",
                type: "Тип",
                feeType: "Тип комиссии",
                value: "Сумма",
                history: "История",
                fees: "Комиссии",
                feeValue: "Сумма комиссии",
                sourceValue: "Сумма отправления",
                destValue: "Сумма зачисления"
            },
            show: {
                statusButton: "Ручной перевод в статус",
                cancel: "Отмена",
                storno: "Сторно",
                commit: "Зафиксировать",
                openDispute: "Открыть диспут",
                closeDispute: "Закрыть диспут",
                disputeOpened: "Диспут открыт",
                disputeClosed: "Диспут закрыт",
                commitTransaction: "Зафиксировать операцию?",
                sendWebhook: "Отправить вебхук",
                sendWebhookSuccessMsg: "Вебхук для ордера %{id} успешно отправлен",
                notFound: "Транзакция не найдена"
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
                dateExceed: "Начальная/конечная дата не может быть больше сегодняшней даты",
                accountField: "Выберите аккаунт мерчанта"
            },
            filter: {
                filters: "Фильтры",
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
                feefromtransaction: "Комиссия с транзакции",
                unknown: "Неизвестный тип",
                undefined: "Неизвестный тип"
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
                cancelledbypayer: "Отменено плательщиком",
                cascadefail: "Ошибка каскада"
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
                    hash: "Хэш",
                    hash_link: "Ссылка Tronscan"
                },
                merchant: "Мерчант",
                state: "Состояние",
                idInBlockChain: "Хэшлинк",
                resend: "Повторить"
            },
            download: {
                downloadReportButtonText: "Скачать отчет",
                bothError: "Начальная дата и конечная дата обязательно должны быть заполнены",
                error: "Ошибка"
            },
            filter: {
                filterById: "Поиск по ID",
                filterByTrc20: "Поиск по адресу TRC20",
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
                delete: "Удалить",
                accuracy: "Точность",
                defaultAccuracyPlaceholder: "По умолчанию 2"
            },
            errors: {
                code: "Код валюты обязательно нужно ввести",
                alreadyInUse: "Данное имя уже тспользуется. Выберите другое.",
                intOnly: "Значение должно быть целым числом, без дробной части",
                minVal: "Минимальное значение 1",
                maxVal: "Максмальное значение 16"
            },
            create: "Добавить валюту",
            createDialogTitle: "Добавление валюты",
            editDialogTitle: "Изменить валюту",
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
                directions: "Направления",
                fees: "Комиссии",
                pays: "PayIn/PayOut"
            },
            errors: {
                id: "ID обязательно должен быть заполнен",
                name: "У мерчанта обязательно должно быть имя",
                alreadyInUse: "Мерчант с таким именем или Id уже существует",
                noSpaces: "Пробелы запрещены в данном поле",
                publicKey: "Неверный формат публичного ключа",
                required: "Обязательное поле",
                notFound: "Мерчант %{name} не найден"
            },
            success: {
                create: "Мерчант %{name} успешно создан."
            },
            showTitle: "Детальная инфорация о мерчанте",
            createNew: "Создать нового мерчанта",
            creatingMerchant: "Создание нового мерчанта",
            editingMerchant: "Изменить мерчанта",
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
            recreateConfirm: "Пересоздать ключи?",
            recreateConfirmDescription: "Старые ключи станут недействительными",
            recreate: "Пересоздать",
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
            editingProvider: "Изменить провайдера",
            creatingProvider: "Создание провайдера"
        },
        direction: {
            direction: "Направление",
            name: "Направления",
            types: {
                type: "Тип",
                universal: "Универсальный",
                withdraw: "Вывод средств",
                deposit: "Пополнение"
            },
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
                errorWhenCreating: "Произошла ошибка при создании комиссии",
                successDelete: "Коммисия успешно удалена",

                directionFieldError: "Направление обязательно должно быть выбрано",
                currencyFieldError: "Валюта обязательно должна быть выбрана",
                valueFieldError: "Коммиссия должна быть положительным числом, например 0.1"
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
                noTerminalsError: "У выбранного провайдера нет терминалов",
                weightError: "Должно быть целым числом в диапазоне от 0 до 1000",
                typeError: "Необходимо выбрать тип",
                onlyThirdTypeError: "Валюты недоступны для выбранного типа комиссий"
            },
            success: {
                create: "Направление %{name} успешно создано.",
                active: "активировано",
                inactive: "деактивировано",
                editActivity: "Направление %{name} успешно %{state}."
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
            changeAuthDataHeader: "Измениту аутентификационную информацию",
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
            editingDirection: "Изменить направление",
            creatingDirection: "Добавление направления"
        },
        terminals: {
            name: "Терминалы",
            terminal: "Терминал",
            fields: {
                verbose_name: "Наименование",
                id: "ID",
                description: "Описание",
                provider: "Провайдер",
                auth: "Данные аутентификации",
                fees: "Комиссии",
                createAccount: "Создать счёт",
                account: "Счёт",
                details: "Технические данные",
                allocation_timeout_seconds: "Таймаут ответа провайдера",
                timeout: "Таймаут провайдера",
                pays: "PayIn/PayOut"
            },
            filter: {
                filters: "Фильтры",
                showAll: "Показать все",
                filterAllPlaceholder: "Все",
                filterByName: "Терминал"
            },
            errors: {
                verbose_name: "У терминала обязательно должно быть имя",
                description: "У терминала обязательно должно быть описание",
                auth_data_toggle: "Для переключения режима - исправьте ошибки",
                key_error: "Поле key обязательное",
                value_error: "Поле value обязательное",
                allocation_timeout_seconds: "Только целочисленные значения",
                allocation_timeout_seconds_min: "Минимальное значение 1",
                allocation_timeout_seconds_max: "Максимальное значение 120"
            },
            success: {
                create: "Терминал %{name} успешно создан."
            },
            callbackCreating: "Создание callback",
            callbackCreatedSuccessfully: "Callback успешно создан",
            urlTemplate: "Шаблон URL",
            create: "Создать терминал",
            selectHeader: "Провайдер",
            selectPlaceholder: "Выберите провайдера",
            creatingTerminal: "Создание терминала",
            deleteHeader: "Удалить терминал?",
            editingTerminal: "Изменить терминал",
            accountCreatedSuccessfully: "Account created successfully",
            adapter_nats_subject: "Адаптер Nats"
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
                    toFinishKeys: "До распечатывания осталось",
                    unsealSuccess: "Хранилище успешно распечатано",
                    keyPartSuccess: "Часть ключа введена успешно"
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
                    balance: "Баланс"
                },
                errors: {
                    serverError: "Ошибка на стороне сервера. Попробуйте позже",
                    selectAccount: "Выберите аккаунт",
                    errorWhenEditing: "Произошлка ошибка при изменении кошелька",
                    errorWhenCreating: "Произошлка ошибка при создании кошелька",
                    alreadyExists: "Кошелек с таким адресом уже существует",
                    addressRequired: "Введите адрес кошелька",
                    invalidTRCAddresss: "Неправильный формат TRC20 адреса",
                    invalidTransactionId: "Неправильный формат ID TRC20 транзакции",
                    minBalance: "Минимальное значение 0",
                    intOnly: "Значение должно быть целым числом, без дробной части"
                },
                success: {
                    create: "Кошелек был успешно создан."
                },
                creatingWallet: "Добавление кошелька",
                editingWallet: "Изменить кошелек",
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
                    tx_id: "Хэшлинк",
                    clickOnHashlink: "Хэш (нажмите на хэш чтобы открыть транзакцию в обозревателе блокчейна)",
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
                notValidAmount: "Сумма не может быть больше баланса",
                fields: {
                    scannedAt: "Время сканирования",
                    blockTimestamp: "Время генерации",
                    transactionId: "ID транзакции",
                    sourceAddress: "Адрес кошелька отправителя",
                    destinationAddress: "Адрес кошелька получателя",
                    type: "Тип операции",
                    amount: "Сумма прихода",
                    currency: "Валюта",
                    fiatSwitcher: "Вывод через фиатную валюту",
                    merchantBalance: "Баланс",
                    merchantAmount: "Сумма"
                }
            }
        },
        callbridge: {
            name: "Входящие коллбеки",
            mapping: {
                name: "Маппинги",
                mapping: "Маппинг",
                fields: {
                    name: "Название",
                    ext_path: "Внешний путь",
                    target: "Цель",
                    int_path: "Внутренний путь",
                    description: "Описание",
                    terminal: "Терминал",

                    callback_url: "URL коллбека",
                    created_at: "Дата создания",
                    external_path: "Внешний путь",
                    internal_path: "Внутренний путь",
                    retry_policy: "Политика повторов",
                    base_delay: "Базовая задержка",
                    state: "Состояние",
                    active: "Активно",
                    disabled: "Выключено",
                    max_attempts: "Максимальное число попыток",
                    strategy: "Стратегия",
                    retryOn: "Повторная попытка при статусах",
                    retryStatusChange: "Изменить статусы для повторов",
                    newStatus: "Новые статусы",
                    enterSepWithCommas: "Введите новые статусы разделив их запятой",

                    wrongFormat: "Неправильные данные",
                    allowedSymbols: "Можно использовать только пробелы, цифры и запятые",
                    allowedVariant: "Ввод должен быть вида 400, 404,500 без лишних символов",

                    security_policy: "Политика безопасности",
                    allowed_ips: "Разрешённые IP-адреса",
                    auth: "Авторизация",
                    auth_required: "Требуется авторизация",
                    auth_not_required: "Не требуется авторизация",
                    whiteListEdit: "Изменить разрешенные IP адреса",
                    blackListEdit: "Изменить заблокированные IP адреса",
                    actDeactButton: "Активировать/деактивировать политику",

                    blocked: "Заблокировано",
                    permitted: "Разрешено",
                    blocked_ips: "Заблокированные IP-адреса",
                    burst_limit: "Порог частоты запросов",
                    enforcement_mode: "Режим принудительного контроля",
                    updated_at: "Дата обновления"
                },
                sec_policy_edit: {
                    editingAllowedPolicy: "Редактирование списка разрешенных адресов",
                    editingBlockedPolicy: "Редактирование списка запрещенных адресов",
                    noIps: "IP-адресов нет",
                    addIp: "Добавить IP адрес",
                    deleteIp: "Удалить IP адрес",
                    errors: {
                        wrongFormatOfIp: "Неправильный формат IPv4 адреса",
                        alreadyExists: "Введенный IP адрес уже добавлен",
                        notExist: "Данного IP адреса нету в списке"
                    },
                    addedSuccessfully: "IP адрес добавлен",
                    deletedSuccessfully: "IP адрес удален",
                    activatePolicy: "Активировать политику?",
                    deactivatePolicy: "Деактивировать политику?"
                },
                errors: {
                    cantBeEmpty: "Поле не может быть пустым",
                    invalidUrl: "Неправильный формат URL",
                    errorWhenCreating: "Произошла ошибка при создании"
                },
                create: "Добавить маппинг",
                createSuccess: "Маппинг успешно создан",
                updateSuccess: "Маппинг успешно обновлён",
                creatingMapping: "Создание маппинга",
                deleteMapping: "Удалить маппинг?",
                editingMapping: "Изменить маппинг"
            },
            history: {
                name: "История",
                history: "История",
                callback_id: "ID коллбека",
                fields: {
                    request_url: "Выходной url",
                    original_url: "Исходный url",
                    mapping_id: "ID маппинга",
                    created_at: "Дата создания",
                    status: "Статус",
                    trigger_type: "Тип триггера"
                },
                callbacksStatus: {
                    retryCallback: "Повторить",
                    queued: "В очереди",
                    processing: "Обрабатывается",
                    success: "Успех",
                    error: "Ошибка",
                    sync: "Синхронизация"
                }
            }
        },
        paymentTools: {
            name: "Платёжные инструменты",
            paymentType: {
                name: "Типы платежей",
                admin: {
                    name: "Типы платежей"
                },
                errors: {
                    code: "Код не может быть пустым",
                    codeRegex: "Код может содержать только буквы, цифры, подчеркивание и тире"
                },
                fields: {
                    code: "Название",
                    title: "Описание",
                    payment_types: "Типы платежей",
                    category: "Категория",
                    icon: "Иконка"
                },
                deletePaymentTypeQuestion: "Удалить тип платежа?",
                creatingPaymentType: "Создание типа платежа",
                editingPaymentType: "Изменение типа платежа",
                createNew: "Добавить тип платежа",
                duplicateCode: "Введенный код уже используется"
            },
            financialInstitution: {
                name: "Фин. организации",
                show: "Фин. организация",
                fields: {
                    created_at: "Дата и время создания",
                    updated_at: "Дата и время обновления",
                    name: "Название финансового института",
                    short_name: "Краткое наименование",
                    legal_name: "Полное юр.наименование",
                    institution_type: "Типы платёжных институтов",
                    country_code: "Код страны регистрации",
                    bic: "SWIFT BIC",
                    tax_id_number: "ИНН",
                    registration_number: "ОГРН / регистрационный номер",
                    nspk_member_id: "Код участника НСПК",
                    status: "Активность",
                    payment_types: "Платёжные системы",
                    currencies: "Валюты",
                    currenciesToChoose: "Выберите валюты",
                    id: "ID",
                    meta: "Метадата",
                    types: {
                        BANK: "Банк",
                        OTHER: "Другое"
                    }
                },
                errors: {
                    name: "Название финансового института обязательно",
                    country_code: "Код страны введен не правильно"
                },
                success: {
                    ACTIVE: "активна",
                    INACTIVE: "деактивирована",
                    editActivity: "Активность финансовой организации %{name} успешно изменена на: %{state}."
                },
                createFinancialInstitutionBtn: "Добавить организацию",
                createFinancialInstitutionTitle: "Добавление финансовой организации",
                deleteFinancialInstitution: "Удалить фин. организацию?"
            },
            systemPaymentInstruments: {
                name: "Системные инструменты",
                show: "Системный инструмент",
                fields: {
                    name: "Название",
                    payment_type_code: "Тип платежа",
                    currency_code: "Валюта",
                    financial_institution_id: "Финансовая организация",
                    direction: "Направление",
                    status: "Статус",
                    description: "Описание",
                    meta: "Метаданные"
                },
                list: {
                    createdAt: "Дата и время создания",
                    updatedAt: "Дата и время обновления",
                    id: "ID",
                    paymentType: "Инструмент",
                    paymentTypeCode: "Тип платежа",
                    financialInstitution: "Финансовая организация",
                    direction: "Направление операции"
                },
                errors: {
                    cantBeEmpty: "Поле не может быть пустым",
                    nameRegex: "Название может содержать только буквы, цифры, подчеркивание и тире"
                },
                statuses: {
                    active: "Активен",
                    inactive: "Неактивен",
                    test_only: "Тестовый"
                },
                creatingPaymentInstrument: "Создание платежного инструмента",
                editingPaymentInstrument: "Изменение платежного инструмента",
                createNew: "Добавить платежный инструмент",
                deletePaymentInstrumentQuestion: "Удалить платежный инструмент?"
            },
            terminalInstrumentConfigurations: {
                name: "Интеграции терминалов"
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
                aggregatorProfit: "Прибыль агрегатора",
                totalLoading: "Загрузка...",
                totalError: "Не удалось получить общий баланс по счетам",
                accurateBalance: "Точный баланс аккаунта",
                accurateAggregatorProfit: "Точная прибыль агрегатора",
                settings: "Настройки"
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
                cancel: "Отменить",
                areYouSure: "Вы точно хотите удалить элемент?",
                chatWithSupport: "Чат с поддержкой",
                close: "Закрыть",
                confirm: "Потвердить",
                search: "Поиск...",
                refresh: "Обновить",
                details: "Подробнее",
                generateCallback: "Создать callback",
                clear: "Очистить"
            },
            pagination: {
                next: "Далее",
                previous: "Назад"
            },
            textField: {
                copied: "Скопировано"
            },
            toast: {
                success: "Успешно",
                error: "Ошибка"
            },
            create: {
                createSuccess: "Элемент успешно создан",
                createError: "Что-то пошло не так, повторите попытку позднее"
            },
            delete: {
                deletedSuccessfully: "Элемент удален успешно"
            },
            edit: {
                editSuccess: "Элемент успешно изменен",
                editError: "Что-то пошло не так, повторите попытку позднее"
            },
            testPopup: {
                attention: "Внимание!",
                youReInTestEnv: "Вы находитесь в тестовой среде.",
                allActionsSimulated: "Все действия являются пробными.",
                ok: "Принято!"
            },
            timePickerShow: "Добавить диапазон времени",
            timePickerErrorTitle: "Введите корректный интервал времени",
            timePickerErrorDescription: "Отображены данные за сутки",
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
            dark: "Тёмная тема"
        },
        widgets: {
            forms: {
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
                    valueMinMessage: "Минимальное значение должно быть больше нуля",
                    value: "Сумма зачисления %{currency}",
                    create: "Создать",
                    successTitle: "Заявка успешно создана",
                    successDescription: "Вы можете отследить её статус в разделе",
                    errorTitle: "Ошибка создания заявки",
                    createOrder: "Создать ордер",
                    required: "Обязательное поле",
                    noResult: "Нет доступных методов",
                    loadingError: "Произошла ошибка, обратитесь к администратору.",
                    wordsRegex: "Допускается ввод латиницы. Минимум 3 символа, максимум 255",
                    minSymbol: "Поле не должно быть пустым",
                    numberRegex: "Допускается только ввод цифр и специальных символов"
                },
                payoutBanner: {
                    title: "Банковский перевод",
                    subtitle: "Ваша заявка на перевод успешно сформирована!",
                    description:
                        "Чтобы завершить перевод, пожалуйста, воспользуйтесь ссылкой в телеграм-бот. Там вы сможете получать актуальную информацию о поступлении средств",
                    closeTitle: "Закрыть ссылку на Телеграм-бот?"
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
                    nan: "Не является числом",
                    insufficentBalance: "Для вывода криптовалюты требуются средства на балансе USDT"
                },
                userCreate: {
                    title: "Добавление пользователя",
                    id: "ID пользователя",
                    firstName: "Имя",
                    firstNameMessage:
                        "Допускается ввод кириллицы, латиницы и специальных символов (:'-.,_@+). Максимум 255",
                    maxSymbols: "Количество символов должно быть меньше 255",
                    lastName: "Фамилия",
                    lastNameMessage:
                        "Допускается ввод кириллицы, латиницы и специальных символов (:'-.,_@+). Максимум 255",
                    login: "Логин",
                    loginMessage:
                        "Допускается ввод латиницы и специальных символов (:'-.,_@+). Минимум 3 символа, максимум 255",
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
                    cancelBtn: "Отменить",
                    role: "Роль",
                    merchant: "Выберите мерчанта",
                    activity: {
                        name: "Статус",
                        active: "Активен",
                        blocked: "Заблокирован"
                    }
                }
            },
            limits: {
                limits: "Лимиты",
                deposit: "Депозит",
                payment: "Выплата",
                reward: "Вознаграждение",

                deleteLimits: "Обнулить лимиты?",
                reset: "Обнулить",

                resetedSuccessfully: "Лимиты успешно обнулены",
                updatedSuccessfully: "Лимиты успешно обновлены",

                errors: {
                    minGreaterThanMax: "Максимальное значение лимита %{field} не может быть меньше минимального",
                    maxTooSmall: "Максимальное значение лимита %{field} должно быть равным 0 или больше 1",
                    minTooSmall: "Минимальное значение лимита %{field} должно быть равным 0 или больше 1",
                    maxTooLarge: "Максимальное значение лимита %{field} не может быть больше 10.000.000",
                    minTooSmallForOne: "Минимальное значение лимита %{field} должно быть больше либо равно 1",
                    ofDeposit: "депозита",
                    ofPayment: "выплаты",
                    ofReward: "вознаграждения"
                }
            },
            multiSelect: {
                selectAll: "Выбрать все",
                noResultFound: "Нет результатов",
                selectPaymentTypes: "Выберите типы платежей",
                searchPlaceholder: "Поиск..."
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
            configure2fa: "Настроить двухфакторную аутентификацию",
            lightTheme: "Светлая",
            darkTheme: "Тёмная"
        }
    },
    pages: {
        cryptoTransfer: {
            header: "Перевод криптовалюты"
        },
        settings: {
            generalInformation: "Общая информация",
            name: "Имя",
            changePassword: "Сменить пароль",
            login: {
                loginMethod: "Способ входа",
                withPassword: "Вход по паролю",
                withPassAndOtp: "Вход по паролю и одноразовому коду",
                scanQr: "Отсканируйте QR-код для начала генерации одноразовых кодов, которые будут использоваться при входе в аккаунт."
            },
            passChange: {
                passChange: "Смена пароля",
                currentPassowrd: "Текущий пароль",
                newPassword: "Новый пароль",
                repeatNewPassword: "Повторите новый пароль",

                rules: {
                    notLessThanTenSymbols: "Не менее 10 символов",
                    notLessThanOneDigit: "Не менее 1 цифры",
                    notLessThanOneCapital: "Не менее 1 прописной буквы",
                    notLessThanOneLowercase: "Не менее 1 строчной буквы"
                },

                errors: {
                    cantBeEmpty: "Поле не может быть пустым",
                    lenght: "Пароль должен содержать не менее 10 символов",
                    oneUppercase: "Пароль должен содержать хотя бы одну заглавную букву",
                    oneLowercase: "Пароль должен содержать хотя бы одну строчную букву",
                    oneDigit: "Пароль должен содержать хотя бы одну цифру",
                    dontMatch: "Пароли не совпадают",
                    wrongFormat: "Неверный формат пароля",
                    onlyEnglishLetters: "Разрешены только латинские буквы, числа и специальные символы"
                }
            }
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
            errors: {
                name: "Name is required",
                uuid: "Invalid UUID"
            },
            showHeader: "Account info",
            showDescription: "Detailed information about account with ID %{id}",
            balance: "Balance",
            held: "Hold"
        },
        users: {
            name: "Users",
            user: "User",
            edit: "Edit",
            delete: "Delete",
            deleteThisUser: "Delete user?",
            fields: {
                id: "User ID",
                keycloak_id: "User ID",
                name: "Username",
                login: "Login",
                email: "Email",
                merchant: "Merchant",
                roles: "Roles",
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
            createButton: "Add user",
            filter: {
                showAll: "Show all",
                filterByUserId: "Search by user ID",
                filterByUsername: "Search by name",
                filterByUsernamePlaceholder: "Name",
                filterByActivity: "Active users"
            },
            showHeader: "User info",
            showDescription: "Detailed information about user with ID %{id}",
            editUser: "Edit user",
            editSuccessMessage: "The user has been successfully edited",
            create: {
                successMessage: "User %{name} has been successfully created.",
                errorMessage: "Failed to create user",
                merhchantDoesntExist: "The selected merchant was not found",
                usernameInUse: "The chosen username is already taken, please choose another one",
                emailInUse: "The selected email address is already in use",
                wrongRole: "The selected user role does not exist",
                wrongNames: "Invalid format for first name and/or last name"
            },
            deleteMessages: {
                deleteSuccess: "Deleted successfully",
                deleteError: "Failed to delete user"
            },
            roles: {
                admin: "System admin",
                system_manager_for_providers: "Manager for provider integrations on system",
                system_manager_for_merchants: "Manager for merchant integrations on system",
                system_sales_manager: "Sales manager on system",
                system_hos: "Head of sales on system",
                system_operator: "System operator",
                system_supervisor: "System supervisor",
                system_accountant: "System accountant",
                merchant: "Merchant admin",
                merchant_operator: "Merchant operator"
            }
        },
        transactions: {
            name: "Transactions",
            fields: {
                id: "ID",
                created_at: "Created at",
                updated_at: "Updated at",
                committed: "Committed",
                dispute: "Dispute",
                account_id: "Account ID",
                accountBalance: "Account balance",
                amount_value: "Amount",
                currency: "Currency",

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
                        sendAmount: "Amount send"
                    },
                    meta: {
                        caption: "Name"
                    }
                },
                destination: {
                    header: "Merchant",
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
                recipient: "Recipient",
                value: "Value",
                type: "Type",
                feeType: "Fee type",
                history: "History",
                fees: "Fees",
                feeValue: "Fee value",
                sourceValue: "Source value",
                destValue: "Destination value"
            },
            show: {
                statusButton: "Manual change status",
                cancel: "Cancel",
                storno: "Storno",
                commit: "Commit",
                openDispute: "Open dispute",
                closeDispute: "Close dispute",
                disputeOpened: "Disput opened",
                disputeClosed: "Disput closed",
                commitTransaction: "Commit the transaction?",
                sendWebhook: "Send a webhook",
                sendWebhookSuccessMsg: "The webhook for the order %{id} has been successfully sent",
                notFound: "Transaction not found"
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
                dateExceed: "Start/end date cannot be greater than today's date",
                accountField: "Choose merchant account"
            },
            filter: {
                filters: "Filters",
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
                feefromtransaction: "Fee from transaction",
                unknown: "Unknown type",
                undefined: "Unknown type"
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
                cancelledbypayer: "Cancelled by payer",
                cascadefail: "Cascade fail"
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
                idInBlockChain: "Hashlink",
                resend: "Resend"
            },
            download: {
                downloadReportButtonText: "Download report",
                bothError: "Both start date and end date must be selected",
                error: "Error"
            },
            filter: {
                filterById: "Search by ID",
                filterByTrc20: "Search by TRC20 address",
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
                delete: "Delete",
                accuracy: "Accuracy",
                defaultAccuracyPlaceholder: "By default 2"
            },
            errors: {
                code: "Code is required",
                alreadyInUse: "This name is already in use. Choose another one.",
                intOnly: "Input should be a valid integer without fractional part",
                minVal: "Minimum value is 1",
                maxVal: "Maximum value is 16"
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
                directions: "Directions",
                fees: "Fees",
                pays: "PayIn/PayOut"
            },
            errors: {
                id: "ID is required",
                name: "Name is required",
                alreadyInUse: "Merchant with this id or name is already exists.",
                noSpaces: "Spaces are not allowed in this field",
                publicKey: "Wrong public key format",
                required: "Required field",
                notFound: "Merchant %{name} was not found"
            },
            success: {
                create: "Merchant %{name} has been successfully created."
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
            recreateConfirm: "Recreate keys?",
            recreateConfirmDescription: "Old keys will become invalid.",
            recreate: "Recreate",
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
            types: {
                type: "Type",
                universal: "Universal",
                withdraw: "Withdraw",
                deposit: "Deposit"
            },
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
                errorWhenCreating: "An error occurred while creating the fee",
                successDelete: "Fee successfully deleted",
                directionFieldError: "The direction must be selected",
                currencyFieldError: "The currency must be selected",
                valueFieldError: "The commission must be a positive number. For example: 0.1"
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
                noTerminalsError: "Chosen provider does not have any terminals",
                weightError: "Must be an integer in the range from 0 to 1000",
                typeError: "Type must be chosen",
                onlyThirdTypeError: "Currencies are unavailable for chosen type of fee"
            },
            success: {
                create: "Direction %{name} has been successfully created.",
                active: "activated",
                inactive: "deactivated",
                editActivity: "Direction %{name} has been successfully %{state}."
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
            name: "Terminals",
            terminal: "Terminal",
            fields: {
                verbose_name: "Name",
                id: "ID",
                description: "Description",
                provider: "Provider",
                auth: "Auth data",
                fees: "Fees",
                createAccount: "Create account",
                account: "Account",
                details: "Details",
                allocation_timeout_seconds: "Provider response timeout",
                timeout: "Provider timeout",
                pays: "PayIn/PayOut"
            },
            filter: {
                filters: "Filters",
                showAll: "Show all",
                filterAllPlaceholder: "All",
                filterByName: "Terminal"
            },
            errors: {
                verbose_name: "The terminal must have a name",
                description: "The terminal must have a description",
                auth_data_toggle: "To switch the mode, fix the errors",
                key_error: "The key field is required",
                value_error: "The value field is required",
                allocation_timeout_seconds: "Integer values only",
                allocation_timeout_seconds_min: "The minimum value is 1",
                allocation_timeout_seconds_max: "The maximum value is 120"
            },
            success: {
                create: "Terminal %{name} has been successfully created."
            },
            callbackCreating: "Creating callback",
            callbackCreatedSuccessfully: "Callback created successfully",
            urlTemplate: "URL template",
            create: "Create terminal",
            selectHeader: "Provider",
            selectPlaceholder: "Select provider",
            creatingTerminal: "Creating terminal",
            deleteHeader: "Delete terminal?",
            editingTerminal: "Editing terminal",
            accountCreatedSuccessfully: "Счёт успешно создан",
            adapter_nats_subject: "Adapter nats subject"
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
                    toFinishKeys: "Shards remaining to unseal",
                    unsealSuccess: "Storage unsealed successfully",
                    keyPartSuccess: "Part of the key has been entered successfully"
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
                    internalId: "Internal wallet ID",
                    blockchain: "Blockchain",
                    contactType: "Contact type in blockchain",
                    minRemaini: "Minimum remaining amount",
                    balance: "Balance"
                },
                errors: {
                    selectAccount: "Select account",
                    errorWhenEditing: "An error occured when editing wallet",
                    errorWhenCreating: "An error occured when creating wallet",
                    serverError: "Server side error, try again later",
                    alreadyExists: "Wallet with this address is already exists",
                    addressRequired: "Address is required",
                    invalidTRCAddresss: "Invalid TRC20 address",
                    invalidTransactionId: "Invalid TRC20 transaction ID",
                    minBalance: "Minimum value is 0",
                    intOnly: "Input should be a valid integer without fractional part"
                },
                success: {
                    create: "Wallet has been successfully created."
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
                    tx_id: "Hashlink",
                    clickOnHashlink: "Hash (click on hash to open transaction in blockchain explorer)",
                    currency: "Currency",
                    blowfish_id: "Blowfish id",
                    total_fee: "Total fee",
                    bandwidth_fee: "Network fee",
                    confirm: "Confirm",
                    confirmQuestion: "Confirm transaction?",
                    pre_calculated_fee: "Precalculated fee"
                },
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
                notValidAmount: "The amount cannot be more than the balance",
                fields: {
                    scannedAt: "Scanned at",
                    blockTimestamp: "Block timestamp",
                    transactionId: "Transaction ID",
                    sourceAddress: "Source address",
                    destinationAddress: "Destination address",
                    type: "Type",
                    amount: "Amount",
                    currency: "Currency",
                    fiatSwitcher: "Withdrawal via fiat currency",
                    merchantBalance: "Balance",
                    merchantAmount: "Amount"
                }
            }
        },
        callbridge: {
            name: "Incoming Callbacks",
            mapping: {
                name: "Mappings",
                mapping: "Mapping",
                fields: {
                    name: "Name",
                    ext_path: "External url",
                    target: "Target",
                    int_path: "Internal url",
                    description: "Description",
                    created_at: "Created at",
                    callback_url: "Callback URL",
                    terminal: "Terminal",

                    retry_policy: "Retry policy",
                    base_delay: "Base delay",
                    state: "State",
                    active: "Active",
                    disabled: "Active",
                    max_attempts: "Max attempts",
                    strategy: "Strategy",
                    retryOn: "Retrying on status",
                    retryStatusChange: "Edit retry status",
                    newStatus: "New status",
                    enterSepWithCommas: "Enter new statuses separated by commas",

                    wrongFormat: "Invalid data",
                    allowedSymbols: "Only spaces, digits, and commas are allowed",
                    allowedVariant: "Input must be in the format like 400, 404, 500 without extra symbols",

                    security_policy: "Security policy",
                    allowed_ips: "Allowed IPs",
                    auth: "Authorization",
                    auth_required: "Auth required",
                    auth_not_required: "No authorization required",
                    whiteListEdit: "Edit allowed IPs",
                    blackListEdit: "Edit blocked IPs",
                    actDeactButton: "Activate/Deactivate policy",

                    blocked: "Blocked",
                    permitted: "Permitted",
                    blocked_ips: "Blocked IPs",
                    burst_limit: "Burst limit",
                    enforcement_mode: "Enforcement mode",
                    updated_at: "Updated at"
                },
                sec_policy_edit: {
                    editingAllowedPolicy: "Editing the list of allowed addresses",
                    editingBlockedPolicy: "Editing the list of blocked addresses",
                    noIps: "No IP addresses",
                    addIp: "Add IP address",
                    deleteIp: "Delete IP address",
                    errors: {
                        wrongFormatOfIp: "Invalid IPv4 address format",
                        alreadyExists: "The entered IP address is already added",
                        notExist: "This IP address is not listed"
                    },
                    addedSuccessfully: "IP address added",
                    deletedSuccessfully: "IP address deleted",
                    activatePolicy: "Activate policy?",
                    deactivatePolicy: "Deactivate policy?"
                },
                errors: {
                    cantBeEmpty: "Field can't be empty",
                    invalidUrl: "Wrong URL format",
                    errorWhenCreating: "An error occurred while creating mapping"
                },
                create: "Add mapping",
                createSuccess: "Mapping created successfully",
                updateSuccess: "Mapping updated successfully",
                creatingMapping: "Creating mapping",
                deleteMapping: "Delete the mapping?",
                editingMapping: "Edit mapping"
            },
            history: {
                name: "History",
                history: "History",
                callback_id: "Callback ID",
                fields: {
                    request_url: "Request url",
                    original_url: "Original url",
                    mapping_id: "Mapping ID ",
                    created_at: "Created at",
                    status: "Status",
                    trigger_type: "Trigger type"
                },
                callbacksStatus: {
                    retryCallback: "Retry",
                    queued: "Queued",
                    processing: "Processing",
                    success: "Success",
                    error: "Error",
                    sync: "Sync"
                }
            }
        },
        paymentTools: {
            name: "Payment tools",
            paymentType: {
                admin: {
                    name: "Payment types"
                },
                errors: {
                    code: "Code is required",
                    codeRegex: "Code can only contain letters, numbers, underscores, and hyphens"
                },
                name: "Payment types",
                fields: {
                    code: "Title",
                    title: "Description",
                    payment_types: "Payment types",
                    category: "Category",
                    icon: "Icon"
                },
                deletePaymentTypeQuestion: "Delete payment type?",
                creatingPaymentType: "Creating payment type",
                editingPaymentType: "Editing payment type",
                createNew: "Add payment type",
                duplicateCode: "This code is already in use"
            },
            financialInstitution: {
                name: "Financial institutions",
                show: "Financial institution",
                fields: {
                    created_at: "Created at",
                    updated_at: "Updated at",
                    name: "Name of the financial institution",
                    short_name: "Short name",
                    legal_name: "Full legal name",
                    institution_type: "Institution type",
                    country_code: "Country code",
                    bic: "SWIFT BIC",
                    tax_id_number: "Tax identification number",
                    registration_number: "Registration number",
                    nspk_member_id: "NSPK member ID",
                    status: "Activity",
                    payment_types: "Payment types",
                    currencies: "Currencies",
                    currenciesToChoose: "Select currencies",
                    id: "ID",
                    meta: "Metadata",
                    types: {
                        BANK: "Bank",
                        OTHER: "Other"
                    }
                },
                errors: {
                    name: "The name of the financial institution is required",
                    country_code: "The country code is entered incorrectly"
                },
                success: {
                    ACTIVE: "active",
                    INACTIVE: "inactive",
                    editActivity:
                        "The activity of the financial institution %{name} has been successfully changed to: %{state}."
                },

                createFinancialInstitutionBtn: "Create institution",
                createFinancialInstitutionTitle: "Create a financial institution",
                deleteFinancialInstitution: "Delete financial institution?"
            },
            systemPaymentInstruments: {
                name: "System tools",
                show: "System tool",
                fields: {
                    name: "Name",
                    payment_type_code: "Payment type",
                    currency_code: "Currency",
                    financial_institution_id: "Financial institution",
                    direction: "Direction",
                    status: "Status",
                    description: "Description",
                    meta: "Meta"
                },
                list: {
                    createdAt: "Created at",
                    updatedAt: "Updated at",
                    id: "ID",
                    paymentType: "Instrument",
                    financialInstitution: "Financial institution",
                    paymentTypeCode: "Payment type",
                    direction: "Payment direction"
                },
                errors: {
                    cantBeEmpty: "Field can't be empty",
                    nameRegex: "Name can only contain letters, numbers, underscores, and hyphens"
                },
                statuses: {
                    active: "Active",
                    inactive: "Inactive",
                    test_only: "Test only"
                },
                creatingPaymentInstrument: "Creating payment instrument",
                editingPaymentInstrument: "Editing payment instrument",
                createNew: "Add payment instrument",
                deletePaymentInstrumentQuestion: "Delete payment instrument?"
            },
            terminalInstrumentConfigurations: {
                name: "Terminal integrations"
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
                aggregatorProfit: "Aggregator profit",
                totalLoading: "Loading...",
                totalError: "Error while getting total account balance",
                accurateBalance: "Accurate account balance",
                accurateAggregatorProfit: "Accurate aggregator profit",
                settings: "Settings"
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
                cancel: "Cancel",
                areYouSure: "Are you sure you want delete this element?",
                chatWithSupport: "Chat with support",
                close: "Close",
                confirm: "Confirm",
                search: "Search...",
                refresh: "Refresh",
                details: "More detailed",
                generateCallback: "Generate callback",
                clear: "Clear"
            },
            pagination: {
                next: "Next",
                previous: "Previous"
            },
            textField: {
                copied: "Copied"
            },
            toast: {
                success: "Success",
                error: "Error"
            },
            create: {
                createSuccess: "Created successfully",
                createError: "Something went wrong, please try again later"
            },
            delete: {
                deletedSuccessfully: "Deleted successfully"
            },
            edit: {
                editSuccess: "Edited successfully",
                editError: "Something went wrong, please try again later"
            },
            testPopup: {
                attention: "Attention!",
                youReInTestEnv: "You are in a test environment.",
                allActionsSimulated: "All actions are simulated.",
                ok: "Ok!"
            },
            timePickerShow: "Add a time range",
            timePickerErrorTitle: "Enter the correct time interval",
            timePickerErrorDescription: "The data for the day is displayed",
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
                    valueMinMessage: "The minimum value must be greater than zero",
                    create: "Created",
                    successTitle: "The request has been successfully created",
                    successDescription: "You can track her status in the section",
                    errorTitle: "Request creation error",
                    createOrder: "Create order",
                    required: "Required field",
                    noResult: "No methods available",
                    loadingError: "An error has occurred, please contact the administrator.",
                    wordsRegex: "It is allowed to enter Latin letters. Minimum 3 characters, maximum 255",
                    minSymbol: "The field must not be empty",
                    numberRegex: "You can only enter numbers and special characters"
                },
                payoutBanner: {
                    title: "Bank transfer",
                    subtitle: "Your transfer request has been successfully completed!",
                    description:
                        "To complete the transfer, please use the link in the telegram bot. There you will be able to receive up-to-date information about the receipt of funds",
                    closeTitle: "Close the link to the Telegram bot?"
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
                    tryAgain: "Try again",
                    insufficentBalance: "To withdraw cryptocurrency, funds on your USDT balance are required"
                },
                userCreate: {
                    title: "Adding a user",
                    id: "User ID",
                    firstName: "First name",
                    firstNameMessage:
                        "Cyrillic, latin alphabet and special characters are allowed. (:'-.,_@+). Minimum 3 characters, maximum 255",
                    // maxSymbols: "The number of characters must be less than 255",
                    lastName: "Last name",
                    lastNameMessage:
                        "Cyrillic, latin alphabet and special characters are allowed. (:'-.,_@+). Minimum 3 characters, maximum 255",
                    // lastNameMessage: "Please, enter user's last name. Maximum 3 symbols",
                    login: "Login",
                    loginMessage:
                        "Latin alphabet and special characters are allowed. (-,_,@,.). Minimum 3 characters, maximum 255",
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
                    cancelBtn: "Cancel",
                    role: "Role",
                    merchant: "Choose a merchant",
                    activity: {
                        name: "Status",
                        active: "Active",
                        blocked: "Blocked"
                    }
                }
            },
            limits: {
                reward: "Reward",
                payment: "Withdraw",
                deposit: "Deposit",
                limits: "Limits",

                deleteLimits: "Reset limits?",
                reset: "Reset",

                updatedSuccessfully: "Limits updated successfully",
                resetedSuccessfully: "Limits reset successfully",
                errors: {
                    minGreaterThanMax: "The maximum value of %{field} limit cannot be less than the minimum value",
                    maxTooSmall: "The maximum value of %{field} limit must be 0 or greater than 1",
                    minTooSmall: "The minimum value of %{field} limit must be 0 or greater than 1",
                    maxTooLarge: "The maximum value of %{field} limit cannot be greater than 10,000,000",
                    minTooSmallForOne: "The minimum value of %{field} limit must be 1 or greater",
                    ofDeposit: "deposit",
                    ofPayment: "payment",
                    ofReward: "reward"
                }
            },
            multiSelect: {
                selectAll: "Select all",
                noResultFound: "No results found.",
                selectPaymentTypes: "Select payment types",
                searchPlaceholder: "Search..."
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
            configure2fa: "Configure Two-factor auth",
            lightTheme: "Light",
            darkTheme: "Dark"
        }
    },
    pages: {
        cryptoTransfer: {
            header: "Crypto Wallet Transfer"
        },
        settings: {
            generalInformation: "General information",
            name: "Name",
            changePassword: "Change password",
            login: {
                loginMethod: "Login method",
                withPassword: "Login with passoword",
                withPassAndOtp: "Login with passoword and OTP",
                scanQr: "Scan the QR code to start generating OTPs that will be used to log into your account."
            },
            passChange: {
                passChange: "Change Password",
                currentPassowrd: "Current Password",
                newPassword: "New Password",
                repeatNewPassword: "Repeat New Password",

                rules: {
                    notLessThanTenSymbols: "At least 10 characters",
                    notLessThanOneDigit: "At least 1 digit",
                    notLessThanOneCapital: "At least 1 uppercase letter",
                    notLessThanOneLowercase: "At least 1 lowercase letter"
                },

                errors: {
                    cantBeEmpty: "Field can't be empty",
                    lenght: "Password must be at least 10 characters long",
                    oneUppercase: "Password must contain at least one uppercase letter",
                    oneLowercase: "Password must contain at least one lowercase letter",
                    oneDigit: "Password must contain at least one digit",
                    dontMatch: "Passwords don't match",
                    wrongFormat: "Invalid password format",
                    onlyEnglishLetters: "Only Latin letters, numbers, and special characters are allowed."
                }
            }
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
