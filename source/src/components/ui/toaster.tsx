import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { CircleCheckBigIcon, Clock4Icon, OctagonAlertIcon } from "lucide-react";

export function Toaster() {
    const { toasts } = useToast();

    enum ToastVariant {
        success = "success",
        error = "error",
        info = "info"
    }
    interface ToastIconMap {
        [key: string]: JSX.Element;
    }

    const toastIcons: ToastIconMap = {
        [ToastVariant.success]: <CircleCheckBigIcon />,
        [ToastVariant.error]: <OctagonAlertIcon />,
        [ToastVariant.info]: <Clock4Icon />
    };

    return (
        <ToastProvider>
            {toasts.map(function ({ id, title, description, action, ...props }) {
                const { variant } = props as { variant: ToastVariant };
                return (
                    <Toast key={id} {...props}>
                        <div className="grid grid-cols-1/9 gap-1">
                            <div className="row-span-2">{toastIcons[variant]}</div> {/* Исправлено */}
                            <div className="">
                                {title && <ToastTitle>{title}</ToastTitle>}
                                {description && <ToastDescription>{description}</ToastDescription>}
                            </div>
                        </div>
                        {action}
                        <ToastClose />
                    </Toast>
                );
            })}
            <ToastViewport />
        </ToastProvider>
    );
}
