import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

const mockSetLocale = jest.fn();
let currentLocale = "en";
const mockUseLocaleState = () => [currentLocale, mockSetLocale] as const;
const mockGetLocales = jest.fn(() => [
    { locale: "en", name: "English" },
    { locale: "ru", name: "Русский" }
]);

jest.mock("react-admin", () => ({
    useLocaleState: () => mockUseLocaleState(),
    useI18nProvider: () => ({ getLocales: mockGetLocales })
}));

import { LangSwitcher } from "./LangSwitcher";

const setup = () => {
    localStorage.clear();
    return render(<LangSwitcher />);
};

describe("LangSwitcher", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        currentLocale = "en";
    });

    it("показывает текущий язык в аватаре", () => {
        setup();
        expect(screen.getByText("EN")).toBeInTheDocument();
    });

    it("открывает меню по клику и показывает список локалей", async () => {
        setup();
        const user = userEvent.setup();
        await user.click(screen.getByText("EN"));

        expect(await screen.findByText("English")).toBeInTheDocument();
        expect(screen.getByText("Русский")).toBeInTheDocument();
    });

    it("меняет локаль при выборе нового языка", async () => {
        setup();
        const user = userEvent.setup();
        await user.click(screen.getByText("EN"));
        await user.click(await screen.findByText("Русский"));

        expect(localStorage.getItem("i18nextLng")).toBe("ru");
        expect(mockSetLocale).toHaveBeenCalledWith("ru");
    });

    it("не вызывает setLocale, если выбран тот же язык", async () => {
        setup();
        const user = userEvent.setup();
        await user.click(screen.getByText("EN"));
        await user.click(await screen.findByText("English"));

        expect(mockSetLocale).not.toHaveBeenCalled();
    });

    it("аватар меняет классы при открытии/закрытии меню", async () => {
        setup();
        const avatar = document.querySelector('[type="button"]')!;
        expect(avatar.className).toContain("border-neutral-50");

        fireEvent.keyDown(screen.getByText("EN"), {
            key: " "
        });
        expect(await screen.findByText("English")).toBeInTheDocument();
        expect(avatar.className).toContain("border-green-20");
    });
});
