/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LoginForm } from "./LoginForm";

const mockLogin = jest.fn();
const mockRefetch = jest.fn();
const mockTranslate = (key: string) => key;

jest.mock("react-admin", () => ({
    useLogin: () => mockLogin,
    useAuthState: () => ({ refetch: mockRefetch }),
    useTranslate: () => mockTranslate
}));

jest.mock("@/components/providers", () => ({
    useTheme: () => ({ theme: "light" })
}));

const setup = (props?: Partial<React.ComponentProps<typeof LoginForm>>) => {
    const setError = jest.fn();
    const setDialogOpen = jest.fn();
    const defaultProps = { error: "", setError, setDialogOpen };
    render(<LoginForm {...defaultProps} {...props} />);
    return { setError, setDialogOpen };
};

const deferred = () => {
    let resolve!: (v?: unknown) => void;
    const p = new Promise(res => {
        resolve = res;
    });
    return { promise: p, resolve };
};

describe("LoginForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("рендерит логотип и поля", () => {
        setup();

        expect(screen.getByAltText("Logo")).toBeInTheDocument();
        expect(screen.getByText("app.login.usernameOrEmail").parentElement!.querySelector("input")).toBeInTheDocument();
        expect(screen.getByText("app.login.password").parentElement!.querySelector("input")).toBeInTheDocument();
        expect(screen.getByText("app.login.totp").parentElement!.querySelector("input")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "app.login.login" })).toBeEnabled();
    });

    it("ссылка на 2FA корректно формируется", () => {
        setup();

        const link = screen.getByText("app.login.configure2fa") as HTMLAnchorElement;
        expect(link.href).toContain(process.env.VITE_KEYCLOAK_REALM);
        expect(link.href).toContain(process.env.VITE_KEYCLOAK_URL);
        expect(link.href).toContain(process.env.VITE_KEYCLOAK_CLIENT_ID);
    });

    it("очищает error при вводе", async () => {
        const { setError } = setup({ error: "Ошибка" });

        fireEvent.change(screen.getByText("app.login.usernameOrEmail").parentElement!.querySelector("input")!, {
            target: { value: "john" }
        });

        expect(setError).toHaveBeenCalledWith("");
    });

    it("успешный сабмит вызывает login и refetch", async () => {
        mockLogin.mockResolvedValueOnce(undefined);
        setup();

        fireEvent.change(screen.getByText("app.login.usernameOrEmail").parentElement!.querySelector("input")!, {
            target: { value: "john" }
        });
        fireEvent.change(screen.getByText("app.login.password").parentElement!.querySelector("input")!, {
            target: { value: "secret" }
        });
        fireEvent.click(screen.getByRole("button", { name: "app.login.login" }));

        await waitFor(() => expect(mockLogin).toHaveBeenCalled());
        await waitFor(() => expect(mockRefetch).toHaveBeenCalled());
    });

    it("ошибка 401 → setError(logPassError)", async () => {
        mockLogin.mockRejectedValueOnce({ status: 401 });
        const { setError } = setup();

        fireEvent.change(screen.getByText("app.login.usernameOrEmail").parentElement!.querySelector("input")!, {
            target: { value: "john" }
        });
        fireEvent.change(screen.getByText("app.login.password").parentElement!.querySelector("input")!, {
            target: { value: "bad" }
        });
        fireEvent.click(screen.getByRole("button", { name: "app.login.login" }));

        await waitFor(() => expect(setError).toHaveBeenCalledWith("app.login.logPassError"));
    });

    it("ошибка 400 invalid_grant not fully → accountError + открывает диалог", async () => {
        mockLogin.mockRejectedValueOnce({
            status: 400,
            body: { error: "invalid_grant", error_description: "not fully configured" }
        });
        const { setError, setDialogOpen } = setup();

        fireEvent.change(screen.getByText("app.login.usernameOrEmail").parentElement!.querySelector("input")!, {
            target: { value: "john" }
        });
        fireEvent.change(screen.getByText("app.login.password").parentElement!.querySelector("input")!, {
            target: { value: "secret" }
        });
        fireEvent.click(screen.getByRole("button", { name: "app.login.login" }));

        await waitFor(() => expect(setError).toHaveBeenCalledWith("app.login.accountError"));
        expect(setDialogOpen).toHaveBeenCalledWith(true);
    });

    it("прочая ошибка → networkError", async () => {
        mockLogin.mockRejectedValueOnce({ status: 500 });
        const { setError } = setup();

        fireEvent.change(screen.getByText("app.login.usernameOrEmail").parentElement!.querySelector("input")!, {
            target: { value: "john" }
        });
        fireEvent.change(screen.getByText("app.login.password").parentElement!.querySelector("input")!, {
            target: { value: "secret" }
        });
        fireEvent.click(screen.getByRole("button", { name: "app.login.login" }));

        await waitFor(() => expect(setError).toHaveBeenCalledWith("app.login.networkError"));
    });

    it("даблклик не вызывает повторный login до завершения первого", async () => {
        const d = deferred();
        mockLogin.mockImplementation(() => d.promise);
        setup();

        fireEvent.change(screen.getByText("app.login.usernameOrEmail").parentElement!.querySelector("input")!, {
            target: { value: "john" }
        });
        fireEvent.change(screen.getByText("app.login.password").parentElement!.querySelector("input")!, {
            target: { value: "secret" }
        });

        const btn = screen.getByRole("button", { name: "app.login.login" });
        fireEvent.click(btn);
        fireEvent.click(btn);

        expect(mockLogin).toHaveBeenCalledTimes(1);
        d.resolve();
        await waitFor(() => expect(btn).toBeEnabled());
    });
});
