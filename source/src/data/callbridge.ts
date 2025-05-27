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
import { Merchant } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { CallbackMappingCreate } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";
import {
    callbackHistoryEndpointsListHistoryCallbridgeV1HistoryGet,
    callbackHistoryEndpointsGetCallbackCallbridgeV1HistoryCallbackIdGet,
    callbackHistoryEndpointsRetryByCallbackIdCallbridgeV1HistoryCallbackIdRetryGet
} from "@/api/callbridge/callback-history/callback-history";
import {
    callbackMappingEndpointsListMappingsCallbridgeV1MappingGet,
    callbackMappingEndpointsGetMappingCallbridgeV1MappingMappingIdGet,
    callbackMappingEndpointsCreateMappingCallbridgeV1MappingPost,
    callbackMappingEndpointsUpdateMappingCallbridgeV1MappingMappingIdPut,
    callbackMappingEndpointsDeleteMappingCallbridgeV1MappingMappingIdDelete
} from "@/api/callbridge/callback-mapping/callback-mapping";
// /history/{history_id}/retry
export class CallbridgeDataProvider extends IBaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult> {
        const fieldsForSearch = Object.keys(params.filter).filter(
            item =>
                item === "name" ||
                item === "description" ||
                item === "internal_path" ||
                item === "external_path" ||
                item === "mapping_id" ||
                item === "callback_id" ||
                item === "original_url" ||
                item === "trigger_type" ||
                item === "status"
        );

        const fn = resource.includes("mapping")
            ? callbackMappingEndpointsListMappingsCallbridgeV1MappingGet
            : callbackHistoryEndpointsListHistoryCallbridgeV1HistoryGet;

        const res = await fn(
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

    async getHistoryById(resource: string, params: GetOneParams): Promise<GetOneResult> {
        const res = await callbackHistoryEndpointsGetCallbackCallbridgeV1HistoryCallbackIdGet(
            params.id,
            {},
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

    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult> {
        const res = await callbackMappingEndpointsGetMappingCallbridgeV1MappingMappingIdGet(params.id, {
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

    async create(resource: string, params: CreateParams<CallbackMappingCreate>): Promise<CreateResult> {
        const res = await callbackMappingEndpointsCreateMappingCallbridgeV1MappingPost(
            params.data as CallbackMappingCreate,
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

    async update(resource: string, params: UpdateParams): Promise<UpdateResult> {
        const res = await callbackMappingEndpointsUpdateMappingCallbridgeV1MappingMappingIdPut(params.id, params.data, {
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

    async delete(resource: string, params: DeleteParams): Promise<DeleteResult<Pick<Merchant, "id">>> {
        const res = await callbackMappingEndpointsDeleteMappingCallbridgeV1MappingMappingIdDelete(params.id, {
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

    async retryHistory(params: GetOneParams) {
        const res = await callbackHistoryEndpointsRetryByCallbackIdCallbridgeV1HistoryCallbackIdRetryGet(params.id, {
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
