import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Badge } from "@/components/ui/badge";

describe("Badge component", () => {
    it("рендерит children", () => {
        render(<Badge>Default Badge</Badge>);
        expect(screen.getByText("Default Badge")).toBeInTheDocument();
    });

    it("по умолчанию имеет variant=default", () => {
        render(<Badge>Default Badge</Badge>);
        const badge = screen.getByText("Default Badge");
        expect(badge).toHaveClass("bg-primary");
        expect(badge).toHaveClass("text-primary-foreground");
    });

    it("рендерит variant=secondary", () => {
        render(<Badge variant="secondary">Secondary</Badge>);
        const badge = screen.getByText("Secondary");
        expect(badge).toHaveClass("bg-secondary");
        expect(badge).toHaveClass("text-secondary-foreground");
    });

    it("рендерит variant=destructive", () => {
        render(<Badge variant="destructive">Danger</Badge>);
        const badge = screen.getByText("Danger");
        expect(badge).toHaveClass("bg-destructive");
        expect(badge).toHaveClass("text-destructive-foreground");
    });

    it("рендерит variant=outline", () => {
        render(<Badge variant="outline">Outline</Badge>);
        const badge = screen.getByText("Outline");
        expect(badge).toHaveClass("text-foreground");
    });

    it("рендерит variant=currency внутри span с обрезкой текста", () => {
        render(<Badge variant="currency">USD</Badge>);
        const wrapper = screen.getByText("USD").closest("span");
        expect(wrapper).toBeInTheDocument();
        expect(wrapper).toHaveClass("text-ellipsis");
        expect(wrapper).toHaveClass("break-words");
    });

    it("рендерит variant=warning", () => {
        render(<Badge variant="warning">Warning</Badge>);
        const badge = screen.getByText("Warning");
        expect(badge).toHaveClass("bg-yellow-50");
        expect(badge).toHaveClass("!rounded-16");
    });

    it("рендерит variant=success", () => {
        render(<Badge variant="success">Success</Badge>);
        const badge = screen.getByText("Success");
        expect(badge).toHaveClass("bg-green-50");
        expect(badge).toHaveClass("!rounded-16");
    });

    it("позволяет добавлять кастомные className", () => {
        render(<Badge className="extra-class">With Class</Badge>);
        const badge = screen.getByText("With Class");
        expect(badge).toHaveClass("extra-class");
    });

    it("передает произвольные HTML-атрибуты", () => {
        render(<Badge data-testid="my-badge">Attr Badge</Badge>);
        expect(screen.getByTestId("my-badge")).toBeInTheDocument();
    });
});
