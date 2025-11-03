import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const checkboxVariants = cva(
    "peer h-4 w-4 shrink-0 rounded-4 border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ",
    {
        variants: {
            variant: {
                default:
                    "border-neutral-60 data-[state=checked]:border-green-50 data-[state=checked]:bg-green-50 data-[state=checked]:text-neutral-0",
                header: "border-neutral-40 data-[state=checked]:border-extra-3 data-[state=checked]:bg-extra-3"
            }
        },
        defaultVariants: {
            variant: "default"
        }
    }
);

const Checkbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & VariantProps<typeof checkboxVariants>
>(({ className, variant, ...props }, ref) => (
    <CheckboxPrimitive.Root ref={ref} className={cn(checkboxVariants({ variant }), className)} {...props}>
        <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
            <Check className={variant === "header" ? "h-4 w-4 text-neutral-0" : "h-4 w-4"} />
        </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
