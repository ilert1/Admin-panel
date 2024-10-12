export function Icon({ name, isCurrency = false }: { name: string; isCurrency?: boolean }) {
    return isCurrency ? <img src={"/currency/" + name + ".svg"} alt={name} /> : <img src={name + ".svg"} alt={name} />;
}
