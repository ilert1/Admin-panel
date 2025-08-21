import { jwtDecode } from "jwt-decode";
import { isTokenStillFresh, parseJWT } from "./jwt";

jest.mock("jwt-decode");

describe("parseJWT", () => {
    it("returns null for invalid token", () => {
        (jwtDecode as jest.Mock).mockImplementation(() => {
            throw new Error("invalid");
        });
        expect(parseJWT("bad.token")).toBeNull();
    });

    it("returns decoded payload for valid token", () => {
        const payload = { exp: Date.now() + 1000 };
        (jwtDecode as jest.Mock).mockReturnValue(payload);
        expect(parseJWT("valid.token")).toBe(payload);
    });
});

describe("isTokenStillFresh", () => {
    beforeEach(() => {
        jest.useFakeTimers().setSystemTime(new Date("2025-08-21T12:00:00Z"));
    });
    afterEach(() => {
        jest.useRealTimers();
    });

    it("returns false for empty token", () => {
        expect(isTokenStillFresh("")).toBe(false);
    });

    it("returns false for invalid token", () => {
        (jwtDecode as jest.Mock).mockImplementation(() => {
            throw new Error("bad");
        });
        expect(isTokenStillFresh("bad.token")).toBe(false);
    });

    it("returns true if exp is in the future", () => {
        const futureExp = new Date("2025-08-21T12:01:00Z").getTime() / 1000;
        (jwtDecode as jest.Mock).mockReturnValue({ exp: futureExp });
        expect(isTokenStillFresh("future.token")).toBe(true);
    });

    it("returns false if exp is in the past", () => {
        const pastExp = new Date("2025-08-21T11:59:00Z").getTime() / 1000;
        (jwtDecode as jest.Mock).mockReturnValue({ exp: pastExp });
        expect(isTokenStillFresh("past.token")).toBe(false);
    });
});
