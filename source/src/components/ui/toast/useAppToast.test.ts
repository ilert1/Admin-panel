import { renderHook } from "@testing-library/react";
import { useAppToast } from "./useAppToast";
import { toast } from "sonner";

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn()
    }
}));

jest.mock("react-admin", () => ({
    useTranslate: () => (key: string) => key
}));

describe("useAppToast", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("возвращает функцию", () => {
        const { result } = renderHook(() => useAppToast());
        expect(typeof result.current).toBe("function");
    });

    it("вызов с success без title использует перевод", () => {
        const { result } = renderHook(() => useAppToast());
        result.current("success", "Описание");
        expect(toast.success).toHaveBeenCalledWith("app.ui.toast.success", {
            description: "Описание",
            dismissible: true,
            duration: 3000
        });
    });

    it("вызов с error без title использует перевод", () => {
        const { result } = renderHook(() => useAppToast());
        result.current("error", "Ошибка");
        expect(toast.error).toHaveBeenCalledWith("app.ui.toast.error", {
            description: "Ошибка",
            dismissible: true,
            duration: 3000
        });
    });

    it("можно передать кастомный title и duration", () => {
        const { result } = renderHook(() => useAppToast());
        result.current("success", "Описание", "Мой Title", 5000);
        expect(toast.success).toHaveBeenCalledWith("Мой Title", {
            description: "Описание",
            dismissible: true,
            duration: 5000
        });
    });
});
