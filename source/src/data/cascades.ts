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
    CascadeRead,
    CascadeSchema,
    DirectionCreate
} from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import {
    cascadeEndpointsCreateCascadeEnigmaV1CascadePost,
    cascadeEndpointsDeleteCascadeEnigmaV1CascadeCascadeIdDelete,
    cascadeEndpointsGetCascadeEnigmaV1CascadeCascadeIdGet,
    cascadeEndpointsListCascadesEnigmaV1CascadeGet,
    cascadeEndpointsUpdateCascadeEnigmaV1CascadeCascadeIdPut
} from "@/api/enigma/cascade/cascade";

export class CascadesDataProvider extends IBaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult<CascadeSchema>> {
        const fieldsForSearch = params.filter
            ? Object.keys(params.filter).filter(item => item === "type" || item === "src_currency_code")
            : [];

        const res = await cascadeEndpointsListCascadesEnigmaV1CascadeGet(
            {
                currentPage: params?.pagination?.page,
                pageSize: params?.pagination?.perPage,
                ...(fieldsForSearch.length > 0 && { searchField: fieldsForSearch }),
                ...(fieldsForSearch.length > 0 && { searchString: fieldsForSearch.map(item => params.filter?.[item]) })
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

    async create(resource: string, params: CreateParams<DirectionCreate>): Promise<CreateResult<CascadeRead>> {
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

    async update(resource: string, params: UpdateParams): Promise<UpdateResult<CascadeSchema>> {
        const res = await cascadeEndpointsUpdateCascadeEnigmaV1CascadeCascadeIdPut(params.id, params.data, {
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
