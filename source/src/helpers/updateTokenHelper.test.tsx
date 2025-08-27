import { updateTokenHelper } from "./updateTokenHelper";
import { fetchUtils } from "react-admin";
import { jwtDecode } from "jwt-decode";
import { isTokenStillFresh } from "./jwt";

jest.mock("jwt-decode", () => ({
    jwtDecode: jest.fn()
}));

jest.mock("react-admin", () => ({
    fetchUtils: {
        fetchJson: jest.fn()
    }
}));

jest.mock("./jwt", () => ({
    isTokenStillFresh: jest.fn()
}));

const mockedFetchJson = fetchUtils.fetchJson as jest.Mock;
const mockedJwtDecode = jwtDecode as jest.Mock;
const mockedIsTokenStillFresh = isTokenStillFresh as jest.Mock;

describe("updateTokenHelper", () => {
    const ACCESS_TOKEN = "ACCESS_TOKEN";
    const REFRESH_TOKEN = "REFRESH_TOKEN";
    const USER = { sub: "123" };

    beforeEach(() => {
        localStorage.clear();
        jest.resetAllMocks();
    });

    it("resolves immediately if access token is still fresh", async () => {
        localStorage.setItem("access-token", ACCESS_TOKEN);
        mockedIsTokenStillFresh.mockImplementation(t => t === ACCESS_TOKEN);

        await expect(updateTokenHelper()).resolves.toBeUndefined();
        expect(mockedIsTokenStillFresh).toHaveBeenCalledWith(ACCESS_TOKEN);
        expect(mockedFetchJson).not.toHaveBeenCalled();
    });

    it("refreshes token if access expired but refresh is fresh", async () => {
        localStorage.setItem("access-token", ACCESS_TOKEN);
        localStorage.setItem("refresh-token", REFRESH_TOKEN);

        mockedIsTokenStillFresh.mockImplementation(t => (t === REFRESH_TOKEN ? true : false));

        mockedFetchJson.mockResolvedValue({
            json: {
                access_token: "NEW_ACCESS",
                refresh_token: "NEW_REFRESH"
            }
        });
        mockedJwtDecode.mockReturnValue(USER);

        await expect(updateTokenHelper()).resolves.toBeUndefined();

        expect(localStorage.getItem("access-token")).toBe("NEW_ACCESS");
        expect(localStorage.getItem("refresh-token")).toBe("NEW_REFRESH");
        expect(localStorage.getItem("user")).toBe(JSON.stringify(USER));
    });

    it("clears storage if refresh response is invalid", async () => {
        localStorage.setItem("refresh-token", REFRESH_TOKEN);
        mockedIsTokenStillFresh.mockReturnValue(true);

        mockedFetchJson.mockResolvedValue({
            json: {}
        });

        await expect(updateTokenHelper()).rejects.toThrow("Invalid token response");

        expect(localStorage.getItem("access-token")).toBeNull();
        expect(localStorage.getItem("refresh-token")).toBeNull();
        expect(localStorage.getItem("user")).toBeNull();
    });

    it("clears storage if refresh request fails", async () => {
        localStorage.setItem("refresh-token", REFRESH_TOKEN);
        mockedIsTokenStillFresh.mockReturnValue(true);

        mockedFetchJson.mockRejectedValue(new Error("network error"));

        await expect(updateTokenHelper()).rejects.toThrow("network error");

        expect(localStorage.getItem("access-token")).toBeNull();
        expect(localStorage.getItem("refresh-token")).toBeNull();
        expect(localStorage.getItem("user")).toBeNull();
    });

    it("rejects if no valid tokens are available", async () => {
        await expect(updateTokenHelper()).rejects.toBeUndefined();
    });

    it("prevents multiple parallel refresh requests (refreshPromise reuse)", async () => {
        localStorage.setItem("refresh-token", REFRESH_TOKEN);
        mockedIsTokenStillFresh.mockReturnValue(true);

        mockedFetchJson.mockResolvedValue({
            json: {
                access_token: "NEW_ACCESS",
                refresh_token: "NEW_REFRESH"
            }
        });
        mockedJwtDecode.mockReturnValue(USER);

        const p1 = updateTokenHelper();
        const p2 = updateTokenHelper();

        expect(p1).toStrictEqual(p2);

        await expect(p1).resolves.toBeUndefined();
        await expect(p2).resolves.toBeUndefined();

        expect(localStorage.getItem("access-token")).toBe("NEW_ACCESS");
        expect(localStorage.getItem("refresh-token")).toBe("NEW_REFRESH");
        expect(localStorage.getItem("user")).toBe(JSON.stringify(USER));
    });
});
