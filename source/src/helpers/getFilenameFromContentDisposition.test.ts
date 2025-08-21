import { getFilenameFromContentDisposition } from "./getFilenameFromContentDisposition";

describe("getFilenameFromContentDisposition", () => {
    it("returns filename from quoted value", () => {
        const header = 'attachment; filename="example.txt"';
        expect(getFilenameFromContentDisposition(header, "default.txt")).toBe("example.txt");
    });

    it("returns filename from unquoted value", () => {
        const header = "attachment; filename=example2.txt";
        expect(getFilenameFromContentDisposition(header, "default.txt")).toBe("example2.txt");
    });

    it("decodes URI component correctly", () => {
        const header = "attachment; filename=%E2%9C%93.txt"; // ✓.txt
        expect(getFilenameFromContentDisposition(header, "default.txt")).toBe("✓.txt");
    });

    it("returns defaultName if filename is missing", () => {
        const header = "attachment; name=notafile";
        expect(getFilenameFromContentDisposition(header, "default.txt")).toBe("default.txt");
    });

    it("handles invalid URI encoding gracefully", () => {
        const header = "attachment; filename=%E0%A4%A"; // invalid URI
        const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
        expect(getFilenameFromContentDisposition(header, "default.txt")).toBe("%E0%A4%A");
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
});
