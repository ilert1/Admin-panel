import { render, screen, fireEvent, act } from "@testing-library/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

describe("Table component", () => {
    beforeAll(() => {
        Object.defineProperty(HTMLElement.prototype, "scrollTo", {
            configurable: true,
            value: jest.fn()
        });
    });

    it("рендерится без ошибок и отображает содержимое", () => {
        render(
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Header</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>Cell</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );

        expect(screen.getByText("Header")).toBeInTheDocument();
        expect(screen.getByText("Cell")).toBeInTheDocument();
    });

    it("скроллит вверх при смене page", () => {
        const { rerender, container } = render(
            <Table page={1}>
                <TableBody>
                    <TableRow>
                        <TableCell>Test</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );

        const scrollableDiv = container.querySelector("div.overflow-auto")!;
        const spy = jest.spyOn(scrollableDiv, "scrollTo");

        rerender(
            <Table page={2}>
                <TableBody>
                    <TableRow>
                        <TableCell>Test</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );

        expect(spy).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    });

    it("отображает правый градиент если есть скролл вправо", () => {
        const { container } = render(
            <Table>
                <TableBody>
                    <TableRow>
                        {Array.from({ length: 20 }).map((_, i) => (
                            <TableCell key={i}>Col {i}</TableCell>
                        ))}
                    </TableRow>
                </TableBody>
            </Table>
        );

        const scrollableDiv = container.querySelector("div.overflow-auto") as HTMLElement;

        act(() => {
            Object.defineProperties(scrollableDiv, {
                scrollWidth: { value: 2000, configurable: true },
                clientWidth: { value: 500, configurable: true },
                scrollLeft: { value: 0, configurable: true }
            });
            fireEvent.scroll(scrollableDiv);
        });

        const rightShadow = container.querySelector(".bg-gradient-to-l")!;
        expect(rightShadow).toHaveClass("opacity-50");
        const leftShadow = container.querySelector(".bg-gradient-to-r")!;
        expect(leftShadow).toHaveClass("opacity-0");
    });

    it("отображает левый градиент если проскроллено вправо", () => {
        const { container } = render(
            <Table>
                <TableBody>
                    <TableRow>
                        {Array.from({ length: 20 }).map((_, i) => (
                            <TableCell key={i}>Col {i}</TableCell>
                        ))}
                    </TableRow>
                </TableBody>
            </Table>
        );

        const scrollableDiv = container.querySelector("div.overflow-auto") as HTMLElement;

        act(() => {
            Object.defineProperties(scrollableDiv, {
                scrollWidth: { value: 2000, configurable: true },
                clientWidth: { value: 500, configurable: true },
                scrollLeft: { value: 1000, configurable: true }
            });
            fireEvent.scroll(scrollableDiv);
        });

        const rightShadow = container.querySelector(".bg-gradient-to-l")!;
        const leftShadow = container.querySelector(".bg-gradient-to-r")!;

        expect(leftShadow).toHaveClass("opacity-50");
        expect(rightShadow).toHaveClass("opacity-50");
    });

    it("ничего не ломается если tableRef.current отсутствует", () => {
        const { unmount } = render(<Table />);
        expect(() => unmount()).not.toThrow();
    });
});
