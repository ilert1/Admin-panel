import { render, act, waitFor } from "@testing-library/react";
import { SheetProvider, useSheets } from "./SheetProvider";
import { useCheckAuth } from "react-admin";

jest.mock("react-admin", () => ({
    useCheckAuth: jest.fn()
}));

jest.mock("./SheetManager", () => ({
    SHEETS_COMPONENTS: {
        account: jest.fn(),
        direction: jest.fn(),
        merchant: jest.fn(),
        user: jest.fn(),
        transaction: jest.fn(),
        provider: jest.fn(),
        terminal: jest.fn(),
        wallet: jest.fn(),
        walletLinked: jest.fn(),
        walletTransactions: jest.fn(),
        callbridgeMappings: jest.fn(),
        callbridgeHistory: jest.fn(),
        financialInstitution: jest.fn(),
        terminalPaymentInstruments: jest.fn(),
        systemPaymentInstrument: jest.fn()
    }
}));

describe("SheetProvider", () => {
    const mockCheckAuth = jest.fn();
    const TestComponent = () => {
        const { sheets, openSheet, closeSheet, closeAllSheets } = useSheets();
        return (
            <div>
                <div data-testid="sheets-count">{sheets.length}</div>
                <button onClick={() => openSheet("account", { id: "123" })}>Open Account</button>
                <button onClick={() => closeSheet("account")}>Close Account</button>
                <button onClick={closeAllSheets}>Close All</button>
            </div>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useCheckAuth as jest.Mock).mockReturnValue(mockCheckAuth);
        mockCheckAuth.mockResolvedValue(undefined);
    });

    it("renders children and provides context", () => {
        const { getByTestId } = render(
            <SheetProvider>
                <TestComponent />
            </SheetProvider>
        );

        expect(getByTestId("sheets-count")).toHaveTextContent("0");
    });

    it("throws error when useSheets is used outside provider", () => {
        const TestWithoutProvider = () => {
            try {
                useSheets();
                return <div>No error</div>;
            } catch (error) {
                return <div>Error caught</div>;
            }
        };

        const { getByText } = render(<TestWithoutProvider />);
        expect(getByText("Error caught")).toBeInTheDocument();
    });

    it("opens sheet after successful auth check", async () => {
        const { getByText, getByTestId } = render(
            <SheetProvider>
                <TestComponent />
            </SheetProvider>
        );

        await act(async () => {
            getByText("Open Account").click();
        });

        expect(mockCheckAuth).toHaveBeenCalled();
        expect(getByTestId("sheets-count")).toHaveTextContent("1");
    });

    it("does not open sheet when auth check fails", async () => {
        mockCheckAuth.mockRejectedValue(new Error("Auth failed"));

        const { getByText, getByTestId } = render(
            <SheetProvider>
                <TestComponent />
            </SheetProvider>
        );

        await act(async () => {
            getByText("Open Account").click();
        });

        expect(mockCheckAuth).toHaveBeenCalled();
        expect(getByTestId("sheets-count")).toHaveTextContent("0");
    });

    it("closes specific sheet", async () => {
        const { getByText, getByTestId } = render(
            <SheetProvider>
                <TestComponent />
            </SheetProvider>
        );

        await act(async () => {
            getByText("Open Account").click();
        });
        expect(getByTestId("sheets-count")).toHaveTextContent("1");

        await act(async () => {
            getByText("Close Account").click();
        });

        waitFor(() => expect(getByTestId("sheets-count")).toHaveTextContent("0"));
    });

    it("closes all sheets", async () => {
        const { getByText, getByTestId } = render(
            <SheetProvider>
                <TestComponent />
            </SheetProvider>
        );

        await act(async () => {
            getByText("Open Account").click();
        });
        expect(getByTestId("sheets-count")).toHaveTextContent("1");

        await act(async () => {
            getByText("Close All").click();
        });

        waitFor(() => expect(getByTestId("sheets-count")).toHaveTextContent("0"));
    });

    it("handles multiple sheets of same type", async () => {
        const TestMultiple = () => {
            const { sheets, openSheet } = useSheets();
            return (
                <div>
                    <div data-testid="sheets-count">{sheets.length}</div>
                    <button onClick={() => openSheet("account", { id: "1" })}>Open First</button>
                    <button onClick={() => openSheet("account", { id: "2" })}>Open Second</button>
                </div>
            );
        };

        const { getByText, getByTestId } = render(
            <SheetProvider>
                <TestMultiple />
            </SheetProvider>
        );

        await act(async () => {
            getByText("Open First").click();
        });
        expect(getByTestId("sheets-count")).toHaveTextContent("1");

        await act(async () => {
            getByText("Open Second").click();
        });
        expect(getByTestId("sheets-count")).toHaveTextContent("2");
    });

    it("provides correct sheet data structure", async () => {
        const TestData = () => {
            const { sheets, openSheet } = useSheets();
            return (
                <div>
                    <div data-testid="sheets-count">{sheets.length}</div>
                    <div data-testid="sheet-data">{sheets[0]?.data.id}</div>
                    <button
                        onClick={() => openSheet("merchant", { id: "merchant-123", merchantName: "Test Merchant" })}>
                        Open Merchant
                    </button>
                </div>
            );
        };

        const { getByText, getByTestId } = render(
            <SheetProvider>
                <TestData />
            </SheetProvider>
        );

        await act(async () => {
            getByText("Open Merchant").click();
        });

        expect(getByTestId("sheet-data")).toHaveTextContent("merchant-123");
    });

    it("handles different sheet types with correct data shapes and close all", async () => {
        const TestVariousSheets = () => {
            const { sheets, openSheet, closeAllSheets } = useSheets();
            return (
                <div>
                    <div data-testid="sheets-count">{sheets.length}</div>
                    <button onClick={() => openSheet("user", { id: "user-1" })}>Open User</button>
                    <button onClick={() => openSheet("transaction", { id: "txn-1" })}>Open Transaction</button>
                    <button onClick={closeAllSheets}>Close All</button>
                </div>
            );
        };

        const { getByText, getByTestId } = render(
            <SheetProvider>
                <TestVariousSheets />
            </SheetProvider>
        );

        await act(async () => {
            getByText("Open User").click();
        });
        expect(getByTestId("sheets-count")).toHaveTextContent("1");

        await act(async () => {
            getByText("Open Transaction").click();
        });
        expect(getByTestId("sheets-count")).toHaveTextContent("2");

        await act(async () => {
            getByText("Close All").click();
        });

        waitFor(() => expect(getByTestId("sheets-count")).toHaveTextContent("0"));
    });
});
