import { authProvider } from "./authProvider";
import { fetchUtils } from "react-admin";
import { jwtDecode } from "jwt-decode";
import { updateTokenHelper } from "@/helpers/updateTokenHelper";

jest.mock("react-admin", () => ({
    fetchUtils: { fetchJson: jest.fn() }
}));
jest.mock("jwt-decode", () => ({ jwtDecode: jest.fn() }));
jest.mock("@/helpers/updateTokenHelper", () => ({
    updateTokenHelper: jest.fn()
}));

const mockFetchJson = fetchUtils.fetchJson as jest.Mock;
const mockJwtDecode = jwtDecode as jest.Mock;
const mockUpdateTokenHelper = updateTokenHelper as jest.Mock;

beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    jest.clearAllMocks();
});

describe("authProvider.login", () => {
    it("успешный login (пароль)", async () => {
        mockFetchJson.mockResolvedValue({
            json: { access_token: "AT", refresh_token: "RT" }
        });
        mockJwtDecode.mockReturnValue({ sub: "123", name: "User" });

        await authProvider.login({
            username: "u",
            password: "p"
        });

        expect(localStorage.getItem("access-token")).toBe("AT");
        expect(localStorage.getItem("refresh-token")).toBe("RT");
        expect(localStorage.getItem("user")).toContain("123");
    });

    it("ошибка login → reject", async () => {
        mockFetchJson.mockRejectedValue(new Error("fail"));
        await expect(authProvider.login({ username: "u", password: "p" })).rejects.toThrow("fail");
    });
});

describe("authProvider.logout", () => {
    it("отправляет revoke при refresh-token", async () => {
        localStorage.setItem("refresh-token", "RT");
        mockFetchJson.mockResolvedValue({});

        await authProvider.logout!(undefined);

        expect(mockFetchJson).toHaveBeenCalledWith(expect.stringContaining("revoke"), expect.any(Object));
        expect(localStorage.getItem("refresh-token")).toBeNull();
    });

    it("просто очищает данные если refresh-token нет", async () => {
        await authProvider.logout!(undefined);
        expect(localStorage.getItem("user")).toBeNull();
    });
});

describe("authProvider.checkAuth", () => {
    it("вызывает updateTokenHelper", async () => {
        await authProvider.checkAuth!(undefined);
        expect(mockUpdateTokenHelper).toHaveBeenCalled();
    });
});

describe("authProvider.checkError", () => {
    it("401 → пробует обновить токен", async () => {
        mockUpdateTokenHelper.mockResolvedValue(undefined);
        localStorage.setItem("access-token", "AAA");

        await authProvider.checkError({ status: 401 });

        expect(localStorage.getItem("access-token")).toBeNull();
        expect(mockUpdateTokenHelper).toHaveBeenCalled();
    });
});

describe("authProvider.getPermissions", () => {
    it("нет токена → reject", async () => {
        await expect(authProvider.getPermissions!(undefined)).rejects.toBeUndefined();
    });

    it("roles=admin → admin", async () => {
        localStorage.setItem("access-token", "AT");
        mockJwtDecode.mockReturnValue({ realm_access: { roles: ["admin"] } });

        await expect(authProvider.getPermissions!(undefined)).resolves.toBe("admin");
    });
});

describe("authProvider.getIdentity", () => {
    it("возвращает id и fullName из user", async () => {
        localStorage.setItem("user", JSON.stringify({ sub: "ID123", name: "User Name" }));

        await expect(authProvider.getIdentity!(undefined)).resolves.toEqual({
            id: "ID123",
            fullName: "User Name"
        });
    });
});
