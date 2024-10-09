export const Icon = (props: { name: string }) => {
    return <img src={"/currency/" + props.name + ".svg"} alt={props.name} />;
};
