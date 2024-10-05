import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-4 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 duration-200",
    {
        variants: {
            variant: {
                default:
                    "bg-green-50 text-white dark:text-neutral-100 hover:bg-green-40 active:bg-green-20 disabled:bg-neutral-20 disabled:text-neutral-80",
                secondary:
                    "bg-neutral-0 text-green-50 hover:text-green-50 active:text-neutral-100 disabled:bg-neutral-20 disabled:text-neutral-80",
                outline:
                    "border border-green-50 bg-neutral-0 text-green-50 hover:border-green-50 active:bg-neutral-0 active:text-green-40 active:border-green-40 focus:bg-neutral-0 focus:text-green-40 focus:border-green-40 disabled:bg-neutral-20 disabled:border-neutral-80 disabled:text-neutral-80",
                textBtn:
                    "bg-neutral-0 text-green-50 hover:text-green-50 active:text-neutral-100 disabled:text-neutral-80",
                clearBtn: "text-neutral-50 hover:text-neutral-100",
                error: "border border-red-40 text-red-40 hover:bg-red-0 active:bg-neutral-0"
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-9 rounded-4 px-3",
                lg: "h-11 rounded-4 px-8",
                icon: "h-9 w-10"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
