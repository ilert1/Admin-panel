import { render, screen } from "@testing-library/react";
import { BalanceDisplay } from "./BalanceDisplay";

jest.mock("react-admin", () => ({
    useTranslate: () => (key: string) => key
}));

describe("BalanceDisplay", () => {
    const mockIdentity = { id: "test", fullName: "Test User" };

    const mockTotalAmount = [
        {
            currency: "USD",
            value: { quantity: 2000, accuracy: 2 },
            holds: { quantity: 200, accuracy: 2 }
        }
    ];

    it("рендерит имя пользователя", () => {
        render(
            <BalanceDisplay
                totalAmount={mockTotalAmount}
                isMerchant={true}
                identity={mockIdentity}
                totalLoading={false}
            />
        );
        expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    it("показывает валюту и значение", () => {
        render(
            <BalanceDisplay
                totalAmount={mockTotalAmount}
                isMerchant={true}
                identity={mockIdentity}
                totalLoading={false}
            />
        );
        expect(screen.getByText("1 000.00")).toBeInTheDocument();
    });

    it("показывает лоадер, если totalLoading=true", () => {
        render(
            <BalanceDisplay totalAmount={undefined} isMerchant={true} identity={mockIdentity} totalLoading={true} />
        );
        expect(screen.getByText("app.ui.header.totalLoading")).toBeInTheDocument();
    });
});
