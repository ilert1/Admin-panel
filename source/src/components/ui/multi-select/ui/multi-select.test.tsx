import { render as rtlRender, screen, fireEvent, waitFor } from "@testing-library/react";
import { MultiSelect } from "./multi-select";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { useState } from "react";

jest.mock("@/components/ui/toast/useAppToast", () => ({
    useAppToast: () => jest.fn()
}));

jest.mock("react-admin", () => {
    const actual = jest.requireActual("react-admin");
    return {
        ...actual,
        useTranslate: () => (key: string) => key // мокнем только useTranslate
    };
});

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

const OPTIONS = [
    { label: "Option A", value: "a" },
    { label: "Option B", value: "b" },
    { label: "Option C", value: "c" }
];

describe("MultiSelect", () => {
    it("рендерит placeholder если нет выбранных значений", () => {
        render(
            <MultiSelect options={OPTIONS} selectedValues={[]} onValueChange={jest.fn()} placeholder="Select options" />
        );
        expect(screen.getByText("Select options")).toBeInTheDocument();
    });

    it("рендерит выбранные значения в Badge", () => {
        render(<MultiSelect options={OPTIONS} selectedValues={["a"]} onValueChange={jest.fn()} />);
        expect(screen.getByText("Option A")).toBeInTheDocument();
    });

    it("открывает и закрывает поповер по клику", () => {
        render(<MultiSelect options={OPTIONS} selectedValues={[]} onValueChange={jest.fn()} />);

        fireEvent.click(screen.getByRole("combobox"));
        expect(screen.getByRole("dialog")).toBeInTheDocument();

        fireEvent.keyDown(document, { key: "Escape" });
        waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    });

    it("добавляет и убирает опцию при клике", () => {
        const onValueChange = jest.fn();

        const MultiSelectWrapper = () => {
            const [selectedValues, setSelectedValues] = useState<string[]>([]);
            return (
                <MultiSelect
                    options={OPTIONS}
                    selectedValues={selectedValues}
                    onValueChange={val => {
                        setSelectedValues(val);
                        onValueChange(val);
                    }}
                />
            );
        };
        render(<MultiSelectWrapper />);

        fireEvent.click(screen.getByRole("combobox"));
        const option = screen.getByText("Option A");
        fireEvent.click(option);
        expect(onValueChange).toHaveBeenCalledWith(["a"]);

        fireEvent.click(screen.getByTestId("x-circle"));
        expect(onValueChange).toHaveBeenCalledWith([]);
    });

    it("кнопка очистки очищает все значения", () => {
        const onValueChange = jest.fn();
        render(<MultiSelect options={OPTIONS} selectedValues={["a", "b"]} onValueChange={onValueChange} />);

        fireEvent.click(screen.getByRole("combobox"));
        fireEvent.click(screen.getByTestId("x-icon"));

        expect(onValueChange).toHaveBeenCalledWith([]);
    });

    it("выбирает все опции через Select All", () => {
        const onValueChange = jest.fn();
        render(<MultiSelect options={OPTIONS} selectedValues={[]} onValueChange={onValueChange} />);

        fireEvent.click(screen.getByRole("combobox"));
        fireEvent.click(screen.getByText("(app.widgets.multiSelect.selectAll)"));

        expect(onValueChange).toHaveBeenCalledWith(["a", "b", "c"]);
    });

    it("отображает notFoundMessage при отсутствии совпадений", () => {
        render(
            <MultiSelect
                options={OPTIONS}
                selectedValues={[]}
                onValueChange={jest.fn()}
                notFoundMessage="Ничего не найдено"
            />
        );

        fireEvent.click(screen.getByRole("combobox"));
        fireEvent.change(screen.getByTestId("command-input"), { target: { value: "zzz" } });

        expect(screen.getByText("Ничего не найдено")).toBeInTheDocument();
    });

    it("отключен при disabled", () => {
        render(<MultiSelect options={OPTIONS} selectedValues={[]} onValueChange={jest.fn()} disabled />);

        expect(screen.getByRole("combobox")).toBeDisabled();
    });

    it("показывает WandSparkles если animation > 0", () => {
        render(<MultiSelect options={OPTIONS} selectedValues={["a"]} onValueChange={jest.fn()} animation={1} />);

        expect(screen.getByTestId("wand-sparkles")).toBeInTheDocument();
    });

    it("показывает лоадер, если передан соответствующий пропс", () => {
        render(<MultiSelect options={OPTIONS} selectedValues={[]} onValueChange={jest.fn()} isLoading />);

        expect(screen.getByTestId("loading-block")).toBeInTheDocument();
    });
});
