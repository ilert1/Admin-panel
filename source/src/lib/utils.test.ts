import { cn } from "./utils";

describe("cn utility", () => {
    it("should merge class names correctly", () => {
        const result = cn("class1", "class2", undefined, "class3");
        expect(result).toBe("class1 class2 class3");
    });

    it("should handle conditional classes", () => {
        const result = cn("base", true && "conditional", false && "not-included");
        expect(result).toBe("base conditional");
    });
});
