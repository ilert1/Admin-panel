import { getStateByRole } from "./getStateByRole";

describe("getStateByRole", () => {
    const mockData: Dictionaries.DataObject = {
        accountStates: {},
        accountTypes: {},
        feeTypes: {},
        participantType: {},
        states: {
            "1": {
                state_int: 1,
                state_description: "Active",
                state_ingress_description: "ingress",
                state_int_ingress: 0,
                final: false
            },
            "2": {
                state_int: 2,
                state_description: "Inactive",
                state_ingress_description: "ingress2",
                state_int_ingress: 1,
                final: true
            }
        },
        ingressStates: {},
        transactionTypes: {}
    };

    it("admin with valid state_id and description", () => {
        expect(getStateByRole("admin", mockData, undefined, 1)).toBe("states.active");
        expect(getStateByRole("admin", mockData, undefined, 2)).toBe("states.inactive");
    });

    it("admin with valid state_id but no description", () => {
        const dataWithoutDescription: Dictionaries.DataObject = {
            ...mockData,
            states: { "3": { state_int_ingress: 0, final: false } }
        };
        expect(getStateByRole("admin", dataWithoutDescription, undefined, 3)).toBe("states.unknown");
    });

    it("admin without state_id", () => {
        expect(getStateByRole("admin", mockData)).toBe("states.unknown");
    });

    it("non-admin with state_id_merchant", () => {
        expect(getStateByRole("user", mockData, 5)).toBe("merchantStates.5");
    });

    it("non-admin without state_id_merchant", () => {
        expect(getStateByRole("user", mockData)).toBe("merchantStates.unknown");
    });

    it("handles undefined data safely for admin", () => {
        expect(getStateByRole("admin", undefined, undefined, 1)).toBe("states.unknown");
    });
});
