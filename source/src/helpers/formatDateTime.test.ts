import { formatDateTime } from "./formatDateTime";

const createFixedDate = (components: {
    year?: number;
    month?: number;
    day?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    ms?: number;
}): Date => {
    const date = new Date();

    jest.spyOn(date, "getFullYear").mockReturnValue(components.year ?? 2024);
    jest.spyOn(date, "getMonth").mockReturnValue((components.month ?? 1) - 1);
    jest.spyOn(date, "getDate").mockReturnValue(components.day ?? 15);
    jest.spyOn(date, "getHours").mockReturnValue(components.hours ?? 14);
    jest.spyOn(date, "getMinutes").mockReturnValue(components.minutes ?? 30);
    jest.spyOn(date, "getSeconds").mockReturnValue(components.seconds ?? 45);
    jest.spyOn(date, "getMilliseconds").mockReturnValue(components.ms ?? 123);

    return date;
};

describe("formatDateTime with helper", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should format date correctly", () => {
        const date = createFixedDate({
            year: 2024,
            month: 1,
            day: 15,
            hours: 14,
            minutes: 30,
            seconds: 45,
            ms: 123
        });

        const result = formatDateTime(date);
        expect(result).toBe("15.01.2024 14:30:45.123");
    });

    it("should pad single digits", () => {
        const date = createFixedDate({
            day: 5,
            month: 1,
            hours: 9,
            minutes: 5,
            seconds: 7,
            ms: 9
        });

        const result = formatDateTime(date);
        expect(result).toBe("05.01.2024 09:05:07.009");
    });
});
