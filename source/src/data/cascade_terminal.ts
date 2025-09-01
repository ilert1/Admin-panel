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
import { CascadeTerminalCreate, CascadeTerminalSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import {
    cascadeTerminalEndpointsCreateCascadeTerminalEnigmaV1CascadeTerminalPost,
    cascadeTerminalEndpointsGetCascadeTerminalEnigmaV1CascadeTerminalCascadeTerminalIdGet,
    cascadeTerminalEndpointsListCascadeTerminalsEnigmaV1CascadeTerminalGet,
    cascadeTerminalEndpointsRemoveTerminalFromCascadeEnigmaV1CascadeTerminalCascadeTerminalIdDelete,
    cascadeTerminalEndpointsUpdateCascadeTerminalEnigmaV1CascadeTerminalCascadeTerminalIdPut
} from "@/api/enigma/cascade-terminal/cascade-terminal";

export class CascadeTerminalDataProvider extends IBaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult<CascadeTerminalSchema>> {
        const fieldsForSearch = params.filter
            ? Object.keys(params.filter).filter(item => item === "cascade_id" || item === "terminal_id")
            : [];

        const res = await cascadeTerminalEndpointsListCascadeTerminalsEnigmaV1CascadeTerminalGet(
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
        }

        return {
            data: [],
            total: 0
        };
    }

    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult<CascadeTerminalSchema>> {
        const res = await cascadeTerminalEndpointsGetCascadeTerminalEnigmaV1CascadeTerminalCascadeTerminalIdGet(
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
                data: res.data.data
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return Promise.reject();
    }

    async create(
        resource: string,
        params: CreateParams<CascadeTerminalCreate>
    ): Promise<CreateResult<CascadeTerminalSchema>> {
        const res = await cascadeTerminalEndpointsCreateCascadeTerminalEnigmaV1CascadeTerminalPost(
            params.data as CascadeTerminalCreate,
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

    async update(resource: string, params: UpdateParams): Promise<UpdateResult<CascadeTerminalSchema>> {
        const res = await cascadeTerminalEndpointsUpdateCascadeTerminalEnigmaV1CascadeTerminalCascadeTerminalIdPut(
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
                data: res.data.data
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return Promise.reject();
    }

    async delete(resource: string, params: DeleteParams): Promise<DeleteResult<Pick<CascadeTerminalSchema, "id">>> {
        const res =
            await cascadeTerminalEndpointsRemoveTerminalFromCascadeEnigmaV1CascadeTerminalCascadeTerminalIdDelete(
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
}
