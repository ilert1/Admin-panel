interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
    className: string;
    text: string;
}

export const Text = (props: TextProps) => {
    const { text, className, ...other } = props;

    return (
        <span className={className} {...other}>
            {text}
        </span>
    );
};
