import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

        await act(async () => {
            render(<CryptoTransferForm {...defaultProps} />);
        });

        await userEvent.click(screen.getByRole("combobox"));
        await userEvent.click(screen.getByText("T123456789012345678901234567890123"));
        await userEvent.type(screen.getByRole("textbox"), "10");

        const submitBtn = await screen.findByRole("button", { name: "Create transfer" });
        await userEvent.click(submitBtn);

        await waitFor(() =>
            expect(defaultProps.create).toHaveBeenCalledWith({
                address: "T123456789012345678901234567890123",
                amount: "10",
                accuracy: 100
            })
        );
    });

    it("sets all amount when checkbox clicked", async () => {
        await act(async () => {
            render(<CryptoTransferForm {...defaultProps} />);
        });

        await userEvent.click(screen.getByText(/All amount/));

        expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("100");
    });

    it("renders success state", async () => {
        await act(async () => {
            render(<CryptoTransferForm {...defaultProps} transferState="success" showMessage="Success!" />);
        });

        expect(await screen.findByText("Success!")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Success" })).toBeInTheDocument();
    });

    it("renders error state", async () => {
        await act(async () => {
            render(<CryptoTransferForm {...defaultProps} transferState="error" showMessage="Error!" />);
        });

        expect(await screen.findByText("Error!")).toBeInTheDocument();
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

        await act(async () => {
            render(
                <CryptoTransferForm
                    {...defaultProps}
                    repeatData={{ address: "T123456789012345678901234567890123", amount: 10 }}
                />
            );
        });

        await waitFor(() => {
            expect(mockAppToast).toHaveBeenCalledWith("success", "Repeat transfer", "Repeating");
        });
    });

    it("renders lastUsedWallet in select", async () => {
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

        await act(async () => {
            render(<CryptoTransferForm {...defaultProps} />);
        });

        await userEvent.click(screen.getByRole("combobox"));

        expect(await screen.findByText("Last used wallet")).toBeInTheDocument();
    });
});
