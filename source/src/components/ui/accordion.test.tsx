import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

describe("Accordion component", () => {
    it("не рендерит контент по умолчанию", () => {
        render(
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>Trigger 1</AccordionTrigger>
                    <AccordionContent>Content 1</AccordionContent>
                </AccordionItem>
            </Accordion>
        );

        expect(screen.queryByText("Content 1")).toBeNull();
    });

    it("открывает и закрывает контент по клику на триггер", async () => {
        render(
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>Trigger 1</AccordionTrigger>
                    <AccordionContent>Content 1</AccordionContent>
                </AccordionItem>
            </Accordion>
        );

        const trigger = screen.getByText("Trigger 1");

        fireEvent.click(trigger);

        await waitFor(() => expect(screen.queryByText("Content 1")).toBeInTheDocument());

        fireEvent.click(trigger);

        await waitFor(() => expect(screen.queryByText("Content 1")).toBeNull());
    });

    it("в режиме single открывает только один айтем", async () => {
        render(
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>Trigger 1</AccordionTrigger>
                    <AccordionContent>Content 1</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Trigger 2</AccordionTrigger>
                    <AccordionContent>Content 2</AccordionContent>
                </AccordionItem>
            </Accordion>
        );

        fireEvent.click(screen.getByText("Trigger 1"));
        await waitFor(() => expect(screen.queryByText("Content 1")).toBeInTheDocument());

        fireEvent.click(screen.getByText("Trigger 2"));
        await waitFor(() => expect(screen.queryByText("Content 2")).toBeInTheDocument());

        expect(screen.queryByText("Content 1")).toBeNull();
    });

    it("в режиме multiple можно открыть несколько айтемов", async () => {
        render(
            <Accordion type="multiple">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Trigger 1</AccordionTrigger>
                    <AccordionContent>Content 1</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Trigger 2</AccordionTrigger>
                    <AccordionContent>Content 2</AccordionContent>
                </AccordionItem>
            </Accordion>
        );

        fireEvent.click(screen.getByText("Trigger 1"));
        fireEvent.click(screen.getByText("Trigger 2"));

        await waitFor(() => {
            expect(screen.queryByText("Content 1")).toBeInTheDocument();
            expect(screen.queryByText("Content 2")).toBeInTheDocument();
        });
    });

    it("не открывает disabled триггер", async () => {
        render(
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger disabled>Disabled Trigger</AccordionTrigger>
                    <AccordionContent>Content 1</AccordionContent>
                </AccordionItem>
            </Accordion>
        );

        fireEvent.click(screen.getByText("Disabled Trigger"));

        expect(screen.queryByText("Content 1")).toBeNull();
    });

    it("триггер получает атрибут data-state=open при открытии", async () => {
        render(
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>Trigger 1</AccordionTrigger>
                    <AccordionContent>Content 1</AccordionContent>
                </AccordionItem>
            </Accordion>
        );

        const trigger = screen.getByText("Trigger 1");

        fireEvent.click(trigger);

        await waitFor(() => expect(trigger).toHaveAttribute("data-state", "open"));

        fireEvent.click(trigger);

        await waitFor(() => expect(trigger).toHaveAttribute("data-state", "closed"));
    });
});
