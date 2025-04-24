import { CircleCheckBigIcon, Clock4Icon, OctagonAlertIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme();

    return (
        <Sonner
            className="pointer-events-auto top-28 z-[999] w-72"
            closeButton
            position="top-right"
            theme={theme as ToasterProps["theme"]}
            toastOptions={{
                classNames: {
                    toast: "flex items-start border p-4 pt-3 bg-neutral-0 dark:bg-neutral-100 gap-2 w-full",
                    content: "flex flex-col",
                    title: "text-xl leading-0",
                    description: "text-sm dark:text-neutral-0 text-neutral-90",
                    icon: "mt-0.5 flex items-start",
                    error: "text-red-40 border-red-40",
                    success: "text-green-50 border-green-50 dark:text-green-40 dark:border-green-40",
                    info: "text-yellow-40 border-yellow-40",
                    warning: "text-yellow-30 border-yellow-30 [&>:is([data-icon])]:mt-1",
                    closeButton:
                        "text-neutral-50 right-2 left-auto top-4 w-4 h-4 [&>svg]:w-4 [&>svg]:h-4 hover:bg-transparent"
                }
            }}
            icons={{
                success: <CircleCheckBigIcon width={24} height={24} />,
                error: <OctagonAlertIcon width={24} height={24} />,
                info: <Clock4Icon width={24} height={24} />
            }}
            {...props}
        />
    );
};

export { Toaster };
