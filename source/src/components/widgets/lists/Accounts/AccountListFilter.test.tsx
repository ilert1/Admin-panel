import { render as rtlRender, screen, fireEvent } from "@testing-library/react";
import { AccountListFilter } from "./AccountListFilter";
import useAccountFilter from "./useAccountFilter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import React from "react";

jest.mock("./useAccountFilter", () => ({
    __esModule: true,
    default: jest.fn()
}));

function render(ui: React.ReactElement) {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } }
    });

    return rtlRender(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{ui}</MemoryRouter>
        </QueryClientProvider>
    );
}

describe("AccountListFilter", () => {
    const mockUseAccountFilter = useAccountFilter as jest.Mock;

    beforeEach(() => {
        mockUseAccountFilter.mockReturnValue({
            handleDownloadReport: jest.fn(),
            reportLoading: false,
            merchantData: [{ id: "1", name: "Test Merchant" }],
            merchantId: "1",
            merchantValue: "Test Merchant",
            setMerchantValue: jest.fn(),
            merchantsLoadingProcess: false,
            translate: (key: string) => key,
            clearFilters: jest.fn(),
            onMerchantChanged: jest.fn(),
            adminOnly: true,
            startDate: new Date("2023-01-01"),
            endDate: new Date("2023-01-31"),
            changeDate: jest.fn()
        });
    });

    it("рендерит кнопку скачивания отчета", () => {
        render(<AccountListFilter />);

        expect(screen.getByText("resources.transactions.download.downloadReportButtonText")).toBeInTheDocument();
    });

    it("вызывает clearFilters при клике на Clear в FilterButtonGroup", () => {
        const clearFiltersMock = jest.fn();

        mockUseAccountFilter.mockReturnValueOnce({
            ...mockUseAccountFilter(),
            clearFilters: clearFiltersMock
        });

        render(<AccountListFilter />);

        const button = screen.getByRole("button", { name: /clear/i });
        fireEvent.click(button);

        expect(clearFiltersMock).toHaveBeenCalled();
    });

    it("вызывает handleDownloadReport при клике на кнопку скачивания", () => {
        const handleDownloadReportMock = jest.fn();

        mockUseAccountFilter.mockReturnValueOnce({
            ...mockUseAccountFilter(),
            handleDownloadReport: handleDownloadReportMock
        });

        render(<AccountListFilter />);

        const button = screen.getByText("resources.transactions.download.downloadReportButtonText");
        fireEvent.click(button);

        expect(handleDownloadReportMock).toHaveBeenCalledWith(true, "xlsx");
    });
});
