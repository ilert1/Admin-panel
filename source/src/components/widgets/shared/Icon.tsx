export function Icon({ name, folder = "" }: { name: string; folder?: string }) {
    return <img src={(folder !== "" && `/${folder}/`) + name + ".svg"} alt={name} />;
}
