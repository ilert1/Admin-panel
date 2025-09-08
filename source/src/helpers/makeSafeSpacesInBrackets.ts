export const makeSafeSpacesInBrackets = (str: string) => {
    if (!str) return str;
    return str.replace(/\[(.*?)\]/g, function (match) {
        return match.replace(/ /g, "\u00A0");
    });
};

export default makeSafeSpacesInBrackets;
