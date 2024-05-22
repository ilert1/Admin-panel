export function camelize(s: string) {
    return s.replace(/-./g, x => x[1].toUpperCase());
}
