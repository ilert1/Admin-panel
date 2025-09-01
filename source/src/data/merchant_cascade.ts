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
import { MerchantCascadeCreate, MerchantCascadeSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";

import {
    merchantCascadeEndpointsListMerchantCascadesEnigmaV1MerchantCascadeGet,
    merchantCascadeEndpointsAssignCascadeToMerchantEnigmaV1MerchantCascadePost,
    merchantCascadeEndpointsGetMerchantCascadeEnigmaV1MerchantCascadeMerchantCascadeIdGet,
    merchantCascadeEndpointsUpdateMerchantCascadeEnigmaV1MerchantCascadeMerchantCascadeIdPut,
    merchantCascadeEndpointsRemoveCascadeFromMerchantEnigmaV1MerchantCascadeMerchantCascadeIdDelete
} from "@/api/enigma/merchant-cascade/merchant-cascade";

export class CascadeMerchantsDataProvider extends IBaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult<MerchantCascadeSchema>> {
        // "cascade_kind" | "src_currency_code" | "merchant" | "cascade_type"

        const fieldsForSearch = params.filter
            ? Object.keys(params.filter).filter(
                  item =>
                      item === "cascade_kind" ||
                      item === "src_currency_code" ||
                      item === "merchant" ||
                      item === "cascade_type"
              )
            : [];

        const res = await merchantCascadeEndpointsListMerchantCascadesEnigmaV1MerchantCascadeGet(
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

    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult<MerchantCascadeSchema>> {
        const res = await merchantCascadeEndpointsGetMerchantCascadeEnigmaV1MerchantCascadeMerchantCascadeIdGet(
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
        params: CreateParams<MerchantCascadeCreate>
    ): Promise<CreateResult<MerchantCascadeSchema>> {
        const res = await merchantCascadeEndpointsAssignCascadeToMerchantEnigmaV1MerchantCascadePost(
            params.data as MerchantCascadeCreate,
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

    async update(resource: string, params: UpdateParams): Promise<UpdateResult<MerchantCascadeSchema>> {
        const res = await merchantCascadeEndpointsUpdateMerchantCascadeEnigmaV1MerchantCascadeMerchantCascadeIdPut(
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

    async delete(resource: string, params: DeleteParams): Promise<DeleteResult<Pick<MerchantCascadeSchema, "id">>> {
        const res =
            await merchantCascadeEndpointsRemoveCascadeFromMerchantEnigmaV1MerchantCascadeMerchantCascadeIdDelete(
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
