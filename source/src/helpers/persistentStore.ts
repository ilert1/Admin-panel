import { localStorageStore, Store } from "react-admin";

export const createPersistentStore = (keyword: string, resources: string[]): Store => {
    const baseStore = localStorageStore(undefined, keyword);

    return {
        ...baseStore,

        setup: () => {
            baseStore.setup();
            resources.forEach(key => {
                if (!baseStore.getItem(`${key}.listParams`)) {
                    baseStore.setItem(`${key}.listParams`, {
                        filter: {},
                        order: "ASC",
                        page: 1,
                        perPage: 25,
                        sort: "id"
                    });
                }
            });
        },

        reset: () => {
            /* const preservedData: Record<string, string> = {};
            resources.forEach(key => {
                preservedData[key] = baseStore.getItem(`${key}.listParams`);
            });

            baseStore.reset();

            resources.forEach(key => {
                if (preservedData[key] !== undefined) {
                    baseStore.setItem(`${key}.listParams`, preservedData[key]);
                }
            }); */
        }
    };
};

export const setListsParams = (store: Store, resources: string[]) => {
    const defaultListParams = {
        filter: {},
        order: "ASC",
        page: 1,
        perPage: 25,
        sort: "id"
    };

    resources.forEach(resource => {
        if (!store.getItem(`${resource}.listParams`)) {
            store.setItem(`${resource}.listParams`, {
                ...defaultListParams
            });
        }
    });
};

export const resources = [
    "accounts",
    "transactions/view",
    "withdraw",
    "users",
    "merchant",
    "provider",
    "terminals",
    "direction",
    "currency",
    "payment_type",
    "financialInstitution",
    "systemPaymentInstruments",
    "terminalPaymentInstruments",
    "callbridge/v1/mapping",
    "callbridge/v1/history",
    "merchant/wallet",
    "transaction",
    "reconciliation"
];
export const initializeStore = (): Store | undefined => {
    const store = createPersistentStore("backoffice", resources);
    return store;
};
