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
        useTranslate: () => (key: string) => key
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

    describe("Drag and Drop functionality", () => {
        it("не показывает grip icon когда draggable=false", () => {
            render(
                <MultiSelect
                    options={OPTIONS}
                    selectedValues={["a", "b"]}
                    onValueChange={jest.fn()}
                    draggable={false}
                />
            );

            const badges = screen.getAllByText(/Option/);
            expect(badges).toHaveLength(2);

            expect(screen.queryByTestId("grip-vertical")).not.toBeInTheDocument();
        });

        it("показывает grip icon когда draggable=true", () => {
            render(
                <MultiSelect options={OPTIONS} selectedValues={["a", "b"]} onValueChange={jest.fn()} draggable={true} />
            );

            const gripIcons = screen.getAllByTestId("grip-vertical");
            expect(gripIcons).toHaveLength(2);
        });

        it("badges не имеют draggable атрибут когда draggable=false", () => {
            render(
                <MultiSelect options={OPTIONS} selectedValues={["a"]} onValueChange={jest.fn()} draggable={false} />
            );

            const badge = screen.getByText("Option A").closest("[draggable]");
            expect(badge).toHaveAttribute("draggable", "false");
        });

        it("badges имеют draggable атрибут когда draggable=true", () => {
            render(<MultiSelect options={OPTIONS} selectedValues={["a"]} onValueChange={jest.fn()} draggable={true} />);

            const badge = screen.getByText("Option A").closest("[draggable]");
            expect(badge).toHaveAttribute("draggable", "true");
        });

        it("обрабатывает drag start event", () => {
            const onValueChange = jest.fn();
            render(
                <MultiSelect
                    options={OPTIONS}
                    selectedValues={["a", "b"]}
                    onValueChange={onValueChange}
                    draggable={true}
                />
            );

            const firstBadge = screen.getByText("Option A").closest("[draggable]");
            expect(firstBadge).toBeInTheDocument();

            // Simulate drag start
            fireEvent.dragStart(firstBadge!, {
                dataTransfer: {
                    effectAllowed: "",
                    setData: jest.fn()
                }
            });

            // Badge should have dragging styles applied
            expect(firstBadge).toHaveClass("opacity-50");
        });

        // it("reorders values при успешном drag and drop", async () => {
        //     const onValueChange = jest.fn();
        //     const MultiSelectWrapper = () => {
        //         const [selectedValues, setSelectedValues] = useState<string[]>(["a", "b", "c"]);
        //         console.log("Selected values: ", selectedValues);
        //         return (
        //             <MultiSelect
        //                 options={OPTIONS}
        //                 selectedValues={selectedValues}
        //                 onValueChange={val => {
        //                     setSelectedValues(val);
        //                     console.log("Selected values: ", selectedValues);
        //                     onValueChange(val);
        //                 }}
        //                 draggable={true}
        //             />
        //         );
        //     };

        //     render(<MultiSelectWrapper />);

        //     const firstBadge = screen.getByText("Option A").closest("[draggable]");
        //     const thirdBadge = screen.getByText("Option C").closest("[draggable]");

        //     // Simulate drag from first to third position
        //     fireEvent.dragStart(firstBadge!);
        //     fireEvent.dragOver(thirdBadge!);
        //     fireEvent.drop(thirdBadge!);
        //     fireEvent.dragEnd(firstBadge!);

        //     // Should reorder from ["a", "b", "c"] to ["b", "c", "a"]
        //     await waitFor(() => {
        //         expect(onValueChange).toHaveBeenCalledWith(["b", "c", "a"]);
        //     });
        // });

        it("не обрабатывает drag events когда draggable=false", () => {
            const onValueChange = jest.fn();
            render(
                <MultiSelect
                    options={OPTIONS}
                    selectedValues={["a", "b"]}
                    onValueChange={onValueChange}
                    draggable={false}
                />
            );

            const firstBadge = screen.getByText("Option A").closest("[draggable]");

            // Simulate drag start - should not trigger reordering logic
            fireEvent.dragStart(firstBadge!);
            fireEvent.dragEnd(firstBadge!);

            // Badge should not have dragging styles
            expect(firstBadge).not.toHaveClass("opacity-50");
            expect(onValueChange).not.toHaveBeenCalled();
        });
    });
});
