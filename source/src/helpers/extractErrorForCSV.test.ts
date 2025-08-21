import extractFieldsFromErrorMessage from "./extractErrorForCSV";

describe("extractFieldsFromErrorMessage", () => {
    it("should extract all fields correctly", () => {
        const errorMessage = `{'type': 'type_value', 'loc': ['location', 'field'], 'msg': "pattern 'email' validation failed", 'input': 'test input'}`;

        const result = extractFieldsFromErrorMessage(errorMessage);

        expect(result).toEqual({
            type: "type_value",
            loc: ["location", "field"],
            pattern: "email",
            input: "test input"
        });
    });

    it("should handle missing fields", () => {
        const errorMessage = `Some random text without expected fields`;

        const result = extractFieldsFromErrorMessage(errorMessage);

        expect(result).toEqual({
            type: null,
            loc: [],
            pattern: null,
            input: null
        });
    });

    it("should extract pattern from complex msg", () => {
        const errorMessage = `{'msg': "Value must match pattern '^[a-z]+$'", 'type': 'pattern_error'}`;

        const result = extractFieldsFromErrorMessage(errorMessage);

        expect(result.pattern).toBe("^[a-z]+$");
        expect(result.type).toBe("pattern_error");
    });

    it("should handle empty loc array", () => {
        const errorMessage = `{'loc': [], 'type': 'empty_location'}`;

        const result = extractFieldsFromErrorMessage(errorMessage);

        expect(result.loc).toEqual([]);
    });
});
