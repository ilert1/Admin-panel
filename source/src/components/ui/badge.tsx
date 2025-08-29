import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-md border px-2.5 py-1 mt-[1px] text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
                secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
                outline: "text-foreground",
                currency: "cursor-default border border-neutral-50 bg-transparent font-normal hover:bg-transparent",
                warning: "bg-yellow-50 !rounded-16",
                success: "bg-green-50 !rounded-16"
            }
        },
        defaultVariants: {
            variant: "default"
        }
    }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, children, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant, className }), className)} {...props}>
            {variant === "currency" ? (
                <span className="max-w-28 overflow-hidden text-ellipsis break-words text-neutral-90 dark:text-neutral-0">
                    {children}
                </span>
            ) : (
                children
            )}
        </div>
    );
}

export { Badge, badgeVariants };
