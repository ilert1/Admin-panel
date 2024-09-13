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
                    <Toast key={id} {...props} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">{toastIcons[variant]}</div>
                        <div className="flex-1">
                            {title && <ToastTitle>{title}</ToastTitle>}
                            {description && <ToastDescription>{description}</ToastDescription>}
                        </div>
                        {action && <div className="ml-4">{action}</div>}
                        <ToastClose className="ml-4" />
                    </Toast>
                );
            })}
            <ToastViewport />
        </ToastProvider>
    );
}
