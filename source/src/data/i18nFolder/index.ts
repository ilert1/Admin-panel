/* eslint-disable @typescript-eslint/no-explicit-any */
function loadEnMessages() {
    const files = import.meta.glob(`./en/**/*.json`, { eager: true });
    const messages: Record<string, string> = {};

    for (const path in files) {
        Object.assign(messages, (files[path] as any).default);
    }

    return messages;
}
function loadRuMessages() {
    const files = import.meta.glob(`./ru/**/*.json`, { eager: true });
    const messages: Record<string, string> = {};

    for (const path in files) {
        Object.assign(messages, (files[path] as any).default);
    }

    return messages;
}

export const messages: Record<"en" | "ru", Record<string, string>> = {
    en: loadEnMessages(),
    ru: loadRuMessages()
};
