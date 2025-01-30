import { LucideProps } from "lucide-react";
import { Button } from "../button";

interface HeaderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    Icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    text: string;
}

export const HeaderButton = (props: HeaderButtonProps) => {
    const { text, Icon, onClick } = props;
    return (
        <Button
            onClick={onClick}
            variant="default"
            className="h-[50px] w-full rounded-none flex justify-start text-start gap-[8px] bg-transparent hover:bg-green-50 text-neutral-80 dark:text-neutral-50 hover:text-neutral-0 dark:hover:text-neutral-0">
            {Icon && <Icon />}
            <span className="">{text}</span>
        </Button>
    );
};
