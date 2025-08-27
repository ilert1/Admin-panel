import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CryptoTransferForm } from "./CryptoTransferForm";
import { useTranslate, useDataProvider } from "react-admin";
import { useAbortableInfiniteGetList } from "@/hooks/useAbortableInfiniteGetList";
import { useQuery } from "@tanstack/react-query";
import { useAppToast } from "@/components/ui/toast/useAppToast";

jest.mock("react-admin", () => ({
    useDataProvider: jest.fn(),
    useTranslate: jest.fn(),
    addRefreshAuthToDataProvider: jest.fn()
}));

jest.mock("@/hooks/useAbortableInfiniteGetList", () => ({
    useAbortableInfiniteGetList: jest.fn()
}));

jest.mock("@tanstack/react-query", () => ({
    useQuery: jest.fn()
}));

jest.mock("@/components/ui/toast/useAppToast", () => ({
    useAppToast: jest.fn()
}));

jest.mock("@/data/i18nFolder", () => ({
    messages: {
        en: {},
        ru: {}
    }
}));

jest.mock("@hookform/resolvers/zod", () => ({
    zodResolver: jest.fn()
}));

describe("CryptoTransferForm", () => {
    const mockTranslate = jest.fn();
    const mockDataProvider = { getList: jest.fn() };
    const mockAppToast = jest.fn();
    const mockUseAbortableInfiniteGetList = jest.fn();
    const mockUseQuery = jest.fn();

    const defaultProps = {
        loading: false,
        balance: 100,
        transferState: "process" as const,
        setTransferState: jest.fn(),
        create: jest.fn(),
        showMessage: "",
        repeatData: undefined
    };

    beforeEach(() => {
        jest.clearAllMocks();

        (useTranslate as jest.Mock).mockReturnValue(mockTranslate);
        (useDataProvider as jest.Mock).mockReturnValue(mockDataProvider);
        (useAppToast as jest.Mock).mockReturnValue(mockAppToast);
        (useAbortableInfiniteGetList as jest.Mock).mockReturnValue(mockUseAbortableInfiniteGetList);
        (useQuery as jest.Mock).mockReturnValue(mockUseQuery);

        mockTranslate.mockImplementation((key: string, params?: { amount: number }) => {
            const translations: Record<string, string> = {
                "app.widgets.forms.cryptoTransfer.addressMessage": "Invalid address format",
                "app.widgets.forms.cryptoTransfer.nan": "Not a number",
                "app.widgets.forms.cryptoTransfer.amountMinMessage": "Minimum amount is 2",
                "app.widgets.forms.cryptoTransfer.amountMaxMessage": `Maximum amount is ${params?.amount || 100}`,
                "app.widgets.forms.cryptoTransfer.insufficentBalance": "Insufficient balance",
                "app.widgets.forms.cryptoTransfer.address": "Address",
                "app.widgets.forms.cryptoTransfer.amount": "Amount",
                "app.widgets.forms.cryptoTransfer.allAmount": "All amount",
                "app.widgets.forms.cryptoTransfer.commission": "Commission",
                "app.widgets.forms.cryptoTransfer.totalAmount": "Total amount",
                "app.widgets.forms.cryptoTransfer.createTransfer": "Create transfer",
                "app.widgets.forms.cryptoTransfer.successButton": "Success",
                "app.widgets.forms.cryptoTransfer.errorButton": "Error",
                "app.widgets.forms.cryptoTransfer.repeatDescription": "Repeat transfer",
                "app.widgets.forms.cryptoTransfer.repeating": "Repeating",
                "app.widgets.forms.cryptoTransfer.noAddress": "Address not found",
                "app.widgets.forms.cryptoTransfer.lastUsedWallet": "Last used wallet"
            };
            return translations[key] || key;
        });

        mockUseAbortableInfiniteGetList.mockReturnValue({
            data: { pages: [] },
            isFetched: true,
            isFetching: false,
            fetchNextPage: jest.fn()
        });

        mockUseQuery.mockReturnValue({ data: [] });
    });

    it("submits form with valid values", async () => {
        render(<CryptoTransferForm {...defaultProps} />);

        const amountInput = screen.getByRole("textbox");
        const submitBtn = screen.getByRole("button", { name: "Create transfer" });

        (useAbortableInfiniteGetList as jest.Mock).mockReturnValue({
            data: {
                pages: [
                    {
                        data: [
                            {
                                id: 1,
                                address: "T123456789012345678901234567890123",
                                description: "Test Wallet"
                            }
                        ]
                    }
                ]
            },
            isFetched: true,
            isFetching: false,
            fetchNextPage: jest.fn()
        });

        fireEvent.keyDown(screen.getByRole("combobox"), {
            key: " "
        });
        const option = screen.getByText("T123456789012345678901234567890123").parentElement;
        fireEvent.keyDown(option!, {
            key: " "
        });
        fireEvent.change(amountInput, { target: { value: "10" } });

        await waitFor(() => expect(submitBtn).toBeEnabled());

        fireEvent.click(submitBtn);

        await waitFor(() =>
            expect(defaultProps.create).toHaveBeenCalledWith({
                address: "T123456789012345678901234567890123",
                amount: "10",
                accuracy: 100
            })
        );
    });

    it("sets all amount when checkbox clicked", async () => {
        render(<CryptoTransferForm {...defaultProps} />);

        const checkboxLabel = screen.getByText(/All amount/);
        fireEvent.click(checkboxLabel);

        expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("100");
    });

    it("renders success state", () => {
        render(<CryptoTransferForm {...defaultProps} transferState="success" showMessage="Success!" />);
        expect(screen.getByText("Success!")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Success" })).toBeInTheDocument();
    });

    it("renders error state", () => {
        render(<CryptoTransferForm {...defaultProps} transferState="error" showMessage="Error!" />);
        expect(screen.getByText("Error!")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Error" })).toBeInTheDocument();
    });

    it("handles repeatData with toast success", async () => {
        (useAbortableInfiniteGetList as jest.Mock).mockReturnValue({
            data: {
                pages: [
                    {
                        data: [{ id: 1, address: "T123456789012345678901234567890123", description: "Test" }]
                    }
                ]
            },
            isFetched: true,
            isFetching: false,
            fetchNextPage: jest.fn()
        });

        render(
            <CryptoTransferForm
                {...defaultProps}
                repeatData={{ address: "T123456789012345678901234567890123", amount: 10 }}
            />
        );

        await waitFor(() => {
            expect(mockAppToast).toHaveBeenCalledWith("success", "Repeat transfer", "Repeating");
        });
    });

    it("renders lastUsedWallet in select", () => {
        (useAbortableInfiniteGetList as jest.Mock).mockReturnValue({
            data: {
                pages: [
                    {
                        data: [{ id: 1, address: "T123456789012345678901234567890123", description: "Test Wallet" }]
                    }
                ]
            },
            isFetched: true,
            isFetching: false,
            fetchNextPage: jest.fn()
        });

        (useQuery as jest.Mock).mockReturnValue({
            data: [
                {
                    destination: {
                        requisites: [{ blockchain_address: "T123456789012345678901234567890123" }]
                    }
                }
            ]
        });

        render(<CryptoTransferForm {...defaultProps} />);

        fireEvent.keyDown(screen.getByRole("combobox"), {
            key: " "
        });

        expect(screen.getByText("Last used wallet")).toBeInTheDocument();
    });
});
