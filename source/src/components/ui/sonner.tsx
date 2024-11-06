import { CircleCheckBigIcon, Clock4Icon, OctagonAlertIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme();

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            toastOptions={{
                classNames: {
                    toast: "flex items-start",
                    description: "text-muted-foreground",
                    actionButton: "bg-primary text-primary-foreground",
                    cancelButton: "bg-muted text-muted-foreground",
                    title: "text-2xl leading-0",
                    icon: "text-2xl",
                    error: "text-red-40",
                    success: "text-green-40",
                    warning: "text-yellow-40"
                }
            }}
            icons={{
                success: <CircleCheckBigIcon />,
                error: <OctagonAlertIcon />,
                info: <Clock4Icon />
            }}
            {...props}
        />
    );
};

export { Toaster };
