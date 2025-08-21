import makeSafeSpacesInBrackets from "./makeSafeSpacesInBrackets";

describe("makeSafeSpacesInBrackets", () => {
    it("replaces spaces inside brackets with non-breaking spaces", () => {
        const input = "This is a [test string] with [multiple brackets]";
        const expected = "This is a [test\u00A0string] with [multiple\u00A0brackets]";
        expect(makeSafeSpacesInBrackets(input)).toBe(expected);
    });

    it("returns the same string if there are no brackets", () => {
        const input = "No brackets here";
        expect(makeSafeSpacesInBrackets(input)).toBe(input);
    });

    it("handles empty string", () => {
        expect(makeSafeSpacesInBrackets("")).toBe("");
    });

    it("handles undefined or null gracefully", () => {
        expect(makeSafeSpacesInBrackets(undefined as unknown as string)).toBe(undefined);
        expect(makeSafeSpacesInBrackets(null as unknown as string)).toBe(null);
    });

    it("replaces multiple spaces inside brackets", () => {
        const input = "[multiple   spaces]";
        const expected = "[multiple\u00A0\u00A0\u00A0spaces]";
        expect(makeSafeSpacesInBrackets(input)).toBe(expected);
    });
});
