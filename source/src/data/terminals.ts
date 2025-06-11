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
    poolTerminalEndpointsAllTerminalsEnigmaV1TerminalGet,
    terminalEndpointsAddPaymentTypesToTerminalEnigmaV1ProviderProviderNameTerminalTerminalIdAddPaymentTypesPatch,
    terminalEndpointsCreateCallbackEnigmaV1ProviderProviderNameTerminalTerminalIdCallbackPost,
    terminalEndpointsCreateTerminalEnigmaV1ProviderProviderNameTerminalPost,
    terminalEndpointsDeleteTerminalEnigmaV1ProviderProviderNameTerminalTerminalIdDelete,
    terminalEndpointsGetTerminalEnigmaV1ProviderProviderNameTerminalTerminalIdGet,
    terminalEndpointsRemovePaymentTypeFromTerminalEnigmaV1ProviderProviderNameTerminalTerminalIdRemovePaymentTypePaymentTypeCodeDelete,
    terminalEndpointsUpdateTerminalEnigmaV1ProviderProviderNameTerminalTerminalIdPut
} from "@/api/enigma/terminal/terminal";
import {
    PaymentTypesLink,
    Terminal,
    TerminalCreate,
    TerminalUpdateCallbackUrl
} from "@/api/enigma/blowFishEnigmaAPIService.schemas";

export type TerminalWithId = Terminal & { id: string };

export class TerminalsDataProvider extends IBaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult<TerminalWithId>> {
        const fieldsForSearch = Object.keys(params.filter).filter(
            item => item === "verbose_name" || item === "provider"
        );

        const res = await poolTerminalEndpointsAllTerminalsEnigmaV1TerminalGet(
            {
                currentPage: params?.pagination?.page,
                pageSize: params?.pagination?.perPage,
                ...(fieldsForSearch.length > 0 && { searchField: fieldsForSearch }),
                ...(fieldsForSearch.length > 0 && { searchString: fieldsForSearch.map(item => params.filter?.[item]) }),
                ...(params.filter?.asc && { sortOrder: params.filter?.asc?.toLowerCase() }),
                ...(params.filter?.sort && { orderBy: params.filter?.sort?.toLowerCase() })
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

    async getListWithoutPagination(searchField?: string[], searchString?: string[]) {
        const res = await poolTerminalEndpointsAllTerminalsEnigmaV1TerminalGet(
            {
                currentPage: 1,
                pageSize: 1000,
                ...(searchField && searchField.length > 0 && { searchField }),
                ...(searchString && searchString.length > 0 && { searchString })
            },
            {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("access-token")}`
                }
            }
        );

        if ("data" in res.data && res.data.success) {
            return {
                data: res.data.data.items,
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
        // resource === "${providerName}/terminal"
        const providerName = resource.split("/")[0];

        const res = await terminalEndpointsGetTerminalEnigmaV1ProviderProviderNameTerminalTerminalIdGet(
            providerName,
            params.id,
            {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("access-token")}`
                },
                signal: params.signal || params.meta?.signal
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

    async create(resource: string, params: CreateParams): Promise<CreateResult<TerminalWithId>> {
        // resource === "${providerName}/terminal"
        const providerName = resource.split("/")[0];

        const res = await terminalEndpointsCreateTerminalEnigmaV1ProviderProviderNameTerminalPost(
            providerName,
            params.data as TerminalCreate,
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

    async update(resource: string, params: UpdateParams): Promise<UpdateResult<TerminalWithId>> {
        // resource === "${providerName}/terminal"
        const providerName = resource.split("/")[0];

        const res = await terminalEndpointsUpdateTerminalEnigmaV1ProviderProviderNameTerminalTerminalIdPut(
            providerName,
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

    async addPaymentTypes(
        params: UpdateParams & { data: PaymentTypesLink; providerName: string }
    ): Promise<UpdateResult<TerminalWithId>> {
        const res =
            await terminalEndpointsAddPaymentTypesToTerminalEnigmaV1ProviderProviderNameTerminalTerminalIdAddPaymentTypesPatch(
                params.providerName,
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

    async removePaymentType(
        params: UpdateParams & { data: { code: string }; providerName: string }
    ): Promise<UpdateResult<TerminalWithId>> {
        const res =
            await terminalEndpointsRemovePaymentTypeFromTerminalEnigmaV1ProviderProviderNameTerminalTerminalIdRemovePaymentTypePaymentTypeCodeDelete(
                params.providerName,
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
        // resource === "${providerName}/terminal"
        const providerName = resource.split("/")[0];

        const res = await terminalEndpointsDeleteTerminalEnigmaV1ProviderProviderNameTerminalTerminalIdDelete(
            providerName,
            params.id,
            {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("access-token")}`
                }
            }
        );

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

    async createCallback(resource: string, params: { id: string; data: TerminalUpdateCallbackUrl }) {
        const providerName = resource.split("/")[0];

        const res = await terminalEndpointsCreateCallbackEnigmaV1ProviderProviderNameTerminalTerminalIdCallbackPost(
            providerName,
            params.id,
            params.data,
            {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("access-token")}`
                }
            }
        );

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
}
