import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import "@testing-library/jest-dom";

describe("Popover component", () => {
    it("не рендерит контент по умолчанию", () => {
        render(
            <Popover>
                <PopoverTrigger>Open</PopoverTrigger>
                <PopoverContent>Popover Content</PopoverContent>
            </Popover>
        );
        expect(screen.queryByText("Popover Content")).not.toBeInTheDocument();
    });

    it("открывает поповер при клике на триггер", () => {
        render(
            <Popover>
                <PopoverTrigger>Open</PopoverTrigger>
                <PopoverContent>Popover Content</PopoverContent>
            </Popover>
        );

        fireEvent.click(screen.getByText("Open"));
        expect(screen.getByText("Popover Content")).toBeVisible();
    });

    it("закрывает поповер при повторном клике на триггер", () => {
        render(
            <Popover>
                <PopoverTrigger>Open</PopoverTrigger>
                <PopoverContent>Popover Content</PopoverContent>
            </Popover>
        );

        const trigger = screen.getByText("Open");

        fireEvent.click(trigger);
        expect(screen.getByText("Popover Content")).toBeVisible();

        fireEvent.click(trigger);
        expect(screen.queryByText("Popover Content")).not.toBeInTheDocument();
    });

    it("закрывается по Escape", async () => {
        render(
            <Popover>
                <PopoverTrigger>Open</PopoverTrigger>
                <PopoverContent>Popover Content</PopoverContent>
            </Popover>
        );

        fireEvent.click(screen.getByText("Open"));
        const content = screen.getByText("Popover Content");
        expect(content).toHaveAttribute("data-state", "open");

        fireEvent.keyDown(document, { key: "Escape" });

        await waitFor(() => expect(content).toHaveAttribute("data-state", "closed"));
    });

    it("принимает кастомный className", () => {
        render(
            <Popover>
                <PopoverTrigger>Open</PopoverTrigger>
                <PopoverContent className="custom-class">Popover Content</PopoverContent>
            </Popover>
        );

        fireEvent.click(screen.getByText("Open"));
        const content = screen.getByText("Popover Content");
        expect(content).toHaveClass("custom-class");
    });

    it("правильно применяет align prop", () => {
        render(
            <Popover>
                <PopoverTrigger>Open</PopoverTrigger>
                <PopoverContent align="end">Aligned Popover</PopoverContent>
            </Popover>
        );

        fireEvent.click(screen.getByText("Open"));
        const content = screen.getByText("Aligned Popover");
        expect(content).toHaveAttribute("data-align", "end");
    });

    it("правильно применяет sideOffset prop", () => {
        render(
            <Popover>
                <PopoverTrigger>Open</PopoverTrigger>
                <PopoverContent sideOffset={10}>Offset Popover</PopoverContent>
            </Popover>
        );

        fireEvent.click(screen.getByText("Open"));
        const content = screen.getByText("Offset Popover");
        expect(content.getAttribute("style")).toMatch(/--radix-popover-content-available-width/);
    });

    it("закрывается по Escape", () => {
        render(
            <Popover>
                <PopoverTrigger>Open</PopoverTrigger>
                <PopoverContent>Popover Content</PopoverContent>
            </Popover>
        );

        fireEvent.click(screen.getByText("Open"));
        expect(screen.getByText("Popover Content")).toBeVisible();

        fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
        expect(screen.queryByText("Popover Content")).not.toBeInTheDocument();
    });

    it("работает с несколькими поповерами независимо", () => {
        render(
            <div>
                <Popover>
                    <PopoverTrigger>First</PopoverTrigger>
                    <PopoverContent>First Content</PopoverContent>
                </Popover>
                <Popover>
                    <PopoverTrigger>Second</PopoverTrigger>
                    <PopoverContent>Second Content</PopoverContent>
                </Popover>
            </div>
        );

        fireEvent.click(screen.getByText("First"));
        expect(screen.getByText("First Content")).toBeVisible();
        expect(screen.queryByText("Second Content")).not.toBeInTheDocument();

        fireEvent.click(screen.getByText("Second"));
        expect(screen.getByText("Second Content")).toBeVisible();
        expect(screen.queryByText("First Content")).not.toBeInTheDocument();
    });
});
