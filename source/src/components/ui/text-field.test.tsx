import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAppToast } from "./toast/useAppToast";
import { useTranslate } from "react-admin";
import { TextField } from "./text-field";

jest.mock("./toast/useAppToast");
jest.mock("react-admin", () => ({
    useTranslate: jest.fn()
}));

Object.assign(navigator, {
    clipboard: {
        writeText: jest.fn()
    }
});

const mockUseAppToast = useAppToast as jest.MockedFunction<typeof useAppToast>;
const mockUseTranslate = useTranslate as jest.MockedFunction<typeof useTranslate>;

describe("TextField", () => {
    const mockToast = jest.fn();
    const mockTranslate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseAppToast.mockReturnValue(mockToast);
        mockUseTranslate.mockReturnValue(mockTranslate);
        mockTranslate.mockImplementation(key => {
            if (key === "app.ui.textField.copied") return "Скопировано";
            return key;
        });
    });

    const renderTextField = (props = {}) => {
        const defaultProps = {
            text: "Test text content",
            label: "Test Label"
        };
        return render(<TextField {...defaultProps} {...props} />);
    };

    describe("1. Базовое отображение", () => {
        it("1.1. Отображает текст и лейбл", () => {
            renderTextField();

            expect(screen.getByText("Test Label")).toBeInTheDocument();
            expect(screen.getByText("Test text content")).toBeInTheDocument();
        });

        it('1.2. Отображает "-" при пустом тексте', () => {
            renderTextField({ text: "" });

            expect(screen.getByText("-")).toBeInTheDocument();
        });

        it("1.3. Не отображает лейбл если не передан", () => {
            renderTextField({ label: undefined });

            expect(screen.queryByText("Test Label")).not.toBeInTheDocument();
        });
    });

    describe("2. Типы отображения", () => {
        it('2.1. Отображает обычный текст при type="text"', () => {
            renderTextField({ type: "text" });

            expect(screen.getByText("Test text content")).toBeInTheDocument();
            expect(screen.queryByRole("link")).not.toBeInTheDocument();
        });

        it('2.2. Отображает ссылку при type="link"', () => {
            renderTextField({
                type: "link",
                link: "https://example.com"
            });

            const link = screen.getByRole("link");
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute("href", "https://example.com");
            expect(link).toHaveAttribute("target", "_blank");
            expect(link).toHaveAttribute("rel", "noreferrer");
        });

        it('2.3. Отображает секретный текст при type="secret"', () => {
            renderTextField({ type: "secret" });

            const dots = screen.getAllByRole("generic");
            expect(dots.length).toBeGreaterThan(0);
            expect(screen.queryByText("Test text content")).not.toBeInTheDocument();
        });
    });

    describe("3. Функциональность копирования", () => {
        it("3.1. Не отображает иконку копирования когда copyValue=false", () => {
            renderTextField({ copyValue: false });

            expect(screen.queryByTestId("copy-icon")).not.toBeInTheDocument();
        });

        it("3.2. Отображает иконку копирования когда copyValue=true и текст не пустой", () => {
            renderTextField({ copyValue: true });

            expect(screen.getByTestId("copy-icon")).toBeInTheDocument();
        });

        it("3.3. Не отображает иконку копирования при пустом тексте", () => {
            renderTextField({ text: "", copyValue: true });

            expect(screen.queryByTestId("copy-icon")).not.toBeInTheDocument();
        });

        it("3.4. Копирует текст в буфер обмена при клике на иконку", async () => {
            renderTextField({ copyValue: true });

            const copyIcon = screen.getByTestId("copy-icon");
            await userEvent.click(copyIcon);

            expect(navigator.clipboard.writeText).toHaveBeenCalledWith("Test text content");
            expect(mockToast).toHaveBeenCalledWith("success", "", "Скопировано");
        });

        it("3.5. Правильные классы для иконки копирования в разных типах", () => {
            const { rerender } = renderTextField({
                copyValue: true,
                type: "text"
            });

            let copyIcon = screen.getByTestId("copy-icon");
            expect(copyIcon).not.toHaveClass("text-green-50");

            rerender(<TextField text="test" copyValue={true} type="link" />);
            copyIcon = screen.getByTestId("copy-icon");
            expect(copyIcon).toHaveClass("text-green-50");
        });
    });

    describe("4. Обработка кликов", () => {
        it("4.1. Вызывает onClick при клике на текст", async () => {
            const handleClick = jest.fn();
            renderTextField({ onClick: handleClick });

            const textElement = screen.getByText("Test text content");
            await userEvent.click(textElement);

            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it("4.2. Вызывает onDoubleClick при двойном клике", async () => {
            const handleDoubleClick = jest.fn();
            renderTextField({ onDoubleClick: handleDoubleClick });

            const textElement = screen.getByText("Test text content");
            await userEvent.dblClick(textElement);

            expect(handleDoubleClick).toHaveBeenCalledTimes(1);
        });

        it("4.3. Добавляет классы для кликабельных элементов", () => {
            renderTextField({ onClick: jest.fn() });

            const textElement = screen.getByText("Test text content");
            expect(textElement).toHaveClass("cursor-pointer !text-green-50");
        });
    });

    describe("5. Стилизация и классы", () => {
        it("5.1. Применяет переданные className", () => {
            renderTextField({ className: "custom-class" });

            const container = screen.getByText("Test text content").parentElement;
            expect(container).toHaveClass("custom-class");
        });

        it("5.2. Применяет правильные классы для разных fontSize", () => {
            renderTextField({ fontSize: "title-2" });

            const textElement = screen.getByText("Test text content");
            expect(textElement).toHaveClass("title-2");
        });

        it("5.3. Применяет правильные классы для wrap вариантов", () => {
            const { rerender } = renderTextField({ wrap: true });
            let textElement = screen.getByText("Test text content");
            expect(textElement).toHaveClass("ellipsis");

            rerender(<TextField text="test" wrap="break-all" />);
            textElement = screen.getByText("test");
            expect(textElement).toHaveClass("break-all");

            rerender(<TextField text="test" wrap={false} />);
            textElement = screen.getByText("test");
            expect(textElement).toHaveClass("truncate");
        });

        it("5.4. Применяет lineClamp стили когда включено", () => {
            renderTextField({
                lineClamp: true,
                linesCount: 2,
                minWidth: "200px",
                maxWidth: "300px"
            });

            const textElement = screen.getByText("Test text content");
            expect(textElement).toHaveStyle(
                "display: -webkit-box; overflow: hidden; -webkit-line-clamp: 2; word-break: break-all; text-wrap: wrap; max-width: 300px; min-width: 200px;"
            );
        });
    });

    describe("6. Edge cases и валидация", () => {
        it("6.1. Корректно обрабатывает очень длинный текст", () => {
            const longText = "a".repeat(1000);
            renderTextField({ text: longText });

            expect(screen.getByText(longText)).toBeInTheDocument();
        });

        it("6.2. Корректно обрабатывает специальные символы", () => {
            const specialText = "Test & < > \" ' ` text";
            renderTextField({ text: specialText });

            expect(screen.getByText(specialText)).toBeInTheDocument();
        });

        it("6.3. Не ломается при undefined/null значениях", () => {
            renderTextField({ text: undefined });

            expect(screen.getByText("-")).toBeInTheDocument();
        });
    });

    describe("7. Accessibility", () => {
        it("7.1. Ссылка имеет правильные атрибуты доступности", () => {
            renderTextField({ type: "link", link: "https://example.com" });

            const link = screen.getByRole("link");
            expect(link).toHaveAttribute("target", "_blank");
            expect(link).toHaveAttribute("rel", "noreferrer");
        });

        it("7.2. Иконка копирования имеет cursor-pointer класс", () => {
            renderTextField({ copyValue: true });

            const copyIcon = screen.getByTestId("copy-icon");
            expect(copyIcon).toHaveClass("cursor-pointer");
        });
    });

    describe("8. Интеграционные тесты", () => {
        it("8.1. Сочетание нескольких пропсов работает корректно", () => {
            renderTextField({
                type: "link",
                copyValue: true,
                lineClamp: true,
                onClick: jest.fn(),
                className: "test-class"
            });

            expect(screen.getByRole("link")).toBeInTheDocument();
            expect(screen.getByTestId("copy-icon")).toBeInTheDocument();
        });

        it("8.2. Все обработчики событий работают вместе", async () => {
            const handleClick = jest.fn();
            const handleDoubleClick = jest.fn();

            renderTextField({
                onClick: handleClick,
                onDoubleClick: handleDoubleClick,
                copyValue: true
            });

            const textElement = screen.getByText("Test text content");
            const copyIcon = screen.getByTestId("copy-icon");

            await userEvent.click(textElement);
            await userEvent.dblClick(textElement);
            await userEvent.click(copyIcon);

            expect(handleClick).toHaveBeenCalledTimes(3);
            expect(handleDoubleClick).toHaveBeenCalledTimes(1);
            expect(navigator.clipboard.writeText).toHaveBeenCalled();
        });
    });
});
