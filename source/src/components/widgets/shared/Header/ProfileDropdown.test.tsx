import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ProfileDropdown } from "./ProfileDropdown";

jest.mock("react-admin", () => ({
    useGetIdentity: () => ({ data: { fullName: "John Doe", email: "john@example.com" } }),
    usePermissions: () => ({ permissions: "merchant" }),
    useTranslate: () => (key: string) => key,
    addRefreshAuthToDataProvider: (provider: string) => provider
}));

jest.mock("@tanstack/react-query", () => ({
    useQuery: () => ({
        isLoading: false,
        data: [
            {
                currency: "USD",
                value: { quantity: 1000, accuracy: 2 },
                holds: { quantity: 0, accuracy: 2 }
            }
        ]
    })
}));

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    useNavigate: () => mockNavigate
}));

jest.mock("@/data/i18nFolder", () => ({
    messages: {
        en: {},
        ru: {}
    }
}));

describe("ProfileDropdown", () => {
    const mockLogout = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("рендерит аватар и баланс", () => {
        render(<ProfileDropdown handleLogout={mockLogout} />);
        expect(screen.getByTestId("profile-avatar")).toBeInTheDocument();
        expect(screen.getByText("500.00")).toBeInTheDocument();
    });

    it("открывает и закрывает дропдаун по клику", () => {
        render(<ProfileDropdown handleLogout={mockLogout} />);
        const trigger = screen.getByTestId("profile-avatar").closest("div")!;
        fireEvent.click(trigger);
        expect(screen.getByText("app.ui.header.settings")).toBeInTheDocument();
        expect(screen.getByText("app.ui.roles.merchant")).toBeInTheDocument();

        fireEvent.click(trigger);
        waitFor(() => expect(screen.queryByText("app.ui.header.settings")).not.toBeInTheDocument());
    });

    it("закрывается по Escape", () => {
        render(<ProfileDropdown handleLogout={mockLogout} />);
        const trigger = screen.getByTestId("profile-avatar").closest("div")!;
        fireEvent.click(trigger);
        expect(screen.getByText("app.ui.header.settings")).toBeInTheDocument();

        fireEvent.keyDown(document, { key: "Escape" });
        waitFor(() => expect(screen.queryByText("app.ui.header.settings")).not.toBeInTheDocument());
    });

    it("вызывает handleLogout при нажатии Logout", () => {
        render(<ProfileDropdown handleLogout={mockLogout} />);
        const trigger = screen.getByTestId("profile-avatar").closest("div")!;
        fireEvent.click(trigger);

        fireEvent.click(screen.getByText("app.login.logout"));
        expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it("навигация в настройки закрывает дропдаун", () => {
        render(<ProfileDropdown handleLogout={mockLogout} />);
        const trigger = screen.getByTestId("profile-avatar").closest("div")!;
        fireEvent.click(trigger);

        fireEvent.click(screen.getByText("app.ui.header.settings"));
        expect(mockNavigate).toHaveBeenCalledWith("/settings");
        waitFor(() => expect(screen.queryByText("app.ui.header.settings")).not.toBeInTheDocument());
    });
});
