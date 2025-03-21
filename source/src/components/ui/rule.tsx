import { Check, CircleAlert, X } from "lucide-react";
interface RuleProps {
    text: string;
    isError?: boolean;
}
export const Rule = (props: RuleProps) => {
    const { text, isError } = props;
    return (
        <div className="flex items-center gap-[4px]">
            {isError === undefined ? (
                <CircleAlert className="h-[18px] w-[18px] stroke-yellow-40" />
            ) : isError ? (
                <X className="h-[18px] w-[18px] stroke-red-40" />
            ) : (
                <Check className="h-[18px] w-[18px] stroke-green-50" />
            )}

            <span className="text-note-2">{text}</span>
        </div>
    );
};
