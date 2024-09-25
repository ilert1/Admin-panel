const messages = [
    {
        text: "Привет! Здесь можно задать любой вопрос",
        icon: true,
        isUserMessage: false
    },
    {
        text: "Как узнать статус перевода?",
        icon: false,
        isUserMessage: true
    },
    {
        text: "Вы можете перейти в раздел “История операций” в боковом меню и увидеть статус всех операций",
        icon: true,
        isUserMessage: false
    },
    {
        text: "Какой статус по операции ID 552041c7-5404-466d-8c23-1553a2?",
        icon: false,
        isUserMessage: true
    },
    {
        text: "Операция ID 552041c7-5404-466d-8c23-1553a2 “Вознаграждение” имеет статус “Выполняется”",
        icon: true,
        isUserMessage: false
    },
    {
        text: "У Вас есть ещё вопросы?",
        icon: true,
        isUserMessage: false
    },
    {
        text: "У Вас есть ещё вопросы?",
        icon: true,
        isUserMessage: false
    },
    {
        text: "У Вас есть ещё вопросы?",
        icon: true,
        isUserMessage: false
    }
];

export function getMockMessages() {
    return messages;
}
