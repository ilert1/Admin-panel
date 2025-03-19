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
import { BaseDataProvider } from "./base";
import {
    providerEndpointsCreateProviderEnigmaV1ProviderPost,
    providerEndpointsDeleteProviderEnigmaV1ProviderProviderNameDelete,
    providerEndpointsGetProviderEnigmaV1ProviderProviderNameGet,
    providerEndpointsListProvidersEnigmaV1ProviderGet,
    providerEndpointsUpdateProviderEnigmaV1ProviderProviderNamePut
} from "@/api/enigma/provider/provider";
import { Provider, ProviderCreate } from "@/api/enigma/blowFishEnigmaAPIService.schemas";

export type ProviderWithId = Provider & { id: string };

export class ProvidersDataProvider extends BaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult<ProviderWithId>> {
        const res = await providerEndpointsListProvidersEnigmaV1ProviderGet(
            {
                currentPage: params?.pagination?.page,
                pageSize: params?.pagination?.perPage
            },
            {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("access-token")}`
                },
                signal: params.signal
            }
        );

        if ("data" in res.data && res.data.success) {
            return {
                data: res.data.data.items.map(elem => {
                    return {
                        id: elem.name,
                        ...elem
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

    async getListWithoutPagination(): Promise<GetListResult<ProviderWithId>> {
        const res = await providerEndpointsListProvidersEnigmaV1ProviderGet(
            {
                currentPage: 1,
                pageSize: 1000
            },
            {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("access-token")}`
                }
            }
        );

        if ("data" in res.data && res.data.success) {
            return {
                data: res.data.data.items.map(elem => {
                    return {
                        id: elem.name,
                        ...elem
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

    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult<ProviderWithId>> {
        const res = await providerEndpointsGetProviderEnigmaV1ProviderProviderNameGet(params.id, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("access-token")}`
            },
            signal: params.signal
        });

        if ("data" in res.data && res.data.success) {
            return {
                data: {
                    id: res.data.data.name,
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

    async create(resource: string, params: CreateParams): Promise<CreateResult<ProviderWithId>> {
        const res = await providerEndpointsCreateProviderEnigmaV1ProviderPost(params.data as ProviderCreate, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        });

        if ("data" in res.data && res.data.success) {
            return {
                data: {
                    id: res.data.data.name,
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

    async update(resource: string, params: UpdateParams): Promise<UpdateResult<ProviderWithId>> {
        const res = await providerEndpointsUpdateProviderEnigmaV1ProviderProviderNamePut(params.id, params.data, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        });

        if ("data" in res.data && res.data.success) {
            return {
                data: {
                    id: res.data.data.name,
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

    async delete(resource: string, params: DeleteParams): Promise<DeleteResult<Pick<ProviderWithId, "id">>> {
        const res = await providerEndpointsDeleteProviderEnigmaV1ProviderProviderNameDelete(params.id, {
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
}
