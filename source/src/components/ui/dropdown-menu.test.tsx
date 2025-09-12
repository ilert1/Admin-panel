import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuRadioGroup
} from "./dropdown-menu";
import { useState } from "react";

function CheckboxMenu() {
    const [checked, setChecked] = useState(false);
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>Open</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuCheckboxItem checked={checked} onCheckedChange={setChecked}>
                    Check me
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function RadioMenu() {
    const [value, setValue] = useState("option1");
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>Open</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuRadioGroup value={value} onValueChange={setValue}>
                    <DropdownMenuRadioItem value="option1">Option 1</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="option2">Option 2</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

describe("DropdownMenu", () => {
    it("открывается и закрывается по клику на триггер", async () => {
        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Open</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>Item 1</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );

        const trigger = screen.getByRole("button", { name: /open/i });

        expect(screen.queryByText("Item 1")).not.toBeInTheDocument();

        fireEvent.keyDown(trigger, {
            key: " "
        });
        expect(await screen.findByText("Item 1")).toBeInTheDocument();

        fireEvent.keyDown(trigger, {
            key: " "
        });
        await waitFor(() => {
            expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
        });
    });

    it("рендерит label и separator", async () => {
        render(
            <DropdownMenu open>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Label</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Item</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );

        expect(screen.getByText("Label")).toBeInTheDocument();
        expect(screen.getByRole("separator")).toBeInTheDocument();
        expect(screen.getByText("Item")).toBeInTheDocument();
    });

    it("поддерживает checkbox items (toggle)", async () => {
        render(<CheckboxMenu />);

        const trigger = screen.getByRole("button", { name: /open/i });
        fireEvent.keyDown(trigger, { key: " " });

        const checkbox = await screen.findByText("Check me");

        expect(checkbox).toHaveAttribute("data-state", "unchecked");

        fireEvent.click(checkbox);
        expect(checkbox).toHaveAttribute("data-state", "checked");
    });

    it("поддерживает radio group", async () => {
        render(<RadioMenu />);

        const trigger = screen.getByRole("button", { name: /open/i });
        fireEvent.keyDown(trigger, { key: " " });

        const option1 = await screen.findByText("Option 1");
        const option2 = await screen.findByText("Option 2");

        expect(option1).toHaveAttribute("data-state", "checked");
        expect(option2).toHaveAttribute("data-state", "unchecked");

        fireEvent.click(option2);

        expect(option1).toHaveAttribute("data-state", "unchecked");
        expect(option2).toHaveAttribute("data-state", "checked");
    });

    it("поддерживает sub menu", async () => {
        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Open</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem>SubItem</DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                </DropdownMenuContent>
            </DropdownMenu>
        );

        await userEvent.click(screen.getByText("Open"));
        expect(await screen.findByText("More")).toBeInTheDocument();

        await userEvent.hover(screen.getByText("More"));
        expect(await screen.findByText("SubItem")).toBeInTheDocument();
    });

    it("рендерит shortcut", async () => {
        render(
            <DropdownMenu open>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        Save <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );

        expect(screen.getByText("⌘S")).toBeInTheDocument();
    });

    it("поддерживает кастомный className", async () => {
        render(
            <DropdownMenu open>
                <DropdownMenuContent className="custom-class">
                    <DropdownMenuItem>Item</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );

        const content = screen.getByText("Item").closest("[data-state='open']");
        expect(content).toHaveClass("custom-class");
    });
});
