/* eslint-disable @typescript-eslint/no-explicit-any */
import { authFetch } from "./orvalAuthFetchMiddleware";
import { updateTokenHelper } from "./updateTokenHelper";

jest.mock("./updateTokenHelper");
const mockUpdateTokenHelper = updateTokenHelper as jest.MockedFunction<typeof updateTokenHelper>;

const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn()
};
Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

const mockFetch = jest.fn();
global.fetch = mockFetch;

const createMockResponse = (options: {
    ok: boolean;
    status: number;
    statusText?: string;
    json?: any;
    headers?: Record<string, string>;
}) => {
    const headers = new Headers(options.headers);

    const headersMap = new Map();
    if (options.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
            headersMap.set(key, value);
        });
    }

    return {
        ok: options.ok,
        status: options.status,
        statusText: options.statusText || "",
        headers: {
            get: (name: string) => headers.get(name),
            has: (name: string) => headers.has(name),
            entries: () => headers.entries(),
            forEach: (callback: any) => headers.forEach(callback),
            [Symbol.iterator]: () => headers[Symbol.iterator]()
        },
        json: jest.fn().mockImplementation(() => Promise.resolve(options.json))
    };
};

beforeEach(() => {
    jest.clearAllMocks();
    mockUpdateTokenHelper.mockResolvedValue(undefined);
    mockLocalStorage.getItem.mockReset();
});

describe("authFetch", () => {
    const mockUrl = "/api/test";
    const mockToken = "test-token-123";
    const mockSuccessData = { data: "test" };
    const mockErrorData = { error: "Unauthorized" };

    describe("1. Успешные запросы", () => {
        it("1.1. Добавляет токен в заголовки когда он есть в localStorage", async () => {
            mockLocalStorage.getItem.mockReturnValue(mockToken);
            const mockResponse = createMockResponse({
                ok: true,
                status: 200,
                json: mockSuccessData
            });
            mockFetch.mockResolvedValue(mockResponse);

            const result = await authFetch<{ data: string }>(mockUrl);

            expect(mockUpdateTokenHelper).toHaveBeenCalledTimes(1);
            expect(mockLocalStorage.getItem).toHaveBeenCalledWith("access-token");

            const fetchCall = mockFetch.mock.calls[0];
            const requestInit = fetchCall[1] as RequestInit;
            const requestHeaders = requestInit?.headers as Headers;

            expect(requestHeaders.get("Authorization")).toBe(`Bearer ${mockToken}`);

            expect(result).toEqual({
                data: mockSuccessData,
                status: 200,
                headers: expect.any(Object)
            });
        });

        it("1.2. Не добавляет токен когда его нет в localStorage", async () => {
            mockLocalStorage.getItem.mockReturnValue(null);
            const mockResponse = createMockResponse({
                ok: true,
                status: 200,
                json: mockSuccessData
            });
            mockFetch.mockResolvedValue(mockResponse);

            await authFetch(mockUrl);

            const fetchCall = mockFetch.mock.calls[0];
            const requestInit = fetchCall[1] as RequestInit;
            const requestHeaders = requestInit?.headers as Headers;

            expect(requestHeaders.get("Authorization")).toBeNull();
        });

        it("1.3. Сохраняет оригинальные заголовки и настройки", async () => {
            const initOptions: RequestInit = {
                method: "POST",
                headers: { "Content-Type": "application/json", "X-Custom": "value" }
            };

            const mockResponse = createMockResponse({
                ok: true,
                status: 200,
                json: mockSuccessData
            });
            mockFetch.mockResolvedValue(mockResponse);

            await authFetch(mockUrl, initOptions);

            const fetchCall = mockFetch.mock.calls[0];
            const requestInit = fetchCall[1] as RequestInit;
            const requestHeaders = requestInit?.headers as Headers;

            expect(requestInit.method).toBe("POST");
            expect(requestHeaders.get("Content-Type")).toBe("application/json");
            expect(requestHeaders.get("X-Custom")).toBe("value");
        });
    });

    describe("2. Обработка ошибок", () => {
        it("2.1. Обрабатывает ошибку с JSON-телом", async () => {
            const mockResponse = createMockResponse({
                ok: false,
                status: 401,
                json: mockErrorData
            });
            mockFetch.mockResolvedValue(mockResponse);

            await expect(authFetch(mockUrl)).rejects.toEqual({
                status: 401,
                headers: expect.any(Object),
                statusText: ""
            });
        });

        it("2.2. Обрабатывает ошибку без JSON-тела", async () => {
            const mockResponse = {
                ok: false,
                status: 500,
                statusText: "Server Error",
                headers: {
                    get: () => null,
                    has: () => false,
                    entries: () => [][Symbol.iterator](),
                    forEach: () => {},
                    [Symbol.iterator]: () => [][Symbol.iterator]()
                },
                json: jest.fn().mockRejectedValue(new Error("Parse error"))
            };
            mockFetch.mockResolvedValue(mockResponse as any);

            await expect(authFetch(mockUrl)).rejects.toEqual({
                status: 500,
                statusText: "Server Error",
                headers: expect.any(Object)
            });
        });
    });

    describe("3. Исключительные ситуации", () => {
        it("3.1. Пробрасывает ошибку при сбое updateTokenHelper", async () => {
            const tokenError = new Error("Token update failed");
            mockUpdateTokenHelper.mockRejectedValue(tokenError);

            await expect(authFetch(mockUrl)).rejects.toThrow("Token update failed");
            expect(mockFetch).not.toHaveBeenCalled();
        });

        it("3.2. Корректно обрабатывает успешный ответ без контента (204)", async () => {
            const mockResponse = {
                ok: true,
                status: 204,
                statusText: "No Content",
                headers: {
                    get: () => null,
                    has: () => false,
                    entries: () => [][Symbol.iterator](),
                    forEach: () => {},
                    [Symbol.iterator]: () => [][Symbol.iterator]()
                },
                json: jest.fn()
            };
            mockFetch.mockResolvedValue(mockResponse as any);

            const result = await authFetch(mockUrl);

            expect(result).toEqual({
                data: undefined,
                status: 204,
                headers: expect.any(Object)
            });
        });

        it("3.3. Обрабатывает сетевые ошибки", async () => {
            mockFetch.mockRejectedValue(new Error("Network error"));

            await expect(authFetch(mockUrl)).rejects.toThrow("Network error");
        });
    });

    describe("4. Edge cases", () => {
        it("4.1. Работает без init параметров", async () => {
            const mockResponse = createMockResponse({
                ok: true,
                status: 200,
                json: mockSuccessData
            });
            mockFetch.mockResolvedValue(mockResponse);

            await expect(authFetch(mockUrl)).resolves.toBeDefined();
        });

        it("4.2. Работает с пустыми заголовками в init", async () => {
            const mockResponse = createMockResponse({
                ok: true,
                status: 200,
                json: mockSuccessData
            });
            mockFetch.mockResolvedValue(mockResponse);

            await expect(authFetch(mockUrl, { headers: {} })).resolves.toBeDefined();
        });
    });
});
