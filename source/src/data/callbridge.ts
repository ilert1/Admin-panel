import { DeleteParams, DeleteResult, GetListParams, GetOneParams, UpdateParams } from "react-admin";
import { BaseDataProvider } from "./base";
import { Merchant } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import {
    callbackMappingEndpointsCreateMappingCallbridgeV1MappingPost,
    callbackMappingEndpointsDeleteMappingCallbridgeV1MappingMappingIdDelete,
    callbackMappingEndpointsGetMappingCallbridgeV1MappingMappingIdGet,
    callbackMappingEndpointsListMappingsCallbridgeV1MappingGet,
    callbackMappingEndpointsUpdateMappingCallbridgeV1MappingMappingIdPut
} from "@/api/enigma/callback-mapping/callback-mapping";
import {
    callbackHistoryEndpointsGetCallbackCallbridgeV1HistoryCallbackIdGet,
    callbackHistoryEndpointsListHistoryCallbridgeV1HistoryGet
} from "@/api/enigma/callback-history/callback-history";
import { CallbackMappingCreate } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";

export class CallbridgeDataProvider extends BaseDataProvider {
    async getList(resource: string, params: GetListParams) {
        const fieldsForSearch = Object.keys(params.filter).filter(item => item === "id");

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

    // async getListWithoutPagination(): Promise<GetListResult<Merchant>> {
    //     const res = await merchantEndpointsListMerchantsEnigmaV1MerchantGet(
    //         {
    //             currentPage: 1,
    //             pageSize: 1000
    //         },
    //         {
    //             headers: {
    //                 authorization: `Bearer ${localStorage.getItem("access-token")}`
    //             }
    //         }
    //     );

    //     if ("data" in res.data && res.data.success) {
    //         return {
    //             data: res.data.data.items,
    //             total: res.data.data.total
    //         };
    //     } else if ("data" in res.data && !res.data.success) {
    //         throw new Error(res.data.error?.error_message);
    //     } else if ("detail" in res.data) {
    //         throw new Error(res.data.detail?.[0].msg);
    //     }

    //     return {
    //         data: [],
    //         total: 0
    //     };
    // }

    async getHistoryById(resource: string, params: GetOneParams) {
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

    async getOne(resource: string, params: GetOneParams) {
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

    async create(resource: string, params: { data: CallbackMappingCreate }) {
        const res = await callbackMappingEndpointsCreateMappingCallbridgeV1MappingPost(params.data, {
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

    async update(resource: string, params: UpdateParams) {
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
}
