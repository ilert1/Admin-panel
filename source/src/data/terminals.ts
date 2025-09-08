import {
    CreateParams,
    CreateResult,
    DeleteParams,
    DeleteResult,
    GetListParams,
    GetListResult,
    GetOneParams,
    GetOneResult,
    UpdateParams,
    UpdateResult
} from "react-admin";
import { IBaseDataProvider } from "./base";
import {
    PaymentTypesLink,
    TerminalCreate,
    TerminalEndpointsAllTerminalsEnigmaV1TerminalGetSortOrder,
    TerminalRead
} from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import {
    terminalEndpointsAddPaymentTypesToTerminalEnigmaV1TerminalTerminalIdAddPaymentTypesPatch,
    terminalEndpointsAllTerminalsEnigmaV1TerminalGet,
    terminalEndpointsCreateCallbackEnigmaV1TerminalTerminalIdCallbackPost,
    terminalEndpointsCreateTerminalEnigmaV1TerminalPost,
    terminalEndpointsDeleteTerminalEnigmaV1TerminalTerminalIdDelete,
    terminalEndpointsGetTerminalEnigmaV1TerminalTerminalIdGet,
    terminalEndpointsRemovePaymentTypeFromTerminalEnigmaV1TerminalTerminalIdRemovePaymentTypePaymentTypeCodeDelete,
    terminalEndpointsUpdateTerminalEnigmaV1TerminalTerminalIdPut
} from "@/api/enigma/terminal/terminal";

export interface TerminalWithId extends TerminalRead {
    id: string;
}

export class TerminalsDataProvider extends IBaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult<TerminalWithId>> {
        const fieldsForSearch = Object.keys(params.filter).filter(
            item => item === "terminal_id" || item === "verbose_name" || item === "provider"
        );

        const res = await terminalEndpointsAllTerminalsEnigmaV1TerminalGet(
            {
                currentPage: params?.pagination?.page,
                pageSize: params?.pagination?.perPage,
                ...(fieldsForSearch.length > 0 && { searchField: fieldsForSearch }),
                ...(fieldsForSearch.length > 0 && { searchString: fieldsForSearch.map(item => params.filter?.[item]) }),
                ...(params.sort?.order && {
                    sortOrder:
                        params.sort.order.toLowerCase() as TerminalEndpointsAllTerminalsEnigmaV1TerminalGetSortOrder
                }),
                ...(params.sort?.field && { orderBy: params.sort.field.toLowerCase() })
            },
            {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("access-token")}`
                },
                signal: params.signal || params.filter?.signal
            }
        );

        if ("data" in res.data && res.data.success) {
            return {
                data: res.data.data.items.map(elem => {
                    return {
                        ...elem,
                        id: elem.terminal_id
                    };
                }),
                total: res.data.data.total
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return {
            data: [],
            total: 0
        };
    }

    async getListWithoutPagination(
        resource: string,
        searchField?: string[],
        searchString?: string[],
        signal?: AbortSignal
    ): Promise<GetListResult<TerminalWithId>> {
        const res = await terminalEndpointsAllTerminalsEnigmaV1TerminalGet(
            {
                currentPage: 1,
                pageSize: 10000,
                ...(searchField && searchField.length > 0 && { searchField }),
                ...(searchString && searchString.length > 0 && { searchString })
            },
            {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("access-token")}`
                },
                signal
            }
        );

        if ("data" in res.data && res.data.success) {
            return {
                data: res.data.data.items.map(elem => {
                    return {
                        ...elem,
                        id: elem.terminal_id
                    };
                }),
                total: res.data.data.total
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return {
            data: [],
            total: 0
        };
    }

    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult<TerminalWithId>> {
        const res = await terminalEndpointsGetTerminalEnigmaV1TerminalTerminalIdGet(params.id, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("access-token")}`
            },
            signal: params.signal || params.meta?.signal
        });

        if ("data" in res.data && res.data.success) {
            return {
                data: {
                    id: res.data.data.terminal_id,
                    ...res.data.data
                }
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return Promise.reject();
    }

    async create(resource: string, params: CreateParams): Promise<CreateResult<TerminalWithId>> {
        const res = await terminalEndpointsCreateTerminalEnigmaV1TerminalPost(params.data as TerminalCreate, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        });

        if ("data" in res.data && res.data.success) {
            return {
                data: {
                    id: res.data.data.terminal_id,
                    ...res.data.data
                }
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return Promise.reject();
    }

    async update(resource: string, params: UpdateParams): Promise<UpdateResult<TerminalWithId>> {
        const res = await terminalEndpointsUpdateTerminalEnigmaV1TerminalTerminalIdPut(params.id, params.data, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        });

        if ("data" in res.data && res.data.success) {
            return {
                data: {
                    id: res.data.data.terminal_id,
                    ...res.data.data
                }
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return Promise.reject();
    }

    async addPaymentTypes(params: UpdateParams & { data: PaymentTypesLink }): Promise<UpdateResult<TerminalWithId>> {
        const res = await terminalEndpointsAddPaymentTypesToTerminalEnigmaV1TerminalTerminalIdAddPaymentTypesPatch(
            params.id,
            params.data,
            {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("access-token")}`
                }
            }
        );

        if ("data" in res.data && res.data.success) {
            return {
                data: {
                    id: res.data.data.terminal_id,
                    ...res.data.data
                }
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return Promise.reject();
    }

    async removePaymentType(params: UpdateParams & { data: { code: string } }): Promise<UpdateResult<TerminalWithId>> {
        const res =
            await terminalEndpointsRemovePaymentTypeFromTerminalEnigmaV1TerminalTerminalIdRemovePaymentTypePaymentTypeCodeDelete(
                params.id,
                params.data.code,
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("access-token")}`
                    }
                }
            );

        if ("data" in res.data && res.data.success) {
            return {
                data: {
                    id: res.data.data.terminal_id,
                    ...res.data.data
                }
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return Promise.reject();
    }

    async delete(resource: string, params: DeleteParams): Promise<DeleteResult<Pick<TerminalWithId, "id">>> {
        const res = await terminalEndpointsDeleteTerminalEnigmaV1TerminalTerminalIdDelete(params.id, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        });

        if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return {
            data: {
                id: params.id
            }
        };
    }

    async createCallback(terminalId: string) {
        const res = await terminalEndpointsCreateCallbackEnigmaV1TerminalTerminalIdCallbackPost(terminalId, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        });

        if ("data" in res.data && res.data.success) {
            return {
                data: {
                    id: res.data.data.terminal_id
                }
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return Promise.reject();

        // if ("data" in res.data && !res.data.success) {
        //     throw new Error(res.data.error?.error_message);
        // } else if ("detail" in res.data) {
        //     throw new Error(res.data.detail?.[0].msg);
        // }

        // return {
        //     data: {
        //         id: res.data
        //     }
        // };
    }
}
