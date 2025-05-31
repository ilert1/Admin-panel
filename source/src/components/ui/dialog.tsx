/* eslint-disable react/prop-types */
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
// import { X } from "lucide-react";

import { cn } from "@/lib/utils";

interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
    disableOutsideClick?: boolean;
}

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
            "fixed inset-0 z-[60] bg-neutral-100/35 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className
        )}
        {...props}
    />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, DialogContentProps>(
    ({ className, children, disableOutsideClick, ...props }, ref) => {
        const handleInteractOutside = (ev: Event) => {
            const isToastItem = (ev.target as Element)?.closest("[data-sonner-toaster]");
            if (isToastItem) ev.preventDefault();
        };

        return (
            <DialogPortal>
                <DialogOverlay className="opacity-100" />
                <DialogPrimitive.Content
                    ref={ref}
                    onPointerDownOutside={handleInteractOutside}
                    onInteractOutside={disableOutsideClick ? e => e.preventDefault() : handleInteractOutside}
                    className={cn(
                        "fixed left-[50%] top-[50%] z-[60] grid w-[calc(100%-32px)] max-w-3xl translate-x-[-50%] translate-y-[-50%] gap-4 overflow-auto rounded-16 !bg-neutral-20 px-4 py-6 shadow-dialog outline-none duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] dark:!bg-muted sm:max-h-[100dvh] sm:w-full sm:p-[30px]",
                        className
                    )}
                    {...props}>
                    {children}
                </DialogPrimitive.Content>
            </DialogPortal>
        );
    }
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex flex-col items-center", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex flex-col items-center", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn("text-xl font-normal text-green-60 dark:text-white", className)}
        {...props}
    />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogClose,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription
};
