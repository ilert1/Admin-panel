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
            className="flex h-[50px] w-full justify-start gap-[8px] rounded-none bg-transparent text-start text-neutral-80 hover:bg-green-50 hover:text-neutral-0 dark:text-neutral-50 dark:hover:text-neutral-0">
            {Icon && <Icon />}
            <span className="">{text}</span>
        </Button>
    );
};
