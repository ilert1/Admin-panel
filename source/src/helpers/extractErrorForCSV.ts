const extractFieldsFromErrorMessage = (text: string) => {
    const typeMatch = text.match(/'type': '([^']+)'/);
    const locMatch = text.match(/'loc': \[([^\]]+)\]/);
    const msgMatch = text.match(/'msg': "(.*?)"/);
    const inputMatch = text.match(/'input': '([^']+)'/);

    const type = typeMatch?.[1] ?? null;
    const loc = locMatch?.[1]?.split(",").map(v => v.trim().replace(/^'|'$/g, "")) ?? [];
    const patternMatch = msgMatch?.[1].match(/pattern '([^']+)'/);
    const pattern = patternMatch?.[1] ?? null;
    const input = inputMatch?.[1] ?? null;

    return {
        type,
        loc,
        pattern,
        input
    };
};

export default extractFieldsFromErrorMessage;
