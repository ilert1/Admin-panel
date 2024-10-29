export function camelize(s: string, sep = "-") {
    const regex = new RegExp(`${sep}.`, "g");
    return s.replace(regex, x => x[1].toUpperCase());
}
