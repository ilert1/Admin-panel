export const getStateByRole = (
    permissions: string,
    data: Dictionaries.DataObject | undefined,
    state_id_merchant?: number,
    state_id?: number
): string => {
    const st = "states";
    const mst = "merchantStates";

    switch (permissions) {
        case "admin":
            if (!state_id) return `${st}.unknown`;
            return data?.states[state_id]?.state_description
                ? `${st}.${data?.states[state_id]?.state_description?.toLocaleLowerCase()}`
                : `${st}.unknown`;
        default:
            return state_id_merchant ? `${mst}.${state_id_merchant?.toString()}` : `${mst}.unknown`;
    }
};
