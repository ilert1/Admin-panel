import { render, screen, fireEvent } from "@testing-library/react";
import { AccountListFilter } from "./AccountListFilter";
import useAccountFilter from "./useAccountFilter";

jest.mock("./useAccountFilter", () => ({
    __esModule: true,
    default: jest.fn()
}));

describe("AccountListFilter", () => {
    const mockUseAccountFilter = useAccountFilter as jest.Mock;

    beforeEach(() => {
        mockUseAccountFilter.mockReturnValue({
            handleDownloadReport: jest.fn(),
            reportLoading: false,
            merchantData: [{ id: "1", name: "Test Merchant" }],
            merchantId: "1",
            merchantValue: { id: "1", name: "Test Merchant" },
            setMerchantValue: jest.fn(),
            merchantsLoadingProcess: false,
            translate: (key: string) => key, // просто возвращаем ключ
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

        // Кнопку из FilterButtonGroup найти по role/text (у тебя там внутри передается onClearFilters)
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
