export const TextField = (props: { text: string; label?: string | undefined }) => {
    return (
        <div>
            {props.label && <small className="text-sm text-muted-foreground">{props.label}</small>}
            <p className="leading-5">{props.text}</p>
        </div>
    );
};
