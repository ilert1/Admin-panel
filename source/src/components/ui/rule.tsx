import { CircleAlert } from "lucide-react";
interface RuleProps {
    text: string;
    isError?: boolean;
}
export const Rule = (props: RuleProps) => {
    const { text, isError } = props;
    return (
        <div className="flex gap-[4px] items-center">
            <CircleAlert className="h-[18px] w-[18px] stroke-yellow-40" />
            <span className="text-note-2">{text}</span>
            {/* <X /> */}
            {/* <Check /> */}
        </div>
    );
};
