import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const outlineStyles = cn(
    "bg-neutral-0 hover:bg-green-0 active:bg-neutral-0 disabled:bg-neutral-20 border border-green-50 hover:border-green-40 active:border-green-60 disabled:border-neutral-80 text-green-50 active:text-green-60 disabled:text-neutral-80",
    "dark:bg-neutral-100 hover:dark:bg-green-0 active:dark:bg-neutral-100"
);

const textBtnStyles =
    "transition-none bg-transparent hover:text-green-40 active:text-green-60 disabled:!text-neutral-80";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-4 text-sm font-normal ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 duration-200 select-none",
    {
        variants: {
            variant: {
                default:
                    "bg-green-50 text-neutral-0 hover:bg-green-40 active:bg-green-60 disabled:bg-neutral-70 disabled:text-neutral-40",
                secondary:
                    "bg-transparent text-green-50 hover:text-green-40 active:text-green-60 disabled:bg-neutral-20 disabled:text-neutral-80",
                outline: outlineStyles,
                outline_sec: outlineStyles + " text-neutral-50 border-neutral-50 hover:text-green-50",
                text_btn: "text-green-50 " + textBtnStyles,
                text_btn_sec: "text-neutral-50 " + textBtnStyles,
                deleteGray:
                    "border border-green-50 hover:border-green-50 hover:bg-green-50 dark:hover:bg-muted hover:text-white active:bg-neutral-0 active:text-green-40 active:border-green-40 focus:bg-neutral-0 focus:text-green-40 focus:border-green-40 disabled:bg-neutral-20 disabled:border-neutral-80 disabled:text-neutral-80 dark:border-neutral-50 text-green-50 dark:text-neutral-50 bg-transparent dark:bg-muted dark:hover:border-green-50 dark:hover:text-neutral-50"
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
