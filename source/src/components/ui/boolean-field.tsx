import { Check, X } from "lucide-react";

export const BooleanField = (props: { value: boolean; label?: string | undefined }) => {
    return (
        <div>
            {props.label && <small className="text-sm text-muted-foreground">{props.label}</small>}
            {props.value ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </div>
    );
};
