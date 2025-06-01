import polyglotI18nProvider from "ra-i18n-polyglot";
import { messages } from "./i18nFolder";
type Locale = "en" | "ru";

export const i18nProvider = polyglotI18nProvider(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    (locale: Locale) => messages[locale],
    (localStorage.getItem("i18nextLng") as Locale) ?? "en",
    [
        { locale: "ru", name: "Русский" },
        { locale: "en", name: "English" }
    ],
    { allowMissing: true }
);
