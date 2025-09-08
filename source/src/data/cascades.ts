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
    CascadeCreate,
    CascadeEndpointsListCascadesEnigmaV1CascadeGetSortOrder,
    CascadeKind,
    CascadeRead,
    CascadeSchema,
    CascadeState,
    CascadeType,
    CascadeUpdate
} from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import {
    cascadeEndpointsCreateCascadeEnigmaV1CascadePost,
    cascadeEndpointsDeleteCascadeEnigmaV1CascadeCascadeIdDelete,
    cascadeEndpointsGetCascadeEnigmaV1CascadeCascadeIdGet,
    cascadeEndpointsListCascadesByMerchantIdEnigmaV1CascadeMerchantMerchantIdGet,
    cascadeEndpointsListCascadesEnigmaV1CascadeGet,
    cascadeEndpointsUpdateCascadeEnigmaV1CascadeCascadeIdPut
} from "@/api/enigma/cascade/cascade";

export const CASCADE_TYPE = Object.values(CascadeType);
export const CASCADE_STATE = Object.values(CascadeState);
export const CASCADE_KIND = Object.values(CascadeKind);

export interface CascadeUpdateParams extends CascadeUpdate {
    id: string;
}

export class CascadesDataProvider extends IBaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult<CascadeSchema>> {
        let res;
        const fieldsForSearch = params.filter
            ? Object.keys(params.filter).filter(
                  item =>
                      item === "name" ||
                      item === "type" ||
                      item === "cascade_kind" ||
                      item === "state" ||
                      item === "src_currency_code"
              )
            : [];

        if (params.filter.merchant) {
            res = await cascadeEndpointsListCascadesByMerchantIdEnigmaV1CascadeMerchantMerchantIdGet(
                params.filter.merchant,
                {
                    currentPage: params?.pagination?.page,
                    pageSize: params?.pagination?.perPage,
                    ...(fieldsForSearch.length > 0 && {
                        searchMode: "starts_with",
                        searchField: fieldsForSearch,
                        searchString: fieldsForSearch.map(item => params.filter?.[item])
                    }),
                    ...(params.sort?.order && {
                        sortOrder:
                            params.sort.order.toLowerCase() as CascadeEndpointsListCascadesEnigmaV1CascadeGetSortOrder
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
        } else {
            res = await cascadeEndpointsListCascadesEnigmaV1CascadeGet(
                {
                    currentPage: params?.pagination?.page,
                    pageSize: params?.pagination?.perPage,
                    ...(fieldsForSearch.length > 0 && {
                        searchMode: "starts_with",
                        searchField: fieldsForSearch,
                        searchString: fieldsForSearch.map(item => params.filter?.[item])
                    }),
                    ...(params.sort?.order && {
                        sortOrder:
                            params.sort.order.toLowerCase() as CascadeEndpointsListCascadesEnigmaV1CascadeGetSortOrder
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
        }

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

    async getListWithoutPagination(resource: string, signal?: AbortSignal): Promise<GetListResult<CascadeSchema>> {
        const res = await cascadeEndpointsListCascadesEnigmaV1CascadeGet(
            {
                currentPage: 1,
                pageSize: 10000
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

    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult<CascadeSchema>> {
        const res = await cascadeEndpointsGetCascadeEnigmaV1CascadeCascadeIdGet(params.id, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("access-token")}`
            },
            signal: params.signal || params.meta?.signal
        });

        if ("data" in res.data && res.data.success) {
            return {
                data: res.data.data
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return Promise.reject();
    }

    async create(resource: string, params: CreateParams<CascadeCreate>): Promise<CreateResult<CascadeRead>> {
        const res = await cascadeEndpointsCreateCascadeEnigmaV1CascadePost(params.data as CascadeCreate, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        });

        if ("data" in res.data && res.data.success) {
            return {
                data: res.data.data
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return Promise.reject();
    }

    async update(resource: string, params: UpdateParams<CascadeUpdateParams>): Promise<UpdateResult<CascadeSchema>> {
        const res = await cascadeEndpointsUpdateCascadeEnigmaV1CascadeCascadeIdPut(
            params.id,
            params.data as CascadeUpdate,
            {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("access-token")}`
                }
            }
        );

        if ("data" in res.data && res.data.success) {
            return {
                data: res.data.data
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return Promise.reject();
    }

    async delete(resource: string, params: DeleteParams): Promise<DeleteResult<Pick<CascadeSchema, "id">>> {
        const res = await cascadeEndpointsDeleteCascadeEnigmaV1CascadeCascadeIdDelete(params.id, {
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
