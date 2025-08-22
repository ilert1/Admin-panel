import { render, screen } from "@testing-library/react";
import moment from "moment";
import { MessageTime } from "./MessageTime";

moment.locale("en");

describe("MessageTime", () => {
    const mockTimestamp = 1672531200000;

    beforeEach(() => {
        moment.locale("en");
    });

    it("renders formatted time for Russian locale in HH:mm format", () => {
        render(<MessageTime locale="ru" timestamp={mockTimestamp} />);

        const expectedTime = moment(mockTimestamp).locale("ru").format("HH:mm");
        expect(screen.getByText(expectedTime)).toBeInTheDocument();
    });

    it("renders formatted time for English locale in LT format", () => {
        render(<MessageTime locale="en" timestamp={mockTimestamp} />);

        const expectedTime = moment(mockTimestamp).locale("es-us").format("LT");
        expect(screen.getByText(expectedTime)).toBeInTheDocument();
    });

    it("renders formatted time for other locales using LT format", () => {
        render(<MessageTime locale="fr" timestamp={mockTimestamp} />);

        const expectedTime = moment(mockTimestamp).locale("fr").format("LT");
        expect(screen.getByText(expectedTime)).toBeInTheDocument();
    });

    it("handles empty locale by defaulting to Russian format", () => {
        render(<MessageTime locale="" timestamp={mockTimestamp} />);

        const expectedTime = moment(mockTimestamp).locale("ru").format("HH:mm");
        expect(screen.getByText(expectedTime)).toBeInTheDocument();
    });

    it("handles undefined locale by defaulting to Russian format", () => {
        render(<MessageTime timestamp={mockTimestamp} />);

        const expectedTime = moment(mockTimestamp).locale("ru").format("HH:mm");
        expect(screen.getByText(expectedTime)).toBeInTheDocument();
    });

    it("uses different timestamp values correctly", () => {
        const differentTimestamp = 1672617600000;

        render(<MessageTime locale="ru" timestamp={differentTimestamp} />);

        const expectedTime = moment(differentTimestamp).locale("ru").format("HH:mm");
        expect(screen.getByText(expectedTime)).toBeInTheDocument();
    });

    it("renders with correct element type", () => {
        render(<MessageTime locale="ru" timestamp={mockTimestamp} />);

        const timeElement = screen.getByText(moment(mockTimestamp).locale("ru").format("HH:mm"));
        expect(timeElement.tagName).toBe("SPAN");
    });

    it("handles various locale formats correctly", () => {
        const testCases = [
            { locale: "ru", expectedFormat: "HH:mm" },
            { locale: "en", expectedFormat: "LT" },
            { locale: "es", expectedFormat: "LT" },
            { locale: "de", expectedFormat: "LT" },
            { locale: "fr", expectedFormat: "LT" }
        ];

        testCases.forEach(({ locale }) => {
            const { unmount } = render(<MessageTime locale={locale} timestamp={mockTimestamp} />);

            const expectedLocale = locale === "en" ? "es-us" : locale;
            const expectedTime = moment(mockTimestamp)
                .locale(expectedLocale)
                .format(locale === "ru" ? "HH:mm" : "LT");

            expect(screen.getByText(expectedTime)).toBeInTheDocument();
            unmount();
        });
    });

    it("applies correct moment locale for English", () => {
        render(<MessageTime locale="en" timestamp={mockTimestamp} />);

        const expectedTime = moment(mockTimestamp).locale("es-us").format("LT");
        expect(screen.getByText(expectedTime)).toBeInTheDocument();
    });

    it("applies correct moment locale for non-English languages", () => {
        render(<MessageTime locale="de" timestamp={mockTimestamp} />);

        const expectedTime = moment(mockTimestamp).locale("de").format("LT");
        expect(screen.getByText(expectedTime)).toBeInTheDocument();
    });
});
