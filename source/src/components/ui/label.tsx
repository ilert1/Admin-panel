import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const labelVariants = cva("peer-disabled:cursor-not-allowed peer-disabled:opacity-70 !block md:text-nowrap mb-[4px]", {
    variants: {
        variant: {
            "note-1": "!text-neutral-60 dark:!text-neutral-30 text-note-1",
            "title-2": "!text-neutral-60 dark:!text-neutral-0 text-title-2"
        }
    },
    defaultVariants: {
        variant: "note-1"
    }
});

const Label = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, variant, ...props }, ref) => (
    <LabelPrimitive.Root ref={ref} className={cn(labelVariants({ variant }), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
