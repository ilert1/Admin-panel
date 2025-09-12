import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
    Command,
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandShortcut,
    CommandSeparator
} from "@/components/ui/command";

jest.mock("react-responsive", () => ({
    useMediaQuery: jest.fn()
}));
const { useMediaQuery } = jest.requireMock("react-responsive");

describe("Command components", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        (useMediaQuery as jest.Mock).mockReturnValue(false);
    });

    it("рендерит диалог с командой", () => {
        render(
            <CommandDialog open>
                <CommandInput placeholder="Search..." />
                <CommandList>
                    <CommandEmpty>Nothing found</CommandEmpty>
                    <CommandGroup heading="Test Group">
                        <CommandItem>Item 1</CommandItem>
                        <CommandItem>Item 2</CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                </CommandList>
            </CommandDialog>
        );

        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Search...")).toBeVisible();
        expect(screen.getByText("Item 1")).toBeVisible();
        expect(screen.getByText("Item 2")).toBeVisible();
        expect(screen.getByText("Test Group")).toBeVisible();
    });

    it("отображает иконку поиска в инпуте", () => {
        render(
            <Command>
                <CommandInput placeholder="Search..." />
            </Command>
        );
        expect(screen.getByPlaceholderText("Search...").previousSibling).toHaveClass("lucide lucide-search");
    });

    it("отображает Empty state при отсутствии элементов", () => {
        render(
            <CommandDialog open>
                <CommandList>
                    <CommandEmpty>Nothing found</CommandEmpty>
                </CommandList>
            </CommandDialog>
        );
        expect(screen.getByText("Nothing found")).toBeVisible();
    });

    it("поддерживает шорткаты внутри Item", () => {
        render(
            <Command>
                <CommandItem>
                    Item with shortcut
                    <CommandShortcut>⌘K</CommandShortcut>
                </CommandItem>
            </Command>
        );
        expect(screen.getByText("Item with shortcut")).toBeVisible();
        expect(screen.getByText("⌘K")).toHaveClass("text-xs");
    });

    it("дизейблит Item при переданном пропе disabled", () => {
        render(
            <Command>
                <CommandItem disabled>Disabled Item</CommandItem>
            </Command>
        );
        expect(screen.getByText("Disabled Item")).toHaveAttribute("data-disabled", "true");
    });

    it("меняет max-height списка в зависимости от useMediaQuery", () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);
        render(
            <Command>
                <CommandList />
            </Command>
        );
        expect(screen.getByRole("listbox")).toHaveClass("max-h-[140px]");
    });

    it("по умолчанию у списка max-height=300px", () => {
        render(
            <Command>
                <CommandList />
            </Command>
        );
        expect(screen.getByRole("listbox")).toHaveClass("max-h-[300px]");
    });

    it("можно вводить текст в CommandInput", () => {
        render(
            <Command>
                <CommandInput placeholder="Type here..." />
            </Command>
        );
        const input = screen.getByPlaceholderText("Type here...") as HTMLInputElement;
        fireEvent.change(input, { target: { value: "Hello" } });
        expect(input.value).toBe("Hello");
    });
});
