import * as React from "react";

import { cn } from "@/lib/utils";

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
    ({ className, ...props }, ref) => {
        const [isScrollableLeft, setIsScrollableLeft] = React.useState(false);
        const [isScrollableRight, setIsScrollableRight] = React.useState(false);
        const tableRef = React.useRef<HTMLDivElement | null>(null);

        const checkScrollState = () => {
            if (!tableRef.current) return;

            const { scrollWidth, clientWidth, scrollLeft } = tableRef.current;
            const hasHorizontalScroll = scrollWidth > clientWidth;

            setIsScrollableLeft(hasHorizontalScroll && scrollLeft > 10);
            setIsScrollableRight(hasHorizontalScroll && scrollLeft + 10 < scrollWidth - clientWidth);
        };

        React.useEffect(() => {
            checkScrollState();
            const currentTableRef = tableRef.current;

            if (currentTableRef) {
                const resizeObserver = new ResizeObserver(checkScrollState);
                resizeObserver.observe(currentTableRef);

                const scrollHandler = () => checkScrollState();
                currentTableRef.addEventListener("scroll", scrollHandler);

                return () => {
                    resizeObserver.unobserve(currentTableRef);
                    currentTableRef.removeEventListener("scroll", scrollHandler);
                };
            }
        }, [isScrollableLeft, isScrollableRight]);

        return (
            <div className="relative flex-shrink-1 min-h-[15rem] mb-2">
                <div ref={tableRef} className={cn("relative w-full h-full overflow-auto", className)}>
                    <table
                        ref={ref}
                        className={cn("w-full h-full caption-bottom text-sm border-collapse", className)}
                        {...props}
                    />
                </div>
                {/* Right shadow */}
                <div
                    className={`pointer-events-none absolute top-0 -right-[1px] h-full w-6 sm:w-12 bg-gradient-to-l from-white dark:from-black to-transparent z-20 transition-opacity duration-300 ${
                        isScrollableRight ? "opacity-50" : "opacity-0"
                    }`}
                />

                {/* Left shadow */}
                <div
                    className={`pointer-events-none absolute top-0 -left-[1px] h-full w-6 sm:w-12 bg-gradient-to-r from-white dark:from-black to-transparent z-20 transition-opacity duration-300 ${
                        isScrollableLeft ? "opacity-50" : "opacity-0"
                    }`}
                />
            </div>
        );
    }
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
        <thead
            ref={ref}
            className={cn(
                "[&_tr]:border-b sticky top-0 z-10 before:-top-[1px] before:absolute before:bottom-[2px] before:left-0 before:right-0 before:bg-neutral-40 before:dark:bg-muted before:-z-10",
                className
            )}
            {...props}
        />
    )
);
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
        <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
    )
);
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
        <tfoot
            ref={ref}
            className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
            {...props}
        />
    )
);
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
    ({ className, ...props }, ref) => (
        <tr
            ref={ref}
            className={cn("border-b transition-colors  data-[state=selected]:bg-muted", className)}
            {...props}
        />
    )
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
    ({ className, ...props }, ref) => (
        <th
            ref={ref}
            className={cn(
                "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
                className
            )}
            {...props}
        />
    )
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
    ({ className, ...props }, ref) => (
        <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
    )
);
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
    ({ className, ...props }, ref) => (
        <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
    )
);
TableCaption.displayName = "TableCaption";

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
